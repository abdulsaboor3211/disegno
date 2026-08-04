import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { formatPrice } from "@/data/products";
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
    `Shop ${product.productName}, a premium handmade Peshawari chappal from Disegno.`;

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
  const orderUrl = `/order?sku=${encodeURIComponent(product.sku)}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    description:
      product.productDescription ||
      `${product.productName} handmade Peshawari chappal by Disegno.`,
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
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <JsonLd data={productSchema} />

      <Header />

      <main className="bg-cream border-b border-grey-200">
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/#products"
              className="inline-flex items-center text-sm text-grey-700 hover:text-burgundy mb-8"
            >
              ← Back to products
            </Link>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
              <div className="relative aspect-[4/3] bg-white border border-grey-200 overflow-hidden">
                {hasImage ? (
                  <Image
                    src={product.productImage}
                    alt={product.productName}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-6 sm:p-10"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-grey-500">
                    Product image unavailable
                  </div>
                )}
              </div>

              <div>
                <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                  Disegno Collection
                </p>

                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-3">
                  {product.productName}
                </h1>

                <p className="text-xs text-grey-500 uppercase tracking-widest mb-6">
                  SKU: {product.sku}
                </p>

                <div className="mb-6">
                  {hasDiscount ? (
                    <div className="flex items-end gap-3">
                      <p className="text-2xl sm:text-3xl font-bold text-burgundy">
                        {formatPrice(product.discountPrice)}
                      </p>

                      <p className="text-base text-grey-500 line-through mb-1">
                        {formatPrice(product.productPrice)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                      {formatPrice(product.productPrice)}
                    </p>
                  )}
                </div>

                <div className="border-t border-grey-200 pt-6 mb-8">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Product details
                  </h2>

                  <p className="text-grey-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {product.productDescription ||
                      "Premium handmade Peshawari chappal crafted for comfort, style and everyday wear."}
                  </p>
                </div>

                <Link
                  href={orderUrl}
                  className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors"
                >
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}