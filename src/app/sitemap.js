import { getProducts } from "@/lib/googleSheets";

const BASE_URL = "https://disegnoproducts.com";

export default async function sitemap() {
  const products = await getProducts();

  const productUrls = products.map((product) => ({
    url: `${BASE_URL}/products/${encodeURIComponent(product.sku)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...productUrls,
  ];
}