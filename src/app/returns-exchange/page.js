import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Returns & Exchange | Disegno",
    description: "Understand Disegno's return and exchange policy. Easy 7-day returns and exchanges for all products.",
};

export default function ReturnsExchangePage() {
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
                                Customer Satisfaction
                            </p>
                            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                                Returns & Exchange
                            </h1>
                        </div>

                        <div className="bg-white border border-grey-200 p-6 sm:p-8 lg:p-10">
                            {/* Guarantee Banner */}
                            <div className="bg-cream border border-burgundy/20 p-4 sm:p-6 rounded-lg mb-8 text-center">
                                <p className="text-burgundy font-semibold text-base sm:text-lg">
                                    ✅ 7-Day Money Back Guarantee • Easy Returns & Exchange
                                </p>
                            </div>

                            <div className="text-grey-700 space-y-6">
                                <h2 className="font-serif text-2xl font-semibold text-foreground">
                                    Return Policy
                                </h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-burgundy font-bold mt-1">•</span>
                                        <span><strong>7-Day Return:</strong> You can return any item within 7 days of delivery.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-burgundy font-bold mt-1">•</span>
                                        <span><strong>Condition:</strong> Items must be unused, unworn, and in original packaging.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-burgundy font-bold mt-1">•</span>
                                        <span><strong>Refund:</strong> Refunds are processed within 3-5 business days after we receive the returned item.</span>
                                    </li>
                                </ul>

                                <h2 className="font-serif text-2xl font-semibold text-foreground pt-4">
                                    Exchange Policy
                                </h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-burgundy font-bold mt-1">•</span>
                                        <span><strong>Size Exchange:</strong> If the size doesn't fit, we'll exchange it for the right size.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-burgundy font-bold mt-1">•</span>
                                        <span><strong>Color Exchange:</strong> If you prefer a different color, we'll exchange it (subject to availability).</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-burgundy font-bold mt-1">•</span>
                                        <span><strong>Free Exchange:</strong> First exchange is free. Additional exchanges may have a small fee.</span>
                                    </li>
                                </ul>

                                <h2 className="font-serif text-2xl font-semibold text-foreground pt-4">
                                    How to Return or Exchange
                                </h2>
                                <ol className="space-y-3 list-decimal pl-6">
                                    <li>
                                        <strong>Contact Us:</strong> Reach out via{" "}
                                        <a href="https://wa.me/923161819191" target="_blank" rel="noopener noreferrer" className="text-burgundy hover:underline">
                                            WhatsApp
                                        </a>{" "}
                                        or email at{" "}
                                        <a href="mailto:disegnoproducts@gmail.com" className="text-burgundy hover:underline">
                                            disegnoproducts@gmail.com
                                        </a>
                                    </li>
                                    <li><strong>Provide Details:</strong> Share your order number and reason for return/exchange.</li>
                                    <li><strong>Arrange Return:</strong> We'll arrange for pickup or provide return instructions.</li>
                                    <li><strong>Process:</strong> Once we receive the item, we'll process your refund or exchange.</li>
                                </ol>

                                <h2 className="font-serif text-2xl font-semibold text-foreground pt-4">
                                    Non-Returnable Items
                                </h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-burgundy font-bold mt-1">•</span>
                                        <span>Custom-made or personalized items</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-burgundy font-bold mt-1">•</span>
                                        <span>Items with visible wear or damage caused by the customer</span>
                                    </li>
                                </ul>

                                <div className="bg-cream p-4 sm:p-6 rounded-lg border border-grey-200 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-sm text-grey-600">
                                        <strong>Questions?</strong> We're here to help.
                                    </p>
                                    <div className="flex gap-3">
                                        <a
                                            href="https://wa.me/923161819191"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-2 bg-action text-white text-sm font-semibold hover:bg-action-dark transition-colors"
                                        >
                                            💬 Chat on WhatsApp
                                        </a>
                                        <a
                                            href="mailto:disegnoproducts@gmail.com"
                                            className="inline-flex items-center gap-2 px-6 py-2 border-2 border-grey-300 text-grey-700 text-sm font-semibold hover:border-burgundy hover:text-burgundy transition-colors"
                                        >
                                            ✉️ Email Us
                                        </a>
                                    </div>
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