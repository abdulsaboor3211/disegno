import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import OrderForm from "@/components/OrderForm";
import { getProductBySku, getVariantsBySku } from "@/lib/googleSheets";

export const metadata = {
  title: "Place Order | Disegno",
  description: "Confirm your Peshawari Kheri order and delivery details.",
};

export default async function OrderPage({ searchParams }) {
  const params = await searchParams;
  const sku = typeof params.sku === "string" ? params.sku : "";
  const size = typeof params.size === "string" ? params.size : "";
  const color = typeof params.color === "string" ? params.color : "";

  if (!sku) {
    return (
      <>
        <Header />
        <main className="py-16 sm:py-24 bg-cream">
          <div className="max-w-xl mx-auto px-4 text-center">
            <h1 className="font-serif text-3xl font-semibold text-foreground mb-4">
              No product selected
            </h1>
            <p className="text-grey-700 mb-8">
              Choose a variety from a product page to place an order.
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-burgundy text-white text-sm font-semibold uppercase tracking-wider hover:bg-burgundy-dark transition-colors"
            >
              Browse products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const product = await getProductBySku(sku);

  if (!product) {
    notFound();
  }

  const variants = await getVariantsBySku(sku);
  const variant =
    variants.find(
      (item) =>
        String(item.size || "") === size &&
        String(item.color || "") === color
    ) ||
    variants.find((item) => String(item.size || "") === size) ||
    variants.find((item) => String(item.color || "") === color) ||
    variants[0] ||
    null;

  return (
    <>
      <Header />
      <main className="bg-cream border-b border-grey-200">
        <section className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/products/${encodeURIComponent(product.sku)}`}
              className="inline-flex items-center text-sm text-grey-700 hover:text-burgundy mb-8"
            >
              ← Back to varieties
            </Link>
            <div className="mb-8 sm:mb-10">
              <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                Checkout
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                Complete your order
              </h1>
            </div>
            <OrderForm product={product} variant={variant} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
