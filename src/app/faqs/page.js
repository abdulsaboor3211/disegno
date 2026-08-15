"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
    {
        question: "What is a Peshawari Chappal?",
        answer: "A Peshawari Chappal is a traditional handcrafted leather shoe originating from Peshawar, Pakistan. It's known for its distinctive design, comfort, and durability. Each pair is crafted by skilled artisans using premium leather and traditional techniques passed down through generations.",
    },
    {
        question: "How do I choose the right size?",
        answer: "We recommend selecting your usual shoe size. If you're between sizes, we suggest sizing up for comfort. Our sizes are in UK/EU standards. You can also contact us on WhatsApp for personalized size guidance from our experts.",
    },
    {
        question: "How long does delivery take?",
        answer: "Standard delivery takes 3-5 business days across Pakistan. Express delivery is available in 1-2 business days. Free shipping is available on orders above Rs. 5,000. Delivery times may vary during holidays or peak seasons.",
    },
    {
        question: "Do you offer cash on delivery?",
        answer: "Yes! We offer Cash on Delivery (COD) across Pakistan. You can pay when you receive your order. We also accept bank transfers for advance payments.",
    },
    {
        question: "Can I return or exchange my order?",
        answer: "Yes, we offer a 7-day return and exchange policy. Items must be unused and in original packaging. Contact us via WhatsApp or email to initiate a return or exchange. We'll arrange pickup or provide return instructions.",
    },
    {
        question: "Are the products genuine leather?",
        answer: "Yes, all our products are crafted from genuine, high-quality leather. We use premium materials sourced from trusted suppliers to ensure durability, comfort, and timeless elegance.",
    },
    {
        question: "How do I track my order?",
        answer: "Once your order is shipped, you'll receive a tracking number via WhatsApp. You can also track your order on our Track Order page using your order ID. We'll keep you updated on every step of the delivery.",
    },
    {
        question: "Do you offer bulk orders?",
        answer: "Yes, we accept bulk orders for events, weddings, and corporate gifting. Contact us via WhatsApp or email for bulk order pricing, customization options, and delivery schedules.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept Cash on Delivery (COD) and bank transfers. We're working on adding more payment options like credit/debit cards in the future for your convenience.",
    },
    {
        question: "How can I contact customer support?",
        answer: "You can reach us via WhatsApp at +92 316 1819191 or email at disegnoproducts@gmail.com. We respond within 24 hours. Our team is here to help with any questions or concerns.",
    },
    {
        question: "Are your products handmade?",
        answer: "Yes, every pair of Disegno Chappal is handcrafted by skilled artisans in Peshawar. We take pride in preserving traditional craftsmanship while ensuring modern comfort and quality.",
    },
    {
        question: "Do you ship internationally?",
        answer: "Currently, we ship across Pakistan only. We're exploring international shipping options and will announce them soon. Stay connected with us for updates.",
    },
];

export default function FAQsPage() {
    const [openIndex, setOpenIndex] = useState(null);

    function toggleFAQ(index) {
        setOpenIndex(openIndex === index ? null : index);
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
                                Help Center
                            </p>
                            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
                                Frequently Asked Questions
                            </h1>
                            <p className="text-grey-600 mt-2">
                                Find answers to common questions about our products, shipping, returns, and more.
                            </p>
                        </div>

                        <div className="bg-white border border-grey-200 p-6 sm:p-8 lg:p-10">
                            <div className="space-y-3">
                                {faqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className={`border ${openIndex === index ? "border-burgundy" : "border-grey-200"
                                            } transition-colors`}
                                    >
                                        <button
                                            onClick={() => toggleFAQ(index)}
                                            className="w-full flex justify-between items-center p-4 text-left hover:bg-cream/50 transition-colors gap-4"
                                        >
                                            <span className={`font-medium ${openIndex === index ? "text-burgundy" : "text-foreground"
                                                } transition-colors`}>
                                                {faq.question}
                                            </span>
                                            <span className={`text-burgundy font-bold text-xl flex-shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""
                                                }`}>
                                                {openIndex === index ? "−" : "+"}
                                            </span>
                                        </button>
                                        <div
                                            className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 pb-4" : "max-h-0"
                                                }`}
                                        >
                                            <p className="text-grey-700 leading-relaxed border-t border-grey-100 pt-4">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Contact CTA */}
                            <div className="mt-8 bg-cream p-4 sm:p-6 rounded-lg border border-grey-200 text-center">
                                <p className="text-grey-700 mb-4">
                                    <span className="font-semibold">Still have questions?</span> We're here to help.
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <a
                                        href="https://wa.me/923161819191"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-action text-white text-sm font-semibold hover:bg-action-dark transition-colors"
                                    >
                                        💬 Chat on WhatsApp
                                    </a>
                                    <a
                                        href="mailto:disegnoproducts@gmail.com"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-grey-300 text-grey-700 text-sm font-semibold hover:border-burgundy hover:text-burgundy transition-colors"
                                    >
                                        ✉️ Email Us
                                    </a>
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