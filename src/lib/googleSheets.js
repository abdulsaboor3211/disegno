import { fallbackProducts } from "@/data/products";
import { isValidImageSrc, normalizeImageUrl } from "@/lib/imageUrl";

const SHEET_ID = "15Bad1tfOwUmbozMDdLAnEGqNP7_8fxxroXnUyDSXWzE";
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

function getPosterImage(row) {
  return row["poster-Image"] || "";
}

function getExtraImages(row) {
  const images = {};

  for (let i = 1; i <= 9; i++) {
    images[`img${i}`] = row[`img${i}`] || "";
  }

  return images;
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

export async function getProducts() {
  try {
    const rows = await fetchSheetRows("Sheet1");
    const products = rows
      .map((row) => {
        const posterRaw = getPosterImage(row);
        const extraImages = getExtraImages(row);

        const normalizedImages = {};

        Object.entries(extraImages).forEach(([key, value]) => {
          normalizedImages[key] = isValidImageSrc(value)
            ? normalizeImageUrl(value)
            : "";
        });

        return {
          sku: row.SKU,
          productName: row["Produt Name"],
          productPrice: toNumber(row["Product Price"]),
          discountPrice: toNumber(row["Discount Price"]),
          productDescription: row["Product Description"] || "",
          availableSizes: parseAvailableSizes(row["sizes"]),
          productImage: isValidImageSrc(row["Product Image"])
            ? normalizeImageUrl(row["Product Image"])
            : "",
          posterImage: isValidImageSrc(posterRaw)
            ? normalizeImageUrl(posterRaw)
            : "",
          ...normalizedImages,
          status: row.Status || "Active",
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
    console.error(error.message);
    return fallbackProducts;
  }
}

export async function getProductBySku(sku) {
  const products = await getProducts();
  return products.find((product) => product.sku === decodeURIComponent(sku));
}
