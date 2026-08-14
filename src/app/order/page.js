import Link from "next/link";
import { notFound } from "next/navigation";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import OrderForm from "@/components/OrderForm";

import { getProductBySku } from "@/lib/googleSheets";

export const metadata = {
  title: "Place Order | Disegno",
  description:
    "Confirm your Peshawari Chappal order and delivery details.",
};

export default async function OrderPage({
  searchParams,
}) {
  const params = await searchParams;

  const fromCart =
    params?.from === "cart";

  const sku =
    typeof params?.sku === "string"
      ? params.sku
      : "";

  // ==========================================
  // CART CHECKOUT
  // ==========================================

  if (fromCart) {
    return (
      <>
        <Header />

        <main className="bg-cream min-h-screen border-b border-grey-200">
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

  // ==========================================
  // BUY NOW CHECKOUT
  // ==========================================

  if (!sku) {
    notFound();
  }

  const product =
    await getProductBySku(sku);

  if (!product) {
    notFound();
  }

  const size =
    typeof params?.size === "string"
      ? params.size
      : undefined;

  const color =
    typeof params?.color === "string"
      ? params.color
      : undefined;

  const quantity = Math.min(
    50,
    Math.max(
      1,
      Number(params?.quantity) || 1
    )
  );

  return (
    <>
      <Header />

      <main className="bg-cream min-h-screen border-b border-grey-200">
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

            <OrderForm
              product={product}
              initialSize={size}
              initialColor={color}
              initialQuantity={quantity}
            />

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}