import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Shipping & Delivery | Disegno",
    description: "Learn about Disegno's shipping policy, delivery times, and free shipping conditions across Pakistan.",
};

export default function ShippingDeliveryPage() {
    return (
        <>
            <Header />
            <main className="bg-cream border-b border-grey-200">
                <section className="py-10 sm:py-14">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-grey-700 hover:text-burgundy mb-8"
                        >
                            ← Back to home
                        </Link>

                        <div className="mb-8 sm:mb-10">
                            <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                                Delivery Information
                            </p>
                            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                                Shipping & Delivery
                            </h1>
                        </div>

                        <div className="bg-white border border-grey-200 p-6 sm:p-8 lg:p-10">
                            {/* Free Shipping Banner */}
                            <div className="bg-cream border border-burgundy/20 p-4 sm:p-6 rounded-lg mb-8 text-center">
                                <p className="text-burgundy font-semibold text-base sm:text-lg">
                                    🚚 Free Delivery on Orders Above Rs. 5,000 Across Pakistan
                                </p>
                            </div>

                            <div className="text-grey-700 space-y-6">
                                <h2 className="font-serif text-2xl font-semibold text-foreground">
                                    Delivery Options
                                </h2>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div className="border border-grey-200 p-4 text-center hover:border-burgundy transition-colors">
                                        <p className="text-2xl mb-1">📦</p>
                                        <p className="font-semibold text-foreground">Standard</p>
                                        <p className="text-sm text-grey-500">3-5 Business Days</p>
                                        <p className="text-sm font-semibold text-burgundy">Rs. 250</p>
                                    </div>
                                    <div className="border border-grey-200 p-4 text-center hover:border-burgundy transition-colors">
                                        <p className="text-2xl mb-1">⚡</p>
                                        <p className="font-semibold text-foreground">Express</p>
                                        <p className="text-sm text-grey-500">1-2 Business Days</p>
                                        <p className="text-sm font-semibold text-burgundy">Rs. 500</p>
                                    </div>
                                    <div className="border-2 border-burgundy p-4 text-center bg-cream">
                                        <p className="text-2xl mb-1">🎁</p>
                                        <p className="font-semibold text-foreground">Free Shipping</p>
                                        <p className="text-sm text-grey-500">Orders Above Rs. 5,000</p>
                                        <p className="text-sm font-semibold text-burgundy">FREE</p>
                                    </div>
                                </div>

                                <h2 className="font-serif text-2xl font-semibold text-foreground pt-4">
                                    Delivery Areas
                                </h2>
                                <p className="text-grey-600">
                                    We deliver to all major cities across Pakistan:
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Peshawar", "Quetta", "Faisalabad", "Multan", "Hyderabad", "Gujranwala", "Sialkot", "Abbottabad"].map((city) => (
                                        <span key={city} className="text-sm text-grey-700">• {city}</span>
                                    ))}
                                </div>

                                <h2 className="font-serif text-2xl font-semibold text-foreground pt-4">
                                    Tracking Your Order
                                </h2>
                                <p className="text-grey-600">
                                    Once your order is shipped, you will receive a tracking number via WhatsApp.
                                    You can track your order on our{" "}
                                    <Link href="/track-order" className="text-burgundy hover:underline font-medium">
                                        Track Order
                                    </Link>{" "}
                                    page.
                                </p>

                                <div className="bg-cream p-4 sm:p-6 rounded-lg border border-grey-200 mt-6">
                                    <p className="text-sm text-grey-600 flex items-start gap-3">
                                        <span className="text-burgundy text-lg">ℹ️</span>
                                        <span>
                                            <strong>Note:</strong> Delivery times may vary during holidays or peak seasons.
                                            For any questions, contact us on{" "}
                                            <a href="https://wa.me/923161819191" target="_blank" rel="noopener noreferrer" className="text-burgundy hover:underline font-medium">
                                                WhatsApp
                                            </a>{" "}
                                            or email{" "}
                                            <a href="mailto:disegnoproducts@gmail.com" className="text-burgundy hover:underline font-medium">
                                                disegnoproducts@gmail.com
                                            </a>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}