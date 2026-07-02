import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import VariantCard from "@/components/VariantCard";
import { formatPrice } from "@/data/products";
import { getProductBySku, getProducts, getVariantsBySku } from "@/lib/googleSheets";

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    sku: product.sku,
  }));
}

export async function generateMetadata({ params }) {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    return {
      title: "Product Not Found | Disegno Kheri",
    };
  }

  return {
    title: `${product.productName} | Disegno Kheri`,
    description: product.productDescription,
  };
}

export default async function ProductVarietiesPage({ params }) {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    notFound();
  }

  const variants = await getVariantsBySku(sku);
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.productPrice;

  return (
    <>
      <Header />
      <main>
        <section className="bg-cream border-b border-grey-200 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/#products"
              className="inline-flex items-center text-sm text-grey-700 hover:text-burgundy mb-8"
            >
              ← Back to products
            </Link>

            <div className="grid lg:grid-cols-[420px_1fr] gap-8 lg:gap-12 items-center">
              <div className="bg-white border border-grey-200 p-6">
                <Image
                  src={product.productImage}
                  alt={product.productName}
                  width={520}
                  height={520}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>

              <div>
                <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                  Product Varieties
                </p>
                <p className="text-[11px] text-grey-500 uppercase tracking-widest mb-2">
                  SKU: {product.sku}
                </p>
                <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-foreground leading-tight mb-5">
                  {product.productName}
                </h1>
                <p className="text-grey-700 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
                  {product.productDescription}
                </p>

                <div className="flex items-end gap-3 mb-7">
                  {hasDiscount ? (
                    <>
                      <p className="text-3xl font-bold text-burgundy">
                        {formatPrice(product.discountPrice)}
                      </p>
                      <p className="text-lg text-grey-500 line-through pb-1">
                        {formatPrice(product.productPrice)}
                      </p>
                    </>
                  ) : (
                    <p className="text-3xl font-bold text-foreground">
                      {formatPrice(product.productPrice)}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                  <div className="bg-white border border-grey-200 p-4">
                    <p className="font-serif text-xl font-semibold text-burgundy">
                      {variants.length}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-grey-500 mt-1">
                      Available varieties
                    </p>
                  </div>
                  <div className="bg-white border border-grey-200 p-4">
                    <p className="font-serif text-xl font-semibold text-burgundy">
                      Size
                    </p>
                    <p className="text-xs uppercase tracking-wide text-grey-500 mt-1">
                      From sheet2
                    </p>
                  </div>
                  <div className="bg-white border border-grey-200 p-4">
                    <p className="font-serif text-xl font-semibold text-burgundy">
                      Color
                    </p>
                    <p className="text-xs uppercase tracking-wide text-grey-500 mt-1">
                      Variant wise
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                Sheet2 Data
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
                Choose Your Variety
              </h2>
              <p className="text-grey-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                These cards come from rows where Product SKU matches this
                product&apos;s SKU. Each variant can have its own size, color,
                price, discount price, image, and status.
              </p>
            </div>

            {variants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {variants.map((variant) => (
                  <VariantCard
                    key={`${variant.productSku}-${variant.size}-${variant.color}`}
                    variant={variant}
                  />
                ))}
              </div>
            ) : (
              <div className="border border-grey-200 bg-grey-100 p-8 text-center">
                <p className="font-serif text-2xl font-semibold text-foreground mb-2">
                  No varieties found
                </p>
                <p className="text-grey-500">
                  Add rows in sheet2 with Product SKU equal to {product.sku}.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
