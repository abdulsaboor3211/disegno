"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { normalizeVariantSelections } from "@/lib/variants";

const CART_STORAGE_KEY = "disegno-cart";

const CartContext = createContext(null);

function getUnitPrice(product) {
  if (
    product.discountPrice &&
    product.discountPrice < product.productPrice
  ) {
    return product.discountPrice;
  }

  return product.productPrice || 0;
}

function createItemId(sku, variants) {
  const variantId = Object.entries(variants)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${value}`)
    .join("__");

  return `${sku}__${variantId}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  /*
   * Load cart from localStorage
   */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);

      if (raw) {
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          // Browser-only persisted state is intentionally restored after hydration.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(parsed);
        }
      }
    } catch {
      setItems([]);
    } finally {
      setReady(true);
    }
  }, []);

  /*
   * Save cart to localStorage
   */
  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items)
    );
  }, [items, ready]);

  /*
   * Add product to cart
   *
   * Any number of selected variant types are stored with the item.
   */
  const addItem = useCallback(
    (
      product,
      quantity = 1,
      options = {}
    ) => {
      const maxQuantity = Math.min(
        50,
        Math.max(1, Number(options.maxQuantity) || 50)
      );
      const qty = Math.min(
        maxQuantity,
        Math.max(1, Number(quantity) || 1)
      );

      const variants = normalizeVariantSelections(
        options.variants || {
          size: options.size,
          color: options.color,
        }
      );

      const itemId = createItemId(
        product.sku,
        variants
      );

      setItems((prev) => {
        const existing = prev.find(
          (item) => item.id === itemId
        );

        if (existing) {
          return prev.map((item) =>
            item.id === itemId
              ? {
                ...item,
                category: item.category || product.category || "",
                analytics: item.analytics || options.analytics || null,
                maxQuantity: Math.min(item.maxQuantity || 50, maxQuantity),
                quantity: Math.min(
                  Math.min(item.maxQuantity || 50, maxQuantity),
                  item.quantity + qty
                ),
              }
              : item
          );
        }

        return [
          ...prev,
          {
            id: itemId,

            sku: product.sku,

            productName: product.productName,

            category: product.category || "",

            productImage: product.productImage,

            productPrice: product.productPrice,

            discountPrice: product.discountPrice,

            unitPrice: getUnitPrice(product),

            quantity: qty,

            maxQuantity,

            variants,

            variantLabels: options.variantLabels || {},

            analytics: options.analytics || null,
          },
        ];
      });
    },
    []
  );

  /*
   * Update quantity
   */
  const updateQuantity = useCallback(
    (itemId, quantity) => {
      const qty = Math.min(
        50,
        Math.max(0, Number(quantity) || 0)
      );

      setItems((prev) => {
        if (qty < 1) {
          return prev.filter(
            (item) => item.id !== itemId
          );
        }

        return prev.map((item) =>
          item.id === itemId
            ? {
              ...item,
              quantity: Math.min(qty, item.maxQuantity || 50),
            }
            : item
        );
      });
    },
    []
  );

  /*
   * Remove item
   */
  const removeItem = useCallback((itemId) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== itemId)
    );
  }, []);

  /*
   * Clear cart
   */
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  /*
   * Total quantity
   */
  const itemCount = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [items]
  );

  /*
   * Cart subtotal
   */
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + item.unitPrice * item.quantity,
        0
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      ready,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      ready,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;
}
