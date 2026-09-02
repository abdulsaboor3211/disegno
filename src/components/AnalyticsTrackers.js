"use client";

import { useEffect, useRef } from "react";

import { trackViewItem, trackViewItemList } from "@/lib/analytics";

export function ProductViewTracker({ product }) {
  const trackedSku = useRef(null);

  useEffect(() => {
    if (!product?.sku || trackedSku.current === product.sku) {
      return;
    }

    trackViewItem(product);
    trackedSku.current = product.sku;
  }, [product]);

  return null;
}

export function ProductListViewTracker({
  products,
  itemListId,
  itemListName,
}) {
  const trackedList = useRef(null);

  useEffect(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return;
    }

    const listKey = `${itemListId}:${products.map((product) => product.sku).join(",")}`;

    if (trackedList.current === listKey) {
      return;
    }

    trackViewItemList(products, {
      itemListId,
      itemListName,
      indexOffset: 0,
    });
    trackedList.current = listKey;
  }, [itemListId, itemListName, products]);

  return null;
}
