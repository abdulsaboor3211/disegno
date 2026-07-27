import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import OrderForm from "@/components/OrderForm";
import { getProductBySku } from "@/lib/googleSheets";

export const metadata = {
  title: "Place Order | Disegno",
  description: "Confirm your Peshawari Chappal order and delivery details.",
};

export default async function OrderPage({ searchParams }) {
  const params = await searchParams;
  const fromCart = params.from === "cart";
  const sku = typeof params.sku === "string" ? params.sku : "";

  if (fromCart) {
    return (
      <>
        <Header />
        <main className="bg-cream border-b border-grey-200">
          <section className="py-10 sm:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                href="/cart"
                className="inline-flex items-center text-sm text-grey-700 hover:text-burgundy mb-8"
              >
                ← Back to cart
              </Link>
              <div className="mb-8 sm:mb-10">
                <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                  Checkout
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                  Complete your order
                </h1>
              </div>
              <OrderForm fromCart />
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

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
              Choose a product from the shop to place an order, or open your
              cart.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/#products"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors"
              >
                Browse products
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-grey-300 text-grey-700 text-sm font-semibold uppercase tracking-wider hover:border-burgundy hover:text-burgundy transition-colors"
              >
                View cart
              </Link>
            </div>
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

  return (
    <>
      <Header />
      <main className="bg-cream border-b border-grey-200">
        <section className="py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/#products"
              className="inline-flex items-center text-sm text-grey-700 hover:text-burgundy mb-8"
            >
              ← Back to products
            </Link>
            <div className="mb-8 sm:mb-10">
              <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                Checkout
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                Complete your order
              </h1>
            </div>
            <OrderForm product={product} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
