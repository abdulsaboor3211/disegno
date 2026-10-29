import { fallbackProducts } from "@/data/products";
import { isValidImageSrc, normalizeImageUrl, parseImageUrls } from "@/lib/imageUrl";
import { formatVariantLabel, normalizeVariantKey, withCategoryVariantOptions } from "@/lib/variants";

const SHEET_ID = "1YpRfa0F53dJ6OT_4FIcpMIwE331ZK7l0WRYqQbJU59c";
const SHEET_BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
const SHEET_TABS = { Sheet1: "0", Variants: "2034096658", Categories: "199410352" };

function csvUrl(sheetName) {
  // Raw CSV preserves mixed numeric/text columns; gviz drops minority value types.
  return `${SHEET_BASE_URL}&gid=${SHEET_TABS[sheetName]}`;
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const nextChar = csv[index + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      row.push(value);
      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value);
  if (row.some((cell) => cell.trim() !== "")) {
    rows.push(row);
  }

  return rows;
}

function rowsToObjects(csv) {
  const [headers = [], ...rows] = parseCsv(csv);
  const normalizedHeaders = headers.map((header) => header.trim());

  return rows.map((row) =>
    normalizedHeaders.reduce((item, header, index) => {
      item[header] = (row[index] || "").trim();
      return item;
    }, {})
  );
}

function toNumber(value) {
  if (!value) {
    return null;
  }

  const parsed = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchSheetRows(sheetName) {
  const response = await fetch(csvUrl(sheetName), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Google Sheet ${sheetName} returned ${response.status}`);
  }

  const csv = await response.text();
  return rowsToObjects(csv);
}

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function getVariantOptions(row) {
  const normalizedRow = Object.entries(row).reduce((result, [key, value]) => {
    result[normalizeHeader(key)] = value;
    return result;
  }, {});

  return Object.entries(normalizedRow).sort(([left], [right]) =>
    Number(left.match(/\d+$/)?.[0] || 1) - Number(right.match(/\d+$/)?.[0] || 1)
  ).reduce(
    (variant, [header, rawType]) => {
      const match = header.match(/^variants? type(?: (\d+))?$/);

      if (!match) {
        return variant;
      }

      const suffix = match[1] ? ` ${match[1]}` : "";
      const rawUnit = normalizedRow[`unit${suffix}`];
      const key = normalizeVariantKey(rawType);
      const unit = String(rawUnit ?? "").trim();

      if (!key || !unit) {
        return variant;
      }

      variant.options[key] = unit;
      variant.labels[key] = formatVariantLabel(rawType);
      return variant;
    },
    { options: {}, labels: {} }
  );
}

// Each row is one purchasable combination. Numbered type/unit column pairs
// are discovered dynamically (variant type, variant type 2, type 3, ...).
async function fetchProductVariants() {
  try {
    const rows = await fetchSheetRows("Variants");

    const variants = rows.map((row) => {
      const productId =
        row["product id"] ||
        row["product_id"] ||
        row["Product ID"] ||
        row["Product"] ||
        "";

      const stock =
        row["stock"] ||
        row["Stock"] ||
        "0";
      const stockQuantity = Number(stock.replaceAll(",", ""));

      const { options, labels } = getVariantOptions(row);

      return {
        productId: String(productId).trim(),
        options,
        labels,
        stock: Number.isFinite(stockQuantity) ? Math.max(0, stockQuantity) : 0,
      };
    }).filter((variant) => variant.productId && Object.keys(variant.options).length > 0);

    return variants;
  } catch (error) {
    console.error("❌ Error fetching variants:", error);
    return [];
  }
}

export async function getProducts() {
  try {
    const [rows, variants] = await Promise.all([
      fetchSheetRows("Sheet1"),
      fetchProductVariants(),
    ]);

    // Group variants by product_id
    const variantsByProduct = {};
    variants.forEach((variant) => {
      if (!variantsByProduct[variant.productId]) {
        variantsByProduct[variant.productId] = [];
      }
      variantsByProduct[variant.productId].push(variant);
    });

    const products = rows
      .map((row) => {
        const productId = String(row["Product"] || "").trim();
        const productVariants = variantsByProduct[productId] || [];
        const productImages = parseImageUrls(row["Product Image"]);

        const variantTypesByKey = new Map();

        productVariants.forEach((variant) => {
          Object.entries(variant.options).forEach(([key, value]) => {
            if (!variantTypesByKey.has(key)) {
              variantTypesByKey.set(key, {
                key,
                label: variant.labels[key] || formatVariantLabel(key),
                values: [],
              });
            }

            const type = variantTypesByKey.get(key);
            if (!type.values.includes(value)) {
              type.values.push(value);
            }
          });
        });

        const variantTypes = Array.from(variantTypesByKey.values());

        // Keep the old size fields for compatibility with any existing UI/data users.
        const sizeStockMap = {};
        productVariants.forEach((variant) => {
          const size = variant.options.size;
          if (size) {
            sizeStockMap[size] = (sizeStockMap[size] || 0) + variant.stock;
          }
        });

        // Available sizes = sizes with stock > 0
        const availableSizes = Object.keys(sizeStockMap).filter(
          (size) => sizeStockMap[size] > 0
        );

        return {
          sku: productId,
          productName: row["Product Name"],
          category: row["Category"] || "",
          productPrice: toNumber(row["Product Price"]),
          discountPrice: toNumber(row["Discount Price"]),
          productDescription: row["Product Description"] || "",
          variants: productVariants.map(({ options, stock }) => ({ options, stock })),
          variantTypes,
          sizeStockMap,
          availableSizes,
          allSizes: Object.keys(sizeStockMap),
          productImage: productImages[0] || "",
          productImages,
          posterImage: "",
          img1: "",
          img2: "",
          img3: "",
          img4: "",
          img5: "",
          img6: "",
          img7: "",
          img8: "",
          img9: "",
          img10: "",
          status: row["Status"] || "available",
          slug: row["Slug"] || "",
          metaDescription: row["Meta description"] || "",
        };
      })
      .filter(
        (product) =>
          product.sku &&
          product.productName &&
          product.status.toLowerCase() !== "inactive"
      );

    return products.length > 0 ? withCategoryVariantOptions(products) : fallbackProducts;
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    return fallbackProducts;
  }
}

// Get categories from Categories sheet
export async function getCategoriesFromSheet() {
  try {
    const rows = await fetchSheetRows("Categories");

    if (!rows || rows.length === 0) {
      return [];
    }

    const categories = rows
      .map((row) => ({
        name: row["Name"] || "",
        parent: row["Parent"] || "",
        image: isValidImageSrc(row["Image"])
          ? normalizeImageUrl(row["Image"])
          : "",
        slug: row["Name"]?.toLowerCase().replace(/ /g, "-") || "",
        count: 0,
      }))
      .filter((category) => category.name);

    if (categories.length > 0) {
      const products = await getProducts();
      categories.forEach((cat) => {
        cat.count = products.filter(p => p.category === cat.name).length;
      });
    }

    return categories;
  } catch (error) {
    console.error("❌ Error fetching categories:", error.message);
    return [];
  }
}

export async function getProductBySku(sku) {
  const products = await getProducts();
  return products.find((product) => product.sku === decodeURIComponent(sku));
}
