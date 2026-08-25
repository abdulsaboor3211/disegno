import { fallbackProducts } from "@/data/products";
import { isValidImageSrc, normalizeImageUrl } from "@/lib/imageUrl";

const SHEET_ID = "1YpRfa0F53dJ6OT_4FIcpMIwE331ZK7l0WRYqQbJU59c";
const SHEET_BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

function csvUrl(sheetName) {
  return `${SHEET_BASE_URL}&sheet=${encodeURIComponent(sheetName)}`;
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const nextChar = csv[index + 1];

    if (char === '"' && nextChar === '"') {
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

function parseAvailableSizes(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);
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

// Fetch product variants (sizes with stock)
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

      const variantType =
        row["variants type"] ||
        row["variant type"] ||
        row["Variant Type"] ||
        "";

      const unit =
        row["unit"] ||
        row["Unit"] ||
        "";

      const stock =
        row["stock"] ||
        row["Stock"] ||
        "0";

      return {
        productId: String(productId).trim(),
        variantType: String(variantType).trim().toLowerCase(),
        unit: String(unit).trim(),
        stock: toNumber(stock) || 0,
      };
    });

    return variants;
  } catch (error) {
    console.error("❌ Error fetching variants:", error);
    return [];
  }
}

// Convert numeric size to full label format
function getFullSizeLabel(numericSize) {
  const sizeMap = {
    "39": "UK 5 / EU 39 / US 6 / PAK 7 / 24.5 cm",
    "40": "UK 6 / EU 40 / US 7 / PAK 8 / 25.1 cm",
    "41": "UK 7 / EU 41 / US 8 / PAK 9 / 25.7 cm",
    "42": "UK 8 / EU 42 / US 9 / PAK 10 / 26.3 cm",
    "43": "UK 9 / EU 43 / US 10 / PAK 11 / 26.9 cm",
    "44": "UK 10 / EU 44 / US 11 / PAK 12 / 27.5 cm",
    "45": "UK 11 / EU 45 / US 12 / PAK 13 / 28.1 cm",
    "46": "UK 12 / EU 46 / US 13 / PAK 14 / 28.7 cm",
    "47": "UK 13 / EU 47 / US 14 / PAK 15 / 29.3 cm",
    "48": "UK 14 / EU 48 / US 15 / PAK 16 / 29.9 cm",
  };
  return sizeMap[numericSize] || numericSize;
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

        // Build size stock map using FULL labels
        const sizeStockMap = {};
        productVariants.forEach((variant) => {
          if (
            variant.variantType === "size" ||
            variant.variantType === "sizes"
          ) {
            const fullLabel = getFullSizeLabel(variant.unit);
            if (fullLabel && fullLabel !== variant.unit) {
              sizeStockMap[fullLabel] = variant.stock;
            } else if (fullLabel) {
              sizeStockMap[variant.unit] = variant.stock;
            }
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
          sizeStockMap: sizeStockMap,
          availableSizes: availableSizes,
          allSizes: Object.keys(sizeStockMap),
          productImage: isValidImageSrc(row["Product Image"])
            ? normalizeImageUrl(row["Product Image"])
            : "",
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

    return products.length > 0 ? products : fallbackProducts;
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