"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { isValidImageSrc } from "@/lib/imageUrl";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.productPrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.productPrice - product.discountPrice) /
          product.productPrice) *
          100
      )
    : 0;

  const orderHref = `/order?sku=${encodeURIComponent(product.sku)}`;
  const hasImage = isValidImageSrc(product.productImage);

  function handleAddToCart() {
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="group bg-white border border-grey-200 hover:border-burgundy/40 transition-colors flex flex-col">
      <div className="relative aspect-[4/3] bg-grey-100 overflow-hidden">
        <Link href={orderHref} className="relative block w-full h-full">
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
        {hasDiscount && (
          <span className="absolute bottom-3 right-3 bg-action text-white text-xs font-bold px-2 py-1 uppercase tracking-wide">
            -{discountPercent}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 border-t border-grey-200">
        <p className="text-[10px] text-grey-500 uppercase tracking-widest mb-1">
          SKU: {product.sku}
        </p>
        <Link href={orderHref}>
          <h3 className="font-serif text-base font-semibold text-foreground leading-snug mb-4 group-hover:text-burgundy transition-colors">
            {product.productName}
          </h3>
        </Link>

        <div className="mt-auto pt-3 border-t border-grey-100">
          <div className="mb-3">
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
