"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function CartPageContent() {
  const { items, ready, subtotal, updateQuantity, removeItem, itemCount } =
    useCart();

  if (!ready) {
    return (
      <p className="text-center text-grey-500 py-16">Loading cart…</p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center border border-grey-200 bg-white p-8 sm:p-12">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-3">
          Your cart is empty
        </h1>
        <p className="text-grey-700 mb-8">
          Add products from the shop, then come back to review and order.
        </p>
        <Link
          href="/#products"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-10">
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.sku}
            className="bg-white border border-grey-200 p-4 sm:p-5 flex gap-4"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-grey-100 shrink-0 overflow-hidden">
              {item.productImage &&
              (item.productImage.startsWith("/") ||
                item.productImage.startsWith("http")) ? (
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  sizes="112px"
                  className="object-contain p-2"
                />
              ) : null}
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
              <p className="text-[10px] text-grey-500 uppercase tracking-widest mb-1">
                SKU: {item.sku}
              </p>
              <h2 className="font-serif text-lg font-semibold text-foreground leading-snug mb-2">
                {item.productName}
              </h2>
              <p className="text-sm font-semibold text-burgundy mb-3">
                {formatPrice(item.unitPrice)}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
                <div className="inline-flex items-center border border-grey-300">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      updateQuantity(item.sku, item.quantity - 1)
                    }
                    className="w-9 h-9 text-lg text-grey-700 hover:bg-grey-100"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      updateQuantity(item.sku, item.quantity + 1)
                    }
                    className="w-9 h-9 text-lg text-grey-700 hover:bg-grey-100"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-sm font-bold text-foreground">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.sku)}
                    className="text-xs uppercase tracking-wider text-grey-500 hover:text-burgundy"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="border border-grey-200 bg-white p-5 sm:p-6 h-fit lg:sticky lg:top-28">
        <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
          Summary
        </p>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
          Cart total
        </h2>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between text-grey-700">
            <span>Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-foreground border-t border-grey-100 pt-3">
            <span>Subtotal</span>
            <span className="text-burgundy">{formatPrice(subtotal)}</span>
          </div>
        </div>

        <Link
          href="/order?from=cart"
          className="w-full inline-flex items-center justify-center px-8 py-3.5 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors"
        >
          Proceed to order
        </Link>
        <Link
          href="/#products"
          className="mt-3 w-full inline-flex items-center justify-center px-8 py-3.5 border-2 border-grey-300 text-grey-700 text-sm font-semibold uppercase tracking-wider hover:border-burgundy hover:text-burgundy transition-colors"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
