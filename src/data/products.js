export const PRODUCT_IMAGE =
  "https://berastores.com/cdn/shop/files/burgundy_T-shape__peshawari_chappal_side_view.webp?v=1728728546&width=360";

export const fallbackProducts = [
  {
    sku: "BK-001",
    productName: "Classic Burgundy Peshawari Kheri",
    productPrice: 5500,
    discountPrice: 4999,
    productDescription:
      "Hand-stitched burgundy leather kheri with contrast cream stitching. A timeless Peshawari classic for weddings and formal gatherings.",
    productImage: PRODUCT_IMAGE,
    color: "Burgundy",
    status: "Active",
  },
  {
    sku: "BK-002",
    productName: "Traditional Brown Disegno Kheri",
    productPrice: 4800,
    discountPrice: 4299,
    productDescription:
      "Rich chocolate brown leather with a squared toe and sturdy ankle strap. Comfortable for all-day wear.",
    productImage: PRODUCT_IMAGE,
    color: "Brown",
    status: "Active",
  },
  {
    sku: "BK-003",
    productName: "Black Premium Peshawari Chappal",
    productPrice: 5200,
    discountPrice: null,
    productDescription:
      "Sleek black leather finish with brass buckle detail. Perfect for pairing with shalwar kameez or modern casual wear.",
    productImage: PRODUCT_IMAGE,
    color: "Black",
    status: "Active",
  },
  {
    sku: "BK-004",
    productName: "Tan Heritage Kheri",
    productPrice: 4600,
    discountPrice: 3999,
    productDescription:
      "Warm tan leather inspired by traditional Peshawari craftsmanship. Lightweight sole for everyday comfort.",
    productImage: PRODUCT_IMAGE,
    color: "Tan",
    status: "Active",
  },
  {
    sku: "BK-005",
    productName: "Olive Green Handmade Kheri",
    productPrice: 5000,
    discountPrice: 4499,
    productDescription:
      "Distinctive olive green leather with hand-finished edges. A unique addition to your footwear collection.",
    productImage: PRODUCT_IMAGE,
    color: "Olive Green",
    status: "Active",
  },
  {
    sku: "BK-006",
    productName: "Navy Blue Peshawari Chappal",
    productPrice: 4900,
    discountPrice: null,
    productDescription:
      "Deep navy leather kheri with gold-tone buckle. Elegant enough for Eid celebrations and family events.",
    productImage: PRODUCT_IMAGE,
    color: "Navy Blue",
    status: "Active",
  },
  {
    sku: "BK-007",
    productName: "Camel Suede Finish Kheri",
    productPrice: 5400,
    discountPrice: 4799,
    productDescription:
      "Soft camel-toned leather with suede-like finish. Premium comfort for long gatherings and casual outings.",
    productImage: PRODUCT_IMAGE,
    color: "Camel",
    status: "Active",
  },
  {
    sku: "BK-008",
    productName: "Maroon Wedding Special Kheri",
    productPrice: 6500,
    discountPrice: 5799,
    productDescription:
      "Our finest maroon leather kheri with extra padding and decorative stitching. Made for your most special occasions.",
    productImage: PRODUCT_IMAGE,
    color: "Maroon",
    status: "Active",
  },
];

export const products = fallbackProducts;

export function formatPrice(amount) {
  if (!amount) {
    return "";
  }

  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}
