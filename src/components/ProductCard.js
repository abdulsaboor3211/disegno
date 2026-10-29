"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { isValidImageSrc } from "@/lib/imageUrl";
import { trackAddToCart, trackSelectItem } from "@/lib/analytics";
import {
  getInitialVariantSelections,
  getSelectedVariantStock,
  getVariantLabels,
  getVariantOptionStock,
} from "@/lib/variants";

export default function ProductCard({
  product,
  itemListId = "all_products",
  itemListName = "All Products",
  itemIndex = 0,
}) {
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

  const cardVariantType = product.cardVariantType || product.variantTypes?.[0];
  const variants = getInitialVariantSelections(product);
  const selectedStock = getSelectedVariantStock(product, variants);
  const canPurchase = !(product.variants || []).length || selectedStock > 0;
  const analyticsContext = {
    itemListId,
    itemListName,
    index: itemIndex,
  };

  function handleAddToCart() {
    if (!canPurchase) return;
    addItem(product, 1, {
      analytics: analyticsContext,
      variants,
      variantLabels: getVariantLabels(product),
      maxQuantity: selectedStock > 0 ? selectedStock : 50,
    });
    trackAddToCart(product, 1, variants, analyticsContext);

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1600);
  }

  function handleProductSelect() {
    trackSelectItem(product, analyticsContext);
  }

  return (
    <article className="group bg-white border border-grey-200 hover:border-burgundy/40 transition-colors flex flex-col">

      {/* PRODUCT IMAGE */}
      <div className="relative aspect-[4/3] bg-grey-100 overflow-hidden">
        <Link
          href={productHref}
          className="relative block w-full h-full"
          onClick={handleProductSelect}
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

        {hasDiscount && (
          <span className="absolute bottom-3 right-3 bg-action text-white text-xs font-bold px-2 py-1 uppercase tracking-wide">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* PRODUCT INFORMATION */}
      <div className="p-4 flex flex-col flex-1 border-t border-grey-200">

        <Link href={productHref} onClick={handleProductSelect}>
          <h3 className="font-serif text-base font-semibold text-foreground leading-snug mb-4 group-hover:text-burgundy transition-colors">
            {product.productName}
          </h3>
        </Link>

        <div className="mt-auto pt-3 border-t border-grey-100">

          {/* PRICE + PRIMARY VARIANT */}
          <div className="flex justify-between items-start gap-3 mb-3">

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

            {cardVariantType && <div className="flex flex-wrap justify-end gap-1 max-w-[150px]">
              <span className="w-full text-right text-[10px] text-grey-500">{cardVariantType.label}</span>
              {cardVariantType.values.map((value) => {
                const stock = getVariantOptionStock(product, {}, 0, value);
                const isAvailable = stock > 0;
                const stockLabel = `${cardVariantType.label}: ${value} — ${isAvailable ? `${stock} in stock` : "Out of stock"}`;

                return (
                  <span
                    key={value}
                    aria-label={stockLabel}
                    tabIndex={0}
                    className={`px-1.5 py-1 rounded text-[9px] font-semibold relative group/size ${isAvailable ? "bg-burgundy text-white" : "bg-grey-200 text-grey-500 line-through"}`}
                  >
                    {value}
                    <span aria-hidden="true" className="pointer-events-none invisible absolute bottom-full mb-1 left-1/2 z-10 -translate-x-1/2 bg-foreground text-white text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap group-hover/size:visible group-focus/size:visible">
                      {stockLabel}
                    </span>
                  </span>
                );
              })}
            </div>}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canPurchase}
              className="flex-1 px-3 py-2 border-2 border-burgundy text-burgundy text-xs font-semibold uppercase tracking-wider hover:bg-action hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!canPurchase ? "Out of stock" : added ? "Added ✓" : "Add to Cart"}
            </button>
            <Link
              href={canPurchase ? orderHref : productHref}
              onClick={handleProductSelect}
              className="flex-1 text-center px-3 py-2 bg-action text-white text-xs font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors"
            >
              {canPurchase ? "Order Now" : "View Product"}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
