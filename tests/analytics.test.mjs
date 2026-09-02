import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const analyticsSource = await readFile(
  new URL("../src/lib/analytics.js", import.meta.url),
  "utf8"
);

const {
  trackAddPaymentInfo,
  trackAddShippingInfo,
  trackAddToCart,
  trackBeginCheckout,
  trackPurchase,
  trackRemoveFromCart,
  trackSelectItem,
  trackViewCart,
  trackViewItem,
  trackViewItemList,
} = await import(
  `data:text/javascript;base64,${Buffer.from(analyticsSource).toString("base64")}`
);

const product = {
  sku: "DK-001",
  productName: "Classic Chappal",
  category: "Peshawari Chappal",
  productPrice: 5500,
  discountPrice: 5000,
};

function captureEvents() {
  const google = [];
  const meta = [];

  globalThis.window = {
    dataLayer: [],
    gtag: (...args) => google.push(args),
    fbq: (...args) => meta.push(args),
  };

  return { google, meta };
}

function getPayload(events, eventName) {
  const event = events.find(([, name]) => name === eventName);
  assert.ok(event, `${eventName} was not recorded`);
  return event[2];
}

test("records the GA4 product discovery events with prescribed item fields", () => {
  const { google } = captureEvents();
  const list = {
    itemListId: "all_products",
    itemListName: "All Products",
    index: 0,
  };

  trackViewItemList([product], { ...list, indexOffset: 0 });
  trackSelectItem(product, list);
  trackViewItem(product);

  assert.deepEqual(
    google.map(([, name]) => name),
    ["view_item_list", "select_item", "view_item"]
  );

  const listPayload = getPayload(google, "view_item_list");
  assert.equal(listPayload.currency, "PKR");
  assert.equal(listPayload.items[0].item_id, "DK-001");
  assert.equal(listPayload.items[0].item_brand, "Disegno");
  assert.equal(listPayload.items[0].item_category, "Peshawari Chappal");
  assert.equal(listPayload.items[0].price, 5000);
  assert.equal(listPayload.items[0].discount, 500);
});

test("records GA4 cart events and uses the quantity delta as event value", () => {
  const { google, meta } = captureEvents();
  const cartItem = {
    ...product,
    unitPrice: 5000,
    quantity: 2,
    variants: { size: "UK 9" },
    variantLabels: { size: "Size" },
  };

  trackAddToCart(cartItem, 1);
  trackViewCart([cartItem], 10000);
  trackRemoveFromCart(cartItem, 1);

  assert.deepEqual(
    google.map(([, name]) => name),
    ["add_to_cart", "view_cart", "remove_from_cart"]
  );
  assert.equal(getPayload(google, "add_to_cart").value, 5000);
  assert.equal(getPayload(google, "view_cart").value, 10000);
  assert.equal(
    getPayload(google, "remove_from_cart").items[0].item_variant,
    "Size: UK 9"
  );
  assert.equal(meta[0][0], "track");
  assert.equal(meta[0][1], "AddToCart");
});

test("records the complete GA4 checkout sequence and a unique purchase", () => {
  const { google, meta } = captureEvents();
  const orderItems = [{ ...product, unitPrice: 5000, quantity: 2 }];

  trackBeginCheckout(orderItems, 10000);
  trackAddShippingInfo(orderItems, 10000, "Standard delivery");
  trackAddPaymentInfo(orderItems, 10000, "Cash on delivery");
  trackPurchase(orderItems, 10000, "DK-ORDER-1");

  assert.deepEqual(
    google.map(([, name]) => name),
    [
      "begin_checkout",
      "add_shipping_info",
      "add_payment_info",
      "purchase",
    ]
  );

  const purchase = getPayload(google, "purchase");
  assert.equal(purchase.transaction_id, "DK-ORDER-1");
  assert.equal(purchase.currency, "PKR");
  assert.equal(purchase.value, 10000);
  assert.equal(purchase.items[0].quantity, 2);
  assert.equal("email" in purchase, false);
  assert.deepEqual(
    meta.map(([, name]) => name),
    ["InitiateCheckout", "Purchase"]
  );
});

test("does not record an invalid purchase without a transaction ID", () => {
  const { google, meta } = captureEvents();

  trackPurchase([{ ...product, quantity: 1 }], 5000, "");

  assert.equal(google.length, 0);
  assert.equal(meta.length, 0);
});
