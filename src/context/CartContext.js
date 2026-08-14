"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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

function createItemId(sku, size, color) {
  return `${sku}__${size || ""}__${color || ""}`;
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
   * Size + color are stored with the item.
   */
  const addItem = useCallback(
    (
      product,
      quantity = 1,
      options = {}
    ) => {
      const qty = Math.min(
        50,
        Math.max(1, Number(quantity) || 1)
      );

      const size = options.size || "";
      const color = options.color || "";

      const itemId = createItemId(
        product.sku,
        size,
        color
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
                quantity: Math.min(
                  50,
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

            productImage: product.productImage,

            productPrice: product.productPrice,

            discountPrice: product.discountPrice,

            unitPrice: getUnitPrice(product),

            quantity: qty,

            size,

            color,
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
              quantity: qty,
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