import { fallbackProducts, PRODUCT_IMAGE } from "@/data/products";

const SHEET_ID = "15Bad1tfOwUmbozMDdLAnEGqNP7_8fxxroXnUyDSXWzE";
const SHEET_BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

const fallbackVariants = fallbackProducts.flatMap((product) =>
  ["7", "8", "9", "10"].map((size, index) => ({
    productSku: product.sku,
    size,
    color: product.color || "Burgundy",
    variantOriginalPrice: product.productPrice + index * 100,
    variantDiscountPrice: product.discountPrice
      ? product.discountPrice + index * 100
      : null,
    variantImage: product.productImage,
    status: "Active",
  }))
);

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

export async function getProducts() {
  try {
    const rows = await fetchSheetRows("sheet1");
    const products = rows
      .map((row) => ({
        sku: row.SKU,
        productName: row.ProdutName,
        productPrice: toNumber(row.ProductPrice),
        discountPrice: toNumber(row.DiscountPrice),
        productDescription: row.ProductDescription,
        productImage: row.ProductImage || PRODUCT_IMAGE,
        status: "Active",
      }))
      .filter((product) => product.sku && product.productName);

    return products.length > 0 ? products : fallbackProducts;
  } catch (error) {
    console.warn(error.message);
    return fallbackProducts;
  }
}

export async function getVariants() {
  try {
    const rows = await fetchSheetRows("sheet2");
    const variants = rows
      .map((row) => ({
        productSku: row["Product SKU"],
        size: row.Size,
        color: row.Color,
        variantOriginalPrice: toNumber(row.VariantOrignalPrice),
        variantDiscountPrice: toNumber(row.VariantDiscountPrice),
        variantImage: row.VariantImage || PRODUCT_IMAGE,
        status: row.Status || "Active",
      }))
      .filter((variant) => variant.productSku && variant.status !== "Inactive");

    return variants.length > 0 ? variants : fallbackVariants;
  } catch (error) {
    console.warn(error.message);
    return fallbackVariants;
  }
}

export async function getProductBySku(sku) {
  const products = await getProducts();
  return products.find((product) => product.sku === decodeURIComponent(sku));
}

export async function getVariantsBySku(sku) {
  const variants = await getVariants();
  const decodedSku = decodeURIComponent(sku);

  return variants.filter((variant) => variant.productSku === decodedSku);
}
