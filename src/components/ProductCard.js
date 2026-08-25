"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { formatPrice } from "@/data/products";
import { PRODUCT_SIZES } from "@/data/sizes";
import { useCart } from "@/context/CartContext";
import { isValidImageSrc } from "@/lib/imageUrl";

function getShortSize(size) {
  const match = size.match(/UK\s*(\d+)/i);
  return match ? `UK${match[1]}` : size;
}

function getContrastColor(hex) {
  const color = hex.replace("#", "");

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? "#000" : "#fff";
}

const BRAND_COLOR = "#7A2230";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const [added, setAdded] = useState(false);

  const hasDiscount =
    product.discountPrice &&
    product.discountPrice < product.productPrice;

  const discountPercent = hasDiscount
    ? Math.round(
      ((product.productPrice - product.discountPrice) /
        product.productPrice) *
      100
    )
    : 0;

  const productHref = `/product/${encodeURIComponent(product.sku)}`;
  const orderHref = `/order?sku=${encodeURIComponent(product.sku)}`;

  const hasImage = isValidImageSrc(product.productImage);

  // 👇 Get stock map for size availability
  const sizeStockMap = product.sizeStockMap || {};
  const availableSizes = product.availableSizes || [];

  function handleAddToCart() {
    addItem(product, 1);

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1600);
  }

  // 👇 Check if size has stock
  function hasStock(size) {
    return sizeStockMap[size] > 0;
  }

  return (
    <article className="group bg-white border border-grey-200 hover:border-burgundy/40 transition-colors flex flex-col">

      {/* PRODUCT IMAGE */}
      <div className="relative aspect-[4/3] bg-grey-100 overflow-hidden">
        <Link
          href={productHref}
          className="relative block w-full h-full"
        >
          {hasImage ? (
            <Image
              src={product.productImage}
              alt={product.productName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          ) : null}
        </Link>

        {/* DISCOUNT BADGE */}
        {hasDiscount && (
          <span className="absolute bottom-3 right-3 bg-action text-white text-xs font-bold px-2 py-1 uppercase tracking-wide">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="p-4 flex flex-col flex-1 border-t border-grey-200">

        {/* PRODUCT NAME */}
        <Link href={productHref}>
          <h3 className="font-serif text-base font-semibold text-foreground leading-snug mb-4 group-hover:text-burgundy transition-colors">
            {product.productName}
          </h3>
        </Link>

        <div className="mt-auto pt-3 border-t border-grey-100">

          {/* PRICE + SIZES WITH STOCK */}
          <div className="flex justify-between items-start gap-3 mb-3">

            {/* PRICE */}
            <div>
              {hasDiscount ? (
                <>
                  <p className="text-lg font-bold text-burgundy">
                    {formatPrice(product.discountPrice)}
                  </p>
                  <p className="text-sm text-grey-500 line-through">
                    {formatPrice(product.productPrice)}
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold text-foreground">
                  {formatPrice(product.productPrice)}
                </p>
              )}
            </div>

            {/* 👇 SIZE INDICATOR WITH STOCK STATUS */}
            <div className="flex flex-wrap justify-end gap-1 max-w-[150px]">
              {PRODUCT_SIZES.map((size) => {
                const stock = sizeStockMap[size] || 0;
                const isAvailable = stock > 0;

                return (
                  <span
                    key={size}
                    title={`${getShortSize(size)}${isAvailable ? ` — ${stock} in stock` : " — Out of stock"}`}
                    className="px-1.5 py-1 rounded text-[9px] font-semibold relative group/size"
                    style={{
                      backgroundColor: isAvailable ? BRAND_COLOR : "#E5E7EB",
                      color: isAvailable ? getContrastColor(BRAND_COLOR) : "#6B7280",
                    }}
                  >
                    {getShortSize(size)}
                    {/* Tooltip on hover */}
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-white text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover/size:opacity-100 transition-opacity">
                      {isAvailable ? `${stock} left` : "Out of stock"}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 px-3 py-2 border-2 border-burgundy text-burgundy text-xs font-semibold uppercase tracking-wider hover:bg-action hover:text-white transition-colors"
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>
            <Link
              href={orderHref}
              className="flex-1 text-center px-3 py-2 bg-action text-white text-xs font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors"
            >
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}