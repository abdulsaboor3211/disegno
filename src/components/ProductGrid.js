"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { trackViewItemList } from "@/lib/analytics";

const MOBILE_DEFAULT = 5;
const DESKTOP_DEFAULT = 12;

export default function ProductGrid({
  products,
  itemListId = "all_products",
  itemListName = "All Products",
}) {
  const [showAll, setShowAll] = useState(false);
  const trackedCount = useRef(0);
  const trackedListKey = useRef("");

  const listKey = `${itemListId}:${products.map((product) => product.sku).join(",")}`;

  useEffect(() => {
    if (trackedListKey.current !== listKey) {
      trackedListKey.current = listKey;
      trackedCount.current = 0;
    }

    const mobileQuery = window.matchMedia("(max-width: 639px)");

    function trackNewlyVisibleProducts() {
      const defaultCount = mobileQuery.matches
        ? MOBILE_DEFAULT
        : DESKTOP_DEFAULT;
      const visibleProductCount = Math.min(
        products.length,
        showAll ? products.length : defaultCount
      );

      if (visibleProductCount <= trackedCount.current) {
        return;
      }

      const indexOffset = trackedCount.current;
      const newlyVisibleProducts = products.slice(
        indexOffset,
        visibleProductCount
      );

      trackViewItemList(newlyVisibleProducts, {
        itemListId,
        itemListName,
        indexOffset,
      });
      trackedCount.current = visibleProductCount;
    }

    trackNewlyVisibleProducts();
    mobileQuery.addEventListener("change", trackNewlyVisibleProducts);

    return () => {
      mobileQuery.removeEventListener("change", trackNewlyVisibleProducts);
    };
  }, [itemListId, itemListName, listKey, products, showAll]);

  const visibleCount = showAll ? products.length : DESKTOP_DEFAULT;
  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = products.length > DESKTOP_DEFAULT;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {visibleProducts.map((product, i) => (
          <div
            key={product.sku}
            className={!showAll && i >= MOBILE_DEFAULT ? "hidden sm:block" : ""}
          >
            <ProductCard
              product={product}
              itemListId={itemListId}
              itemListName={itemListName}
              itemIndex={i}
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-12">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center justify-center px-10 py-3.5 border-2 border-burgundy text-burgundy text-sm font-semibold uppercase tracking-wider hover:bg-action hover:text-white transition-colors"
          >
            {showAll ? "Show Less" : "View All Products"}
          </button>
        </div>
      )}
    </>
  );
}
