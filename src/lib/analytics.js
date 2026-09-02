const CURRENCY = "PKR";
const BRAND = "Disegno";
const AFFILIATION = "Disegno Online Store";

function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => {
      if (value === undefined || value === null || value === "") {
        return false;
      }

      return typeof value !== "number" || Number.isFinite(value);
    })
  );
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function roundCurrency(value) {
  return Math.round(toNumber(value) * 100) / 100;
}

function getUnitPrice(item) {
  if (Number.isFinite(Number(item?.unitPrice))) {
    return toNumber(item.unitPrice);
  }

  const regularPrice = toNumber(item?.productPrice ?? item?.price);
  const discountPrice = toNumber(item?.discountPrice, regularPrice);

  if (discountPrice > 0 && discountPrice < regularPrice) {
    return discountPrice;
  }

  return regularPrice;
}

function getDiscount(item, unitPrice) {
  if (Number.isFinite(Number(item?.discount))) {
    return Math.max(0, roundCurrency(item.discount));
  }

  const regularPrice = toNumber(item?.productPrice, unitPrice);
  return Math.max(0, roundCurrency(regularPrice - unitPrice));
}

function getSelectedVariants(item, override) {
  if (override && typeof override === "object" && !Array.isArray(override)) {
    return override;
  }

  if (item?.variants && typeof item.variants === "object" && !Array.isArray(item.variants)) {
    return item.variants;
  }

  return {};
}

function formatVariant(item, variants) {
  const entries = Object.entries(variants).filter(([, value]) => value);

  if (entries.length === 0) {
    return undefined;
  }

  return entries
    .map(([key, value]) => {
      const label = item?.variantLabels?.[key] || key;
      return `${label}: ${value}`;
    })
    .join(" | ");
}

function getListContext(item, options) {
  const stored = item?.analytics || {};

  return {
    itemListId: options.itemListId ?? stored.itemListId,
    itemListName: options.itemListName ?? stored.itemListName,
    index: options.index ?? stored.index,
  };
}

export function toGaItem(item, options = {}) {
  const quantity = Math.max(1, toNumber(options.quantity ?? item?.quantity, 1));
  const unitPrice = getUnitPrice(item);
  const discount = getDiscount(item, unitPrice);
  const variants = getSelectedVariants(item, options.variants);
  const list = getListContext(item, options);

  return compact({
    item_id: String(item?.productSku ?? item?.sku ?? item?.item_id ?? ""),
    item_name: item?.productName ?? item?.item_name,
    affiliation: AFFILIATION,
    discount: discount > 0 ? discount : undefined,
    index: Number.isInteger(list.index) ? list.index : undefined,
    item_brand: item?.itemBrand ?? item?.item_brand ?? BRAND,
    item_category: item?.category ?? item?.item_category,
    item_list_id: list.itemListId,
    item_list_name: list.itemListName,
    item_variant: options.itemVariant ?? formatVariant(item, variants),
    price: roundCurrency(unitPrice),
    quantity,
  });
}

function toGaItems(items, options = {}) {
  return items.map((item, index) =>
    toGaItem(item, {
      ...options,
      index:
        options.includeIndex === false
          ? undefined
          : options.indexOffset !== undefined
            ? options.indexOffset + index
            : undefined,
    })
  );
}

function calculateValue(items) {
  return roundCurrency(
    items.reduce(
      (total, item) => total + toNumber(item.price) * toNumber(item.quantity, 1),
      0
    )
  );
}

function sendGoogleEvent(eventName, eventData = {}) {
  if (typeof window === "undefined") {
    return false;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("event", eventName, eventData);

  if (process.env.NODE_ENV === "development") {
    console.log(`[GA4] ${eventName}`, eventData);
  }

  return true;
}

function sendMetaEvent(eventName, eventData, custom = false) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return false;
  }

  window.fbq(custom ? "trackCustom" : "track", eventName, eventData);
  return true;
}

function toMetaPayload(gaItems, value, extra = {}) {
  return {
    content_ids: gaItems.map((item) => item.item_id),
    contents: gaItems.map((item) => ({
      id: item.item_id,
      quantity: item.quantity,
      item_price: item.price,
    })),
    content_type: "product",
    currency: CURRENCY,
    value,
    num_items: gaItems.reduce((total, item) => total + item.quantity, 0),
    ...extra,
  };
}

// Generic custom-event helper. Ecommerce helpers below intentionally send
// different payload shapes to GA4 and Meta Pixel.
export function trackEvent(eventName, eventData = {}) {
  sendGoogleEvent(eventName, eventData);
  sendMetaEvent(eventName, eventData, true);
}

export function trackViewItemList(products, options = {}) {
  if (!Array.isArray(products) || products.length === 0) {
    return;
  }

  for (let offset = 0; offset < products.length; offset += 200) {
    const items = toGaItems(products.slice(offset, offset + 200), {
      ...options,
      indexOffset: (options.indexOffset || 0) + offset,
    });

    sendGoogleEvent(
      "view_item_list",
      compact({
        currency: CURRENCY,
        item_list_id: options.itemListId,
        item_list_name: options.itemListName,
        items,
      })
    );
  }
}

export function trackSelectItem(product, options = {}) {
  const items = [toGaItem(product, options)];

  sendGoogleEvent(
    "select_item",
    compact({
      currency: CURRENCY,
      item_list_id: options.itemListId,
      item_list_name: options.itemListName,
      items,
    })
  );
}

export function trackViewItem(product) {
  const items = [toGaItem(product)];

  sendGoogleEvent("view_item", {
    currency: CURRENCY,
    value: calculateValue(items),
    items,
  });
}

export function trackAddToCart(product, quantity = 1, variants, options = {}) {
  const items = [toGaItem(product, { ...options, quantity, variants })];
  const value = calculateValue(items);

  sendGoogleEvent("add_to_cart", {
    currency: CURRENCY,
    value,
    items,
  });

  sendMetaEvent(
    "AddToCart",
    toMetaPayload(items, value, {
      content_name: items[0].item_name,
      content_category: items[0].item_category,
    })
  );
}

export function trackViewCart(cartItems, cartTotal) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return;
  }

  const items = toGaItems(cartItems, { includeIndex: false });

  sendGoogleEvent("view_cart", {
    currency: CURRENCY,
    value: roundCurrency(cartTotal ?? calculateValue(items)),
    items,
  });
}

export function trackRemoveFromCart(item, quantity = 1) {
  const items = [toGaItem(item, { quantity })];

  sendGoogleEvent("remove_from_cart", {
    currency: CURRENCY,
    value: calculateValue(items),
    items,
  });
}

export function trackBeginCheckout(orderItems, orderTotal) {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return;
  }

  const items = toGaItems(orderItems, { includeIndex: false });
  const value = roundCurrency(orderTotal ?? calculateValue(items));

  sendGoogleEvent("begin_checkout", {
    currency: CURRENCY,
    value,
    items,
  });

  sendMetaEvent("InitiateCheckout", toMetaPayload(items, value));
}

export function trackAddShippingInfo(
  orderItems,
  orderTotal,
  shippingTier = "Standard delivery"
) {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return;
  }

  const items = toGaItems(orderItems, { includeIndex: false });

  sendGoogleEvent("add_shipping_info", {
    currency: CURRENCY,
    value: roundCurrency(orderTotal ?? calculateValue(items)),
    shipping_tier: shippingTier,
    items,
  });
}

export function trackAddPaymentInfo(
  orderItems,
  orderTotal,
  paymentType = "Cash on delivery"
) {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return;
  }

  const items = toGaItems(orderItems, { includeIndex: false });

  sendGoogleEvent("add_payment_info", {
    currency: CURRENCY,
    value: roundCurrency(orderTotal ?? calculateValue(items)),
    payment_type: paymentType,
    items,
  });
}

export function trackPurchase(orderItems, orderTotal, transactionId) {
  if (!transactionId || !Array.isArray(orderItems) || orderItems.length === 0) {
    return;
  }

  const items = toGaItems(orderItems, { includeIndex: false });
  const value = roundCurrency(orderTotal ?? calculateValue(items));

  sendGoogleEvent("purchase", {
    transaction_id: String(transactionId),
    value,
    currency: CURRENCY,
    items,
  });

  sendMetaEvent(
    "Purchase",
    toMetaPayload(items, value, { order_id: String(transactionId) })
  );
}
