export const PRODUCT_IMAGE =
  "https://berastores.com/cdn/shop/files/burgundy_T-shape__peshawari_chappal_side_view.webp?v=1728728546&width=360";

export const fallbackProducts = [
  {
    sku: "BK-001",
    productName: "Classic Burgundy Peshawari Chappal",
    productPrice: 5500,
    discountPrice: 4999,
    productDescription:
      "Handmade burgundy leather Peshawari chappal with contrast cream stitching. A timeless traditional style designed for weddings, formal gatherings, and special occasions.",
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
    productName: "Traditional Brown Peshawari Chappal",
    productPrice: 4800,
    discountPrice: 4299,
    productDescription:
      "Traditional brown Peshawari chappal crafted from rich leather with a squared toe and sturdy ankle strap. Designed for comfort, durability, and everyday wear.",
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
    sku: "BK-003",
    productName: "Black Premium Peshawari Chappal",
    productPrice: 5200,
    discountPrice: null,
    productDescription:
      "Premium black Peshawari chappal crafted from high-quality leather with a refined buckle detail. A versatile handmade style for traditional and modern outfits.",
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
    sku: "BK-004",
    productName: "Tan Heritage Peshawari Chappal",
    productPrice: 4600,
    discountPrice: 3999,
    productDescription:
      "Tan leather Peshawari chappal inspired by traditional craftsmanship. Handmade for everyday comfort with a lightweight and durable design.",
    productImage: PRODUCT_IMAGE,
    posterImage: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    img5: "",
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