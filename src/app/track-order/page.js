"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const mockOrders = {
    "BK-001": {
        status: "Delivered",
        date: "2024-12-15",
        details: "Your order has been delivered successfully. Thank you for shopping with Disegno!",
    },
    "BK-002": {
        status: "In Transit",
        date: "2024-12-17",
        details: "Your order is on its way to your location. Estimated delivery: 2-3 days.",
    },
    "BK-003": {
        status: "Processing",
        date: "2024-12-18",
        details: "Your order is being prepared for shipping. You'll receive tracking details soon.",
    },
};

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    function handleTrackOrder(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setOrderData(null);

        setTimeout(() => {
            const order = mockOrders[orderId.toUpperCase()];
            if (order) {
                setOrderData({ ...order, orderId: orderId.toUpperCase() });
            } else {
                setError("Order not found. Please check your order ID and try again.");
            }
            setIsLoading(false);
        }, 800);
    }

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
                                Order Tracking
                            </p>
                            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                                Track Your Order
                            </h1>
                            <p className="text-grey-600 mt-2">
                                Enter your order ID to check the current status of your delivery.
                            </p>
                        </div>

                        <div className="bg-white border border-grey-200 p-6 sm:p-8 lg:p-10">
                            <form onSubmit={handleTrackOrder} className="mb-8">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        placeholder="Enter Order ID (e.g., BK-001)"
                                        className="flex-1 border border-grey-300 bg-white px-4 py-3 text-sm text-foreground focus:outline-none focus:border-burgundy"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-8 py-3 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors disabled:opacity-60 whitespace-nowrap"
                                    >
                                        {isLoading ? "Tracking..." : "Track Order"}
                                    </button>
                                </div>
                            </form>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 flex items-start gap-3">
                                    <span className="text-lg">⚠️</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            {orderData && (
                                <div className="border-t border-grey-200 pt-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <p className="text-sm text-grey-500">Order ID</p>
                                            <p className="font-serif text-xl font-semibold text-foreground">{orderData.orderId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-grey-500">Date</p>
                                            <p className="font-medium text-foreground">{orderData.date}</p>
                                        </div>
                                    </div>

                                    <div className="bg-cream p-6 rounded-lg text-center border border-grey-200 mb-6">
                                        <div className="text-4xl mb-3">
                                            {orderData.status === "Delivered" && "✅"}
                                            {orderData.status === "In Transit" && "🚚"}
                                            {orderData.status === "Processing" && "⏳"}
                                        </div>
                                        <p className={`text-lg font-semibold ${orderData.status === "Delivered" ? "text-green-600" :
                                                orderData.status === "In Transit" ? "text-blue-600" :
                                                    "text-yellow-600"
                                            }`}>
                                            {orderData.status}
                                        </p>
                                        <p className="text-sm text-grey-600 mt-2">{orderData.details}</p>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-grey-100">
                                        <Link
                                            href="/#products"
                                            className="text-sm text-grey-600 hover:text-burgundy transition-colors"
                                        >
                                            Continue Shopping
                                        </Link>
                                        <span className="text-grey-300">|</span>
                                        <a
                                            href="https://wa.me/923161819191"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-grey-600 hover:text-burgundy transition-colors"
                                        >
                                            Contact Support
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 text-center text-sm text-grey-500 border-t border-grey-200 pt-6">
                                <p>
                                    Didn't receive your order ID?{" "}
                                    <a
                                        href="https://wa.me/923161819191"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-burgundy font-medium hover:underline"
                                    >
                                        Contact us on WhatsApp
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}