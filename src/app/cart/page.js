import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CartPageContent from "@/components/CartPageContent";
import JsonLd from "@/components/JsonLd";
const cartSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Cart",
  description: "Review items in your cart before placing an order.",
  url: "https://disegnoproducts.com/cart",
};
export const metadata = {
  title: "Cart",
  description: "Review items in your cart before placing an order.",
  robots: {
    index: false,
    follow: false,
  },
};
//export const metadata = {
 // title: "Cart | Disegno",
 // description: "Review items in your cart before placing an order.",
//};

export default function CartPage() {
  return (
    <>
     <JsonLd data={cartSchema} />
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
                Shopping cart
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                Your cart
              </h1>
            </div>
            <CartPageContent />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
