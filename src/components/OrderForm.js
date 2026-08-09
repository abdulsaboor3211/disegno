"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/data/products";
import { DEFAULT_PRODUCT_SIZE, PRODUCT_COLORS, DEFAULT_PRODUCT_COLOR, PRODUCT_SIZES } from "@/data/sizes";
import { useCart } from "@/context/CartContext";
import { isValidImageSrc } from "@/lib/imageUrl";

const initialCustomer = {
  customerName: "",
  email: "",
  contact: "",
  whatsapp: "",
  city: "",
  address: "",
  notes: "",
};

export default function OrderForm({ product = null, fromCart = false }) {
  const { items: cartItems, clearCart, ready, subtotal } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(DEFAULT_PRODUCT_SIZE);
  const [color, setColor] = useState(DEFAULT_PRODUCT_COLOR);
  const [cartSizes, setCartSizes] = useState({});
  const [cartColors, setCartColors] = useState({});
  const [customer, setCustomer] = useState(initialCustomer);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const productImages = useMemo(() => {
    if (!product || fromCart) return [];
    const seen = new Set();
    const images = [];
    const addImage = (src) => {
      if (isValidImageSrc(src) && !seen.has(src)) {
        seen.add(src);
        images.push(src);
      }
    };
    addImage(product.productImage);

    for (let i = 1; i <= 9; i++) {
      addImage(product[`img${i}`]);
    }
    return images;
  }, [product, fromCart]);

  useEffect(() => {
    if (!fromCart) {
      return;
    }

    setCartSizes((prev) => {
      const next = { ...prev };
      for (const item of cartItems) {
        if (!next[item.sku]) {
          next[item.sku] = DEFAULT_PRODUCT_SIZE;
        }
      }
      return next;
    });

    setCartColors((prev) => {
      const next = { ...prev };
      for (const item of cartItems) {
        if (!next[item.sku]) {
          next[item.sku] = DEFAULT_PRODUCT_COLOR;
        }
      }
      return next;
    });
  }, [fromCart, cartItems]);

  const unitPrice = product
    ? product.discountPrice && product.discountPrice < product.productPrice
      ? product.discountPrice
      : product.productPrice || 0
    : 0;

  const singleTotal = useMemo(
    () => unitPrice * quantity,
    [unitPrice, quantity]
  );

  const hasDiscount =
    product &&
    product.discountPrice &&
    product.discountPrice < product.productPrice;

  const orderItems = fromCart
    ? cartItems.map((item) => ({
      ...item,
      size: cartSizes[item.sku] || DEFAULT_PRODUCT_SIZE,
      color: cartColors[item.sku] || DEFAULT_PRODUCT_COLOR,
    }))
    : product
      ? [
        {
          sku: product.sku,
          productName: product.productName,
          productImage: product.productImage,
          unitPrice,
          quantity,
          size,
          color,
        },
      ]
      : [];

  const displayTotal = fromCart ? subtotal : singleTotal;

  function updateField(field, value) {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  }

  function updateCartSize(sku, value) {
    setCartSizes((prev) => ({ ...prev, [sku]: value }));
  }

  function updateCartColor(sku, value) {
    setCartColors((prev) => ({ ...prev, [sku]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    if (fromCart && cartItems.length === 0) {
      setStatus("error");
      setMessage("Your cart is empty");
      return;
    }

    try {
      const payload = {
        ...customer,
        items: orderItems.map((item) => ({
          productSku: item.sku,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          size: item.size,
          color: item.color,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setOrderId(data.orderId);
      setStatus("success");
      setMessage(
        data.preview
          ? data.message
          : "Your order was placed successfully. We will contact you soon."
      );
      setCustomer(initialCustomer);
      setQuantity(1);
      setSize(DEFAULT_PRODUCT_SIZE);
      setColor(DEFAULT_PRODUCT_COLOR);
      setCartSizes({});
      setCartColors({});
      setSelectedImage(null);

      if (fromCart) {
        clearCart();
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong");
    }
  }

  if (fromCart && ready && cartItems.length === 0 && status !== "success") {
    return (
      <div className="max-w-xl mx-auto text-center border border-grey-200 bg-white p-8 sm:p-12">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-3">
          Your cart is empty
        </h1>
        <p className="text-grey-700 mb-8">
          Add products to your cart before checking out.
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

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto text-center border border-grey-200 bg-white p-8 sm:p-12">
        <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
          Order received
        </p>
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-3">
          Thank you
        </h1>
        <p className="text-grey-700 mb-2">{message}</p>
        {orderId && (
          <p className="text-sm text-grey-500 mb-8">
            Order ID:{" "}
            <span className="font-semibold text-foreground">{orderId}</span>
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

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-2 gap-8 lg:gap-12"
      >
        <div className="border border-grey-200 bg-white p-5 sm:p-7 h-fit">
          <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            {fromCart ? "Cart items" : "Your selection"}
          </p>

          {fromCart ? (
            <div className="space-y-4 mb-5">
              {cartItems.map((item) => (
                <div
                  key={item.sku}
                  className="border border-grey-200 p-3 space-y-3"
                >
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 bg-grey-100 shrink-0 overflow-hidden">
                      {isValidImageSrc(item.productImage) ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-sm font-semibold leading-snug">
                        {item.productName}
                      </p>
                      <p className="text-[10px] text-grey-500 uppercase tracking-widest mt-0.5">
                        {item.sku}
                      </p>
                      <p className="text-sm text-grey-700 mt-1">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-burgundy shrink-0">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <SizeSelect
                      value={cartSizes[item.sku] || DEFAULT_PRODUCT_SIZE}
                      onChange={(value) => updateCartSize(item.sku, value)}
                      id={`size-${item.sku}`}
                    />
                    <ColorSelect
                      value={cartColors[item.sku] || DEFAULT_PRODUCT_COLOR}
                      onChange={(value) => updateCartColor(item.sku, value)}
                      id={`color-${item.sku}`}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-grey-100">
                <span className="text-sm text-grey-700">Total</span>
                <span className="text-2xl font-bold text-burgundy">
                  {formatPrice(displayTotal)}
                </span>
              </div>
              <Link
                href="/cart"
                className="text-sm text-grey-700 hover:text-burgundy"
              >
                ← Edit cart
              </Link>
            </div>
          ) : (
            <>
              <div className="relative aspect-[4/3] bg-grey-100 mb-5 overflow-hidden">
                {(() => {
                  const displayImage = selectedImage || productImages[0];
                  return isValidImageSrc(displayImage) ? (
                    <Image
                      src={displayImage}
                      alt={product.productName}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-6"
                      priority
                    />
                  ) : null;
                })()}
              </div>

              {productImages.length > 1 && (
                <div className="flex justify-center gap-2 mb-5">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 border-2 overflow-hidden bg-grey-100 ${(selectedImage || productImages[0]) === img
                          ? "border-burgundy"
                          : "border-grey-200 hover:border-grey-400"
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.productName} ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}

              <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                {product.productName}
              </h2>
              <p className="text-[11px] text-grey-500 uppercase tracking-widest mb-4">
                SKU: {product.sku}
              </p>

              {product.productDescription ? (
                <p className="text-sm sm:text-base text-grey-700 leading-relaxed mb-5">
                  {product.productDescription}
                </p>
              ) : null}

              <div className="flex items-end gap-3 mb-5">
                {hasDiscount ? (
                  <>
                    <p className="text-2xl font-bold text-burgundy">
                      {formatPrice(product.discountPrice)}
                    </p>
                    <p className="text-base text-grey-500 line-through pb-0.5">
                      {formatPrice(product.productPrice)}
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {formatPrice(product.productPrice)}
                  </p>
                )}
              </div>

              <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SizeSelect value={size} onChange={setSize} id="order-size" />
                <ColorSelect
                  value={color}
                  onChange={setColor}
                  id="order-color"
                />
              </div>

              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] text-grey-500 uppercase tracking-wider mb-1">
                    Quantity
                  </p>
                  <div className="inline-flex items-center border border-grey-300">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
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
                      onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                      className="w-10 h-10 text-lg text-grey-700 hover:bg-grey-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-grey-500 uppercase tracking-wider mb-1">
                    Total
                  </p>
                  <p className="text-2xl font-bold text-burgundy">
                    {formatPrice(displayTotal)}
                  </p>
                  <p className="text-xs text-grey-500">
                    {formatPrice(unitPrice)} × {quantity}
                  </p>
                </div>
              </div>

              <Link
                href="/#products"
                className="text-sm text-grey-700 hover:text-burgundy"
              >
                ← Back to products
              </Link>
            </>
          )}
        </div>

        <div className="border border-grey-200 bg-white p-5 sm:p-7">
          <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-2">
            Delivery details
          </p>
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
            Place your order
          </h2>

          <div className="space-y-4">
            <Field
              label="Full name"
              value={customer.customerName}
              onChange={(value) => updateField("customerName", value)}
              autoComplete="name"
            />
            <Field
              label="Email"
              type="email"
              value={customer.email}
              onChange={(value) => updateField("email", value)}
              autoComplete="email"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Contact number"
                type="tel"
                value={customer.contact}
                onChange={(value) => updateField("contact", value)}
                autoComplete="tel"
                placeholder="03XXXXXXXXX"
              />
              <Field
                label="WhatsApp number"
                type="tel"
                required
                value={customer.whatsapp}
                onChange={(value) => updateField("whatsapp", value)}
                placeholder="03XXXXXXXXX"
              />
            </div>
            <Field
              label="City"
              value={customer.city}
              onChange={(value) => updateField("city", value)}
              autoComplete="address-level2"
            />
            <Field
              label="Full delivery address"
              required
              as="textarea"
              rows={3}
              value={customer.address}
              onChange={(value) => updateField("address", value)}
              autoComplete="street-address"
            />
            <Field
              label="Order notes"
              as="textarea"
              rows={2}
              value={customer.notes}
              onChange={(value) => updateField("notes", value)}
              placeholder="Optional"
            />
          </div>

          {status === "error" && (
            <p className="mt-4 text-sm text-burgundy" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-6 w-full inline-flex items-center justify-center px-8 py-3.5 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Placing order…" : "Confirm order"}
          </button>

          <p className="mt-3 text-xs text-grey-500 leading-relaxed">
            Cash on delivery. We will confirm on WhatsApp or phone after you
            submit.
          </p>
        </div>
      </form>

      {!fromCart && isValidImageSrc(product?.posterImage) ? (
        <div className="mt-10 sm:mt-14 border border-grey-200 bg-white overflow-hidden">
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/10]">
            <Image
              src={product.posterImage}
              alt={`${product.productName} poster`}
              fill
              sizes="100vw"
              className="object-contain bg-grey-100"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SizeSelect({ value, onChange, id }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="block text-sm font-medium text-foreground mb-1.5">
        Size
      </span>
      <div className="relative">
        <select
          id={id}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none border-2 border-foreground bg-white px-3 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:border-burgundy"
        >
          {PRODUCT_SIZES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground text-xs"
        >
          ∨
        </span>
      </div>
    </label>
  );
}

function ColorSelect({ value, onChange, id }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="block text-sm font-medium text-foreground mb-1.5">
        Color
      </span>
      <div className="relative">
        <select
          id={id}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none border-2 border-foreground bg-white px-3 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:border-burgundy"
        >
          {PRODUCT_COLORS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground text-xs"
        >
          ∨
        </span>
      </div>
    </label>
  );
}

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
    "w-full border border-grey-300 bg-white px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-burgundy";

  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-grey-700 mb-1.5">
        {label}
        {required ? <span className="text-burgundy"> *</span> : null}
      </span>
      {as === "textarea" ? (
        <textarea
          className={`${shared} resize-y min-h-[80px]`}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          {...props}
        />
      ) : (
        <input
          className={shared}
          type={type}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          {...props}
        />
      )}
    </label>
  );
}
