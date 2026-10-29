import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import ProductPageClient from "@/components/ProductPageClient";
import { getInitialVariantSelections, getSelectedVariantStock } from "@/lib/variants";
import { getProductBySku } from "@/lib/googleSheets";
import { isValidImageSrc } from "@/lib/imageUrl";

const BASE_URL = "https://disegnoproducts.com";

export async function generateMetadata({ params }) {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const description =
    product.productDescription ||
    `Shop ${product.productName} from Disegno.`;

  return {
    title: product.productName,
    description,
    alternates: {
      canonical: `/products/${encodeURIComponent(product.sku)}`,
    },
    openGraph: {
      title: product.productName,
      description,
      url: `/products/${encodeURIComponent(product.sku)}`,
      type: "website",
      images: isValidImageSrc(product.productImage)
        ? [
            {
              url: product.productImage,
              alt: product.productName,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.productName,
      description,
      images: isValidImageSrc(product.productImage)
        ? [product.productImage]
        : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    notFound();
  }

  const hasImage = isValidImageSrc(product.productImage);

  const hasDiscount =
    product.discountPrice &&
    product.productPrice &&
    product.discountPrice < product.productPrice;

  const currentPrice = hasDiscount
    ? product.discountPrice
    : product.productPrice;

  const productUrl = `${BASE_URL}/products/${encodeURIComponent(product.sku)}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    description:
      product.productDescription ||
      `${product.productName} by Disegno.`,
    sku: product.sku,
    url: productUrl,
    ...(hasImage && {
      image: product.productImage,
    }),
    brand: {
      "@type": "Brand",
      name: "Disegno",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "PKR",
      price: currentPrice,
      availability: (product.variants || []).length > 0 && getSelectedVariantStock(product, getInitialVariantSelections(product)) === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <JsonLd data={productSchema} />


      <Header />

      <ProductPageClient product={product} />

      <Footer />
    </>
  );
}
