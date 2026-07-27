"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

const MOBILE_DEFAULT = 5;
const DESKTOP_DEFAULT = 12;

export default function ProductGrid({ products }) {
  const [showAll, setShowAll] = useState(false);

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
            <ProductCard product={product} />
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
