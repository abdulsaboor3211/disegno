"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { formatPrice } from "@/data/products";
import {
  trackAddPaymentInfo,
  trackAddShippingInfo,
  trackBeginCheckout,
  trackPurchase,
} from "@/lib/analytics";
import { useCart } from "@/context/CartContext";
import { isValidImageSrc } from "@/lib/imageUrl";
import {
  getInitialVariantSelections,
  getItemVariants,
  getSelectedVariantStock,
  getVariantLabel,
  getVariantOptionStock,
  selectVariantOption,
} from "@/lib/variants";

const initialCustomer = {
  customerName: "",
  email: "",
  contact: "",
  whatsapp: "",
  city: "",
  address: "",
  notes: "",
};

export default function OrderForm({
  product = null,
  fromCart = false,
  initialVariants = {},
  initialQuantity = 1,
}) {
  const {
    items: cartItems,
    clearCart,
    ready,
    subtotal,
  } = useCart();
  const defaultVariantSelections = getInitialVariantSelections(
    product,
    initialVariants
  );
  const initialVariantStock = getSelectedVariantStock(
    product,
    defaultVariantSelections
  );

  // ==========================================
  // CUSTOMER INFORMATION
  // ==========================================

  const [customer, setCustomer] = useState(initialCustomer);

  // ==========================================
  // PAYMENT
  // COD IS SELECTED BY DEFAULT
  // ==========================================

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // ==========================================
  // SINGLE PRODUCT / BUY NOW
  // ==========================================

  const [quantity, setQuantity] = useState(
    Math.min(
      initialVariantStock > 0 ? Math.min(50, initialVariantStock) : 50,
      Math.max(1, Number(initialQuantity) || 1)
    )
  );

  const [variantSelections, setVariantSelections] = useState(() =>
    defaultVariantSelections
  );

  // ==========================================
  // FORM STATUS
  // ==========================================

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");

  // ==========================================
  // PRODUCT IMAGES
  // ==========================================

  const productImages = useMemo(() => {
    if (!product || fromCart) {
      return [];
    }

    const seen = new Set();
    const images = [];

    const addImage = (src) => {
      if (
        isValidImageSrc(src) &&
        !seen.has(src)
      ) {
        seen.add(src);
        images.push(src);
      }
    };

    addImage(product.productImage);

    for (let i = 1; i <= 10; i++) {
      addImage(product[`img${i}`]);
    }

    return images;
  }, [product, fromCart]);

  // ==========================================
  // PRICE
  // ==========================================

  const unitPrice = product
    ? product.discountPrice &&
      product.discountPrice < product.productPrice
      ? product.discountPrice
      : product.productPrice || 0
    : 0;

  const singleTotal = useMemo(() => {
    return unitPrice * quantity;
  }, [unitPrice, quantity]);

  const hasDiscount =
    product &&
    product.discountPrice &&
    product.discountPrice < product.productPrice;
  const selectedVariantStock = getSelectedVariantStock(
    product,
    variantSelections
  );
  const singleCanPurchase =
    !product ||
    (product.variants || []).length === 0 ||
    selectedVariantStock > 0;

  // ==========================================
  // ORDER ITEMS
  // ==========================================

  const orderItems = useMemo(
    () =>
      fromCart
        ? cartItems.map((item) => ({
          ...item,
          variants: getItemVariants(item),
        }))
        : product
          ? [
            {
              sku: product.sku,
              productName: product.productName,
              productImage: product.productImage,
              category: product.category,
              productPrice: product.productPrice,
              discountPrice: product.discountPrice,
              unitPrice,
              quantity,
              variants: variantSelections,
              variantLabels: (product.variantTypes || []).reduce(
                (labels, type) => ({ ...labels, [type.key]: type.label }),
                {}
              ),
            },
          ]
          : [],
    [cartItems, fromCart, product, quantity, unitPrice, variantSelections]
  );

  const displayTotal = fromCart
    ? subtotal
    : singleTotal;

  const checkoutStarted = useRef(false);
  const shippingInfoAdded = useRef(false);
  const paymentInfoAdded = useRef(false);

  useEffect(() => {
    if (
      checkoutStarted.current ||
      status === "success" ||
      (fromCart && !ready) ||
      orderItems.length === 0
    ) {
      return;
    }

    trackBeginCheckout(orderItems, displayTotal);
    checkoutStarted.current = true;
  }, [displayTotal, fromCart, orderItems, ready, status]);

  // ==========================================
  // HELPERS
  // ==========================================

  function updateField(field, value) {
    setCustomer((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateVariant(typeIndex, value) {
    const next = selectVariantOption(
      product,
      variantSelections,
      typeIndex,
      value
    );
    const stock = getSelectedVariantStock(product, next);

    setVariantSelections(next);
    if (stock > 0) {
      setQuantity((current) => Math.min(current, stock));
    }
  }

  // ==========================================
  // SUBMIT ORDER
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus("loading");
    setMessage("");

    if (
      fromCart &&
      cartItems.length === 0
    ) {
      setStatus("error");
      setMessage("Your cart is empty.");
      return;
    }

    if (!shippingInfoAdded.current) {
      trackAddShippingInfo(orderItems, displayTotal, "Standard delivery");
      shippingInfoAdded.current = true;
    }

    if (!paymentInfoAdded.current) {
      trackAddPaymentInfo(orderItems, displayTotal, "Cash on delivery");
      paymentInfoAdded.current = true;
    }

    try {
      const payload = {
        ...customer,

        paymentMethod,

        items: orderItems.map((item) => ({
          productSku: item.sku,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          variants: item.variants,
        })),
      };

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Failed to place order"
        );
      }

      trackPurchase(orderItems, displayTotal, data.orderId);

      setOrderId(data.orderId || "");
      setStatus("success");

      setMessage(
        data.preview
          ? data.message
          : "Your order was placed successfully. We will contact you soon."
      );

      setCustomer(initialCustomer);

      setQuantity(1);

      setVariantSelections(getInitialVariantSelections(product));

      if (fromCart) {
        clearCart();
      }
    } catch (error) {
      setStatus("error");

      setMessage(
        error.message ||
        "Something went wrong."
      );
    }
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (
    fromCart &&
    ready &&
    cartItems.length === 0 &&
    status !== "success"
  ) {
    return (
      <div className="max-w-xl mx-auto text-center border border-grey-200 bg-white p-8 sm:p-12">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-3">
          Your cart is empty
        </h1>

        <p className="text-grey-700 mb-8">
          Add products to your cart before
          checking out.
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

  // ==========================================
  // SUCCESS
  // ==========================================

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto text-center border border-grey-200 bg-white p-8 sm:p-12">
        <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
          Order received
        </p>

        <h1 className="font-serif text-3xl font-semibold text-foreground mb-3">
          Thank you
        </h1>

        <p className="text-grey-700 mb-2">
          {message}
        </p>

        {orderId && (
          <p className="text-sm text-grey-500 mb-8">
            Order ID:{" "}
            <span className="font-semibold text-foreground">
              {orderId}
            </span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/#products"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors"
          >
            Continue shopping
          </Link>

          {!fromCart && (
            <button
              type="button"
              onClick={() => {
                checkoutStarted.current = false;
                shippingInfoAdded.current = false;
                paymentInfoAdded.current = false;
                setStatus("idle");
                setMessage("");
                setOrderId("");
              }}
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-grey-300 text-grey-700 text-sm font-semibold uppercase tracking-wider hover:border-burgundy hover:text-burgundy transition-colors"
            >
              Place another order
            </button>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN CHECKOUT
  // LEFT = ADDRESS
  // RIGHT = SUMMARY
  // ==========================================

  return (
    <form
      onSubmit={handleSubmit}
      className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start"
    >
      {/* =====================================================
          LEFT SIDE - DELIVERY / ADDRESS
      ====================================================== */}

      <div className="border border-grey-200 bg-white p-5 sm:p-7">
        <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-2">
          Delivery
        </p>

        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-7">
          Delivery details
        </h2>

        <div className="space-y-4">

          {/* FULL NAME */}

          <Field
            label="Full name"
            required
            value={customer.customerName}
            onChange={(value) =>
              updateField(
                "customerName",
                value
              )
            }
            autoComplete="name"
          />

          {/* EMAIL */}

          <Field
            label="Email"
            type="email"
            value={customer.email}
            onChange={(value) =>
              updateField(
                "email",
                value
              )
            }
            autoComplete="email"
          />

          {/* PHONE NUMBERS */}

          <div className="grid sm:grid-cols-2 gap-4">

            <Field
              label="Contact number"
              type="tel"
              value={customer.contact}
              onChange={(value) =>
                updateField(
                  "contact",
                  value
                )
              }
              autoComplete="tel"
              placeholder="03XXXXXXXXX"
            />

            <Field
              label="WhatsApp number"
              type="tel"
              required
              value={customer.whatsapp}
              onChange={(value) =>
                updateField(
                  "whatsapp",
                  value
                )
              }
              placeholder="03XXXXXXXXX"
            />

          </div>

          {/* CITY */}

          <Field
            label="City"
            required
            value={customer.city}
            onChange={(value) =>
              updateField(
                "city",
                value
              )
            }
            autoComplete="address-level2"
          />

          {/* ADDRESS */}

          <Field
            label="Full delivery address"
            required
            as="textarea"
            rows={4}
            value={customer.address}
            onChange={(value) =>
              updateField(
                "address",
                value
              )
            }
            autoComplete="street-address"
          />

          {/* NOTES */}

          <Field
            label="Order notes"
            as="textarea"
            rows={3}
            value={customer.notes}
            onChange={(value) =>
              updateField(
                "notes",
                value
              )
            }
            placeholder="Optional"
          />
        </div>

        {/* =================================================
            PAYMENT METHOD
        ================================================== */}

        <div className="mt-7 pt-6 border-t border-grey-200">

          <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            Payment method
          </p>

          <label
            className={`flex items-center gap-4 border-2 p-4 cursor-pointer transition-colors ${paymentMethod === "cod"
              ? "border-burgundy bg-[#faf7f5]"
              : "border-grey-300"
              }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={
                paymentMethod === "cod"
              }
              onChange={() =>
                setPaymentMethod("cod")
              }
              className="w-4 h-4 accent-[#432f33]"
            />

            <div className="flex-1">
              <p className="font-semibold text-foreground">
                Cash on Delivery
              </p>

              <p className="text-xs text-grey-500 mt-1">
                Pay when your order is delivered.
              </p>
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-burgundy">
              Selected
            </span>
          </label>
        </div>

        {/* ERROR */}

        {status === "error" && (
          <p
            className="mt-5 text-sm text-burgundy border border-burgundy/30 bg-red-50 p-3"
            role="alert"
          >
            {message}
          </p>
        )}

        {/* CONFIRM */}

        <button
          type="submit"
          disabled={status === "loading" || (!fromCart && !singleCanPurchase)}
          className="mt-6 w-full inline-flex items-center justify-center px-8 py-4 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors disabled:opacity-60"
        >
          {status === "loading"
            ? "Placing order…"
            : "Confirm order"}
        </button>

        <p className="mt-3 text-xs text-grey-500 leading-relaxed text-center">
          Cash on delivery. We will confirm
          your order on WhatsApp or phone
          after you submit.
        </p>
      </div>

      {/* =====================================================
          RIGHT SIDE - ORDER SUMMARY
      ====================================================== */}

      <div className="border border-grey-200 bg-white p-5 sm:p-7 lg:sticky lg:top-24">

        <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-2">
          Order summary
        </p>

        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-6">
          Your order
        </h2>

        {/* =================================================
            CART PRODUCTS
        ================================================== */}

        {fromCart ? (
          <div className="space-y-5">

            {orderItems.map(
              (item, index) => (
                <div
                  key={`${item.sku}-${index}`}
                  className="pb-5 border-b border-grey-200"
                >

                  <div className="flex gap-4">

                    {/* IMAGE */}

                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-grey-100 shrink-0 overflow-hidden">
                      {isValidImageSrc(
                        item.productImage
                      ) ? (
                        <Image
                          src={
                            item.productImage
                          }
                          alt={
                            item.productName
                          }
                          fill
                          sizes="112px"
                          className="object-contain p-2"
                        />
                      ) : null}
                    </div>

                    {/* DETAILS */}

                    <div className="flex-1 min-w-0">

                      <h3 className="font-serif text-base font-semibold leading-snug">
                        {item.productName}
                      </h3>

                      <p className="text-[10px] text-grey-500 uppercase tracking-widest mt-1">
                        SKU: {item.sku}
                      </p>

                      <div className="mt-3 space-y-1 text-xs text-grey-700">

                        {Object.entries(item.variants || {}).map(([key, value]) => (
                          <p key={key}>
                            <span className="font-semibold">
                              {getVariantLabel(item, key)}:
                            </span>{" "}
                            {value}
                          </p>
                        ))}

                        <p>
                          <span className="font-semibold">
                            Quantity:
                          </span>{" "}
                          {item.quantity}
                        </p>

                      </div>
                    </div>
                  </div>

                  {/* PRICE */}

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-grey-600">
                      {formatPrice(
                        item.unitPrice
                      )}{" "}
                      × {item.quantity}
                    </span>

                    <span className="font-semibold text-burgundy">
                      {formatPrice(
                        item.unitPrice *
                        item.quantity
                      )}
                    </span>
                  </div>

                </div>
              )
            )}

          </div>
        ) : (
          /* =================================================
             BUY NOW PRODUCT
          ================================================== */

          <div>

            {/* PRODUCT IMAGE */}

            <div className="relative w-full aspect-square bg-grey-100 overflow-hidden mb-5">

              {isValidImageSrc(
                product?.productImage
              ) ? (
                <Image
                  src={product.productImage}
                  alt={product.productName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-6"
                  priority
                />
              ) : null}

            </div>

            {/* PRODUCT INFO */}

            <div className="pb-5 border-b border-grey-200">

              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
                {product.productName}
              </h3>

              <p className="text-[10px] text-grey-500 uppercase tracking-widest mt-1">
                SKU: {product.sku}
              </p>

              {product.productDescription ? (
                <p className="text-sm text-grey-600 leading-relaxed mt-3">
                  {product.productDescription}
                </p>
              ) : null}

            </div>

            {/* PRICE */}

            <div className="py-5 border-b border-grey-200">

              <div className="flex items-center justify-between">

                <span className="text-sm text-grey-600">
                  Price
                </span>

                <div className="text-right">

                  {hasDiscount ? (
                    <div className="flex items-center gap-2">

                      <span className="font-semibold text-burgundy">
                        {formatPrice(
                          product.discountPrice
                        )}
                      </span>

                      <span className="text-xs text-grey-500 line-through">
                        {formatPrice(
                          product.productPrice
                        )}
                      </span>

                    </div>
                  ) : (
                    <span className="font-semibold text-burgundy">
                      {formatPrice(
                        product.productPrice
                      )}
                    </span>
                  )}

                </div>

              </div>

            </div>

            {/* VARIANT DETAILS */}

            <div className="py-5 border-b border-grey-200 space-y-3">

              {(product.variantTypes || []).map((type) => (
                <div className="flex justify-between gap-4 text-sm" key={type.key}>
                  <span className="text-grey-600">
                    {type.label}
                  </span>

                  <span className="font-medium text-foreground text-right">
                    {variantSelections[type.key]}
                  </span>
                </div>
              ))}

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-grey-600">
                  Quantity
                </span>

                <span className="font-medium text-foreground">
                  {quantity}
                </span>
              </div>

            </div>

            {/* CHANGE VARIANT */}

            {(product.variantTypes || []).length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 py-5 border-b border-grey-200">
                {product.variantTypes.map((type, typeIndex) => (
                  <VariantSelect
                    key={type.key}
                    type={type}
                    value={variantSelections[type.key] || ""}
                    onChange={(value) => updateVariant(typeIndex, value)}
                    id={`order-variant-${type.key}`}
                    getStock={(value) =>
                      getVariantOptionStock(
                        product,
                        variantSelections,
                        typeIndex,
                        value
                      )
                    }
                  />
                ))}
              </div>
            )}

            {/* QUANTITY */}

            <div className="flex items-center justify-between py-5 border-b border-grey-200">

              <span className="text-sm text-grey-600">
                Quantity
              </span>

              <div className="inline-flex items-center border border-grey-300">

                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        Math.max(
                          1,
                          current - 1
                        )
                    )
                  }
                  className="w-10 h-10 text-lg text-grey-700 hover:bg-grey-100"
                >
                  −
                </button>

                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    setQuantity(
                      (current) =>
                        Math.min(
                          selectedVariantStock > 0 ? selectedVariantStock : 50,
                          current + 1
                        )
                    )
                  }
                  className="w-10 h-10 text-lg text-grey-700 hover:bg-grey-100"
                >
                  +
                </button>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            TOTAL
        ================================================== */}

        <div className="pt-5">

          <div className="flex justify-between items-center text-sm mb-3">
            <span className="text-grey-600">
              Subtotal
            </span>

            <span className="font-medium">
              {formatPrice(displayTotal)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm mb-4">
            <span className="text-grey-600">
              Delivery
            </span>

            <span className="font-medium text-green-700">
              Free
            </span>
          </div>

          <div className="border-t border-grey-300 pt-4 flex justify-between items-center">

            <span className="text-lg font-semibold">
              Total
            </span>

            <span className="text-2xl font-bold text-burgundy">
              {formatPrice(displayTotal)}
            </span>

          </div>

        </div>

        {/* COD SUMMARY */}

        <div className="mt-5 p-4 bg-[#faf7f5] border border-grey-200">

          <div className="flex items-center gap-3">

            <div className="w-8 h-8 rounded-full bg-burgundy text-white flex items-center justify-center text-xs">
              ✓
            </div>

            <div>
              <p className="text-sm font-semibold">
                Cash on Delivery
              </p>

              <p className="text-xs text-grey-500">
                Payment will be collected on delivery.
              </p>
            </div>

          </div>

        </div>

      </div>
    </form>
  );
}

function VariantSelect({ type, value, onChange, id, getStock }) {
  return (
    <label
      className="block"
      htmlFor={id}
    >
      <span className="block text-[10px] font-semibold uppercase tracking-wider text-grey-700 mb-1.5">
        {type.label}
      </span>

      <select
        id={id}
        required
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full appearance-none border border-grey-300 bg-white px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-burgundy"
      >
        {type.values.map(
          (option) => {
            const stock = getStock(option);

            return (
            <option
              key={option}
              value={option}
              disabled={stock < 1}
            >
              {option}
              {stock < 1 ? " — Out of Stock" : ""}
            </option>
            );
          }
        )}
      </select>
    </label>
  );
}

// ==========================================================
// INPUT FIELD
// ==========================================================

function Field({
  label,
  required,
  as = "input",
  type = "text",
  value,
  onChange,
  ...props
}) {
  const shared =
    "w-full border border-grey-300 bg-white px-3 py-3 text-sm text-foreground focus:outline-none focus:border-burgundy";

  return (
    <label className="block">

      <span className="block text-xs font-semibold uppercase tracking-wider text-grey-700 mb-1.5">
        {label}

        {required ? (
          <span className="text-burgundy">
            {" "}*
          </span>
        ) : null}
      </span>

      {as === "textarea" ? (
        <textarea
          className={`${shared} resize-y min-h-[90px]`}
          required={required}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          {...props}
        />
      ) : (
        <input
          className={shared}
          type={type}
          required={required}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          {...props}
        />
      )}

    </label>
  );
}
