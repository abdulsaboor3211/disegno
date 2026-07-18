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
    posterImage: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    img5: "",
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
    posterImage: "",
    img1: "",
    img2: "",
    img3: "",
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
    posterImage: "",
    img1: "",
    img2: "",
    img3: "",
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
    posterImage: "",
    img1: "",
    img2: "",
    img3: "",
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
