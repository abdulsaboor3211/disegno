"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { formatPrice } from "@/data/products";

import {
    DEFAULT_PRODUCT_COLOR,
    DEFAULT_PRODUCT_SIZE,
    PRODUCT_COLORS,
    PRODUCT_SIZES,
} from "@/data/sizes";

import { useCart } from "@/context/CartContext";

import { isValidImageSrc } from "@/lib/imageUrl";
import { trackAddToCart, trackOrderNow } from "@/lib/analytics"; //

const BRAND_COLOR = "#7A2230";

function getShortSize(size) {
    const match = size.match(/UK\s*\*?(\d+)/i);
    return match ? `UK${match[1]}` : size;
}

function getProductImages(product) {
    const seen = new Set();
    const images = [];

    const addImage = (src) => {
        if (isValidImageSrc(src) && !seen.has(src)) {
            seen.add(src);
            images.push(src);
        }
    };

    // Main image
    addImage(product.productImage);

    // img1 → img10
    for (let i = 1; i <= 10; i++) {
        addImage(product[`img${i}`]);
    }

    return images;
}

// 👇 Get stock for a specific size
function getSizeStock(product, sizeLabel) {
    const sizeStockMap = product.sizeStockMap || {};
    return sizeStockMap[sizeLabel] || 0;
}

export default function ProductPageClient({ product }) {
    const { addItem } = useCart();

    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState(DEFAULT_PRODUCT_SIZE);
    const [color, setColor] = useState(DEFAULT_PRODUCT_COLOR);
    const [added, setAdded] = useState(false);

    const productImages = useMemo(
        () => getProductImages(product),
        [product]
    );

    const hasDiscount =
        product.discountPrice &&
        product.discountPrice < product.productPrice;

    const unitPrice = hasDiscount
        ? product.discountPrice
        : product.productPrice || 0;

    const total = unitPrice * quantity;

    const availableSizes = product.availableSizes || [];
    const sizeStockMap = product.sizeStockMap || {};

    function isSizeAvailable(sizeOption) {
        if (availableSizes.length === 0) {
            return true;
        }
        return availableSizes.some(
            (item) => getShortSize(item) === getShortSize(sizeOption)
        );
    }

    function getStockForSize(sizeOption) {
        return sizeStockMap[sizeOption] || 0;
    }

    /*
     * Add to cart with selected variant
     */
    function handleAddToCart() {
        const variant = { size, color };
        trackAddToCart(product, quantity, variant);
        addItem(product, quantity, {
            size,
            color,
        });

        setAdded(true);

        window.setTimeout(() => {
            setAdded(false);
        }, 1600);
    }

    /*
     * Buy Now - Pass selected variant to checkout
     */
    function handleBuyNow() {
        const variant = { size, color };
        trackOrderNow(product, quantity, variant);

        const params = new URLSearchParams({
            sku: product.sku,
            size,
            color,
            quantity: String(quantity),
        });

        window.location.href = `/order?${params.toString()}`;
    }

    const displayImage = selectedImage || productImages[0] || null;

    return (
        <main className="bg-cream border-b border-grey-200">
            <section className="py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Back */}
                    <Link
                        href="/#products"
                        className="inline-flex items-center text-sm text-grey-700 hover:text-burgundy mb-8"
                    >
                        ← Back to products
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

                        {/* =========================
                            LEFT - IMAGES
                        ========================== */}
                        <div className="bg-white border border-grey-200 p-4 sm:p-6 h-fit">

                            <div className="relative aspect-[4/3] bg-grey-100 overflow-hidden">
                                {isValidImageSrc(displayImage) ? (
                                    <Image
                                        src={displayImage}
                                        alt={product.productName}
                                        fill
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-contain p-6"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-grey-400 text-sm">
                                        No image available
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {productImages.length > 1 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {productImages.map((image, index) => {
                                        const active =
                                            (selectedImage || productImages[0]) === image;

                                        return (
                                            <button
                                                key={`${image}-${index}`}
                                                type="button"
                                                onClick={() => setSelectedImage(image)}
                                                aria-label={`View product image ${index + 1}`}
                                                className={`relative w-16 h-16 border-2 overflow-hidden bg-grey-100 ${active
                                                    ? "border-burgundy"
                                                    : "border-grey-200 hover:border-grey-400"
                                                    }`}
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`${product.productName} ${index + 1}`}
                                                    fill
                                                    sizes="64px"
                                                    className="object-contain p-1"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* =========================
                            RIGHT - DETAILS
                        ========================== */}
                        <div className="bg-white border border-grey-200 p-5 sm:p-8 h-fit">

                            {/* Product name */}
                            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground leading-tight mb-4">
                                {product.productName}
                            </h1>

                            {/* Price */}
                            <div className="flex items-end gap-3 mb-6">
                                {hasDiscount ? (
                                    <>
                                        <p className="text-2xl sm:text-3xl font-bold text-burgundy">
                                            {formatPrice(product.discountPrice)}
                                        </p>
                                        <p className="text-base text-grey-500 line-through pb-1">
                                            {formatPrice(product.productPrice)}
                                        </p>
                                        <span className="bg-action text-white text-xs font-bold px-2 py-1">
                                            -
                                            {Math.round(
                                                ((product.productPrice - product.discountPrice) /
                                                    product.productPrice) *
                                                100
                                            )}
                                            %
                                        </span>
                                    </>
                                ) : (
                                    <p className="text-2xl sm:text-3xl font-bold text-foreground">
                                        {formatPrice(product.productPrice)}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            {product.productDescription && (
                                <div className="border-t border-grey-200 pt-5 mb-6">
                                    <p className="text-sm sm:text-base text-grey-700 leading-relaxed">
                                        {product.productDescription}
                                    </p>
                                </div>
                            )}

                            {/* 👇 SIZE WITH STOCK DISPLAY */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label
                                        htmlFor="product-size"
                                        className="text-sm font-semibold uppercase tracking-wider text-foreground"
                                    >
                                        Size
                                    </label>
                                    <span className="text-xs text-grey-500">
                                        {availableSizes.length > 0
                                            ? `${availableSizes.length} in stock`
                                            : "Check availability"}
                                    </span>
                                </div>

                                <select
                                    id="product-size"
                                    value={size}
                                    onChange={(event) => setSize(event.target.value)}
                                    className="w-full appearance-none border-2 border-foreground bg-white px-3 py-3 text-sm text-foreground focus:outline-none focus:border-burgundy"
                                >
                                    {PRODUCT_SIZES.map((option) => {
                                        const stock = getStockForSize(option);
                                        const available = stock > 0;

                                        return (
                                            <option
                                                key={option}
                                                value={option}
                                                disabled={!available}
                                            >
                                                {option}
                                                {!available
                                                    ? " — Out of Stock"
                                                    : ` (${stock} available)`}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Color */}
                            <div className="mb-6">
                                <label
                                    htmlFor="product-color"
                                    className="block text-sm font-semibold uppercase tracking-wider text-foreground mb-2"
                                >
                                    Color
                                </label>
                                <select
                                    id="product-color"
                                    value={color}
                                    onChange={(event) => setColor(event.target.value)}
                                    className="w-full appearance-none border-2 border-foreground bg-white px-3 py-3 text-sm text-foreground focus:outline-none focus:border-burgundy"
                                >
                                    {PRODUCT_COLORS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity */}
                            <div className="mb-6">
                                <p className="text-sm font-semibold uppercase tracking-wider text-foreground mb-2">
                                    Quantity
                                </p>
                                <div className="inline-flex items-center border border-grey-300">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((current) => Math.max(1, current - 1))
                                        }
                                        className="w-11 h-11 text-lg text-grey-700 hover:bg-grey-100"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-semibold">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((current) => Math.min(50, current + 1))
                                        }
                                        className="w-11 h-11 text-lg text-grey-700 hover:bg-grey-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-grey-200 pt-5 mb-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-grey-700">Total</span>
                                    <span className="text-2xl font-bold text-burgundy">
                                        {formatPrice(total)}
                                    </span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="w-full px-6 py-3.5 border-2 border-burgundy text-burgundy text-sm font-semibold uppercase tracking-wider hover:bg-action hover:text-white transition-colors"
                                >
                                    {added ? "Added ✓" : "Add to Cart"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBuyNow}
                                    className="w-full px-6 py-3.5 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors"
                                >
                                    Buy Now
                                </button>
                            </div>

                            <p className="text-xs text-grey-500 leading-relaxed mt-4">
                                Cash on delivery. We will confirm your order on WhatsApp or phone.
                            </p>
                        </div>
                    </div>

                    {/* Poster */}
                    {isValidImageSrc(product.posterImage) && (
                        <div className="mt-10 border border-grey-200 bg-white overflow-hidden">
                            <div className="relative w-full aspect-[4/5] sm:aspect-[16/10]">
                                <Image
                                    src={product.posterImage}
                                    alt={`${product.productName} poster`}
                                    fill
                                    sizes="100vw"
                                    className="object-contain bg-grey-100"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}