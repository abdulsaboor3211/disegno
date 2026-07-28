import { Resend } from "resend";
import { NextResponse } from "next/server";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function normalizeItems(body) {
  if (Array.isArray(body.items) && body.items.length > 0) {
    return body.items.map((item) => ({
      productSku: String(item.productSku || item.sku || "").trim(),
      productName: String(item.productName || "").trim(),
      quantity: Number(item.quantity) || 0,
      unitPrice: Number(item.unitPrice) || 0,
      size: String(item.size || "").trim(),
      color: String(item.color || "").trim(),
    }));
  }

  if (body.productSku && body.productName) {
    return [
      {
        productSku: String(body.productSku).trim(),
        productName: String(body.productName).trim(),
        quantity: Number(body.quantity) || 0,
        unitPrice: Number(body.unitPrice) || 0,
        size: String(body.size || "").trim(),
        color: String(body.color || "").trim(),
      },
    ];
  }

  return [];
}

function buildOrderEmail(order) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">${escapeHtml(item.productSku)}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">${escapeHtml(item.productName)}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">${escapeHtml(item.size || "—")}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">${escapeHtml(item.color || "—")}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">${escapeHtml(item.quantity)}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">Rs. ${item.unitPrice.toLocaleString("en-PK")}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">Rs. ${(item.unitPrice * item.quantity).toLocaleString("en-PK")}</td>
      </tr>`
    )
    .join("");

  const subjectName =
    order.items.length === 1
      ? order.items[0].productName
      : `${order.items.length} items`;

  return {
    subject: `New Order ${order.orderId} — ${subjectName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #2a2a2a; line-height: 1.5;">
        <h2 style="color: #3e3034; margin-bottom: 8px;">New Disegno Order</h2>
        <p style="margin-top: 0;">Order ID: <strong>${escapeHtml(order.orderId)}</strong></p>
        <p style="margin-top: 0;">Date: ${escapeHtml(order.date)}</p>

        <h3 style="margin-bottom: 8px;">Customer</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
          <tr><td style="padding: 4px 0; width: 140px;">Name</td><td>${escapeHtml(order.customerName || "—")}</td></tr>
          <tr><td style="padding: 4px 0;">Email</td><td>${escapeHtml(order.email || "—")}</td></tr>
          <tr><td style="padding: 4px 0;">Contact</td><td>${escapeHtml(order.contact || "—")}</td></tr>
          <tr><td style="padding: 4px 0;">WhatsApp</td><td>${escapeHtml(order.whatsapp)}</td></tr>
          <tr><td style="padding: 4px 0;">City</td><td>${escapeHtml(order.city || "—")}</td></tr>
          <tr><td style="padding: 4px 0; vertical-align: top;">Address</td><td>${escapeHtml(order.address)}</td></tr>
          <tr><td style="padding: 4px 0; vertical-align: top;">Notes</td><td>${escapeHtml(order.notes || "—")}</td></tr>
        </table>

        <h3 style="margin-bottom: 8px; margin-top: 24px;">Items</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
          <thead>
            <tr>
              <th align="left" style="padding: 8px 0; border-bottom: 2px solid #d4d4d4;">SKU</th>
              <th align="left" style="padding: 8px 0; border-bottom: 2px solid #d4d4d4;">Product</th>
              <th align="left" style="padding: 8px 0; border-bottom: 2px solid #d4d4d4;">Size</th>
              <th align="left" style="padding: 8px 0; border-bottom: 2px solid #d4d4d4;">Color</th>
              <th align="left" style="padding: 8px 0; border-bottom: 2px solid #d4d4d4;">Qty</th>
              <th align="left" style="padding: 8px 0; border-bottom: 2px solid #d4d4d4;">Unit</th>
              <th align="left" style="padding: 8px 0; border-bottom: 2px solid #d4d4d4;">Line</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="margin-top: 16px;"><strong>Order total: Rs. ${order.total.toLocaleString("en-PK")}</strong></p>
      </div>
    `,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();

    const whatsapp = String(body.whatsapp || "").trim();
    const address = String(body.address || "").trim();

    if (!whatsapp) {
      return NextResponse.json(
        { error: "WhatsApp number is required" },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { error: "Full delivery address is required" },
        { status: 400 }
      );
    }

    const email = String(body.email || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email or leave it blank" },
        { status: 400 }
      );
    }

    const items = normalizeItems(body);

    if (items.length === 0) {
      return NextResponse.json(
        { error: "At least one product is required" },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item.productSku || !item.productName) {
        return NextResponse.json(
          { error: "Each item needs SKU and product name" },
          { status: 400 }
        );
      }

      if (!item.size) {
        return NextResponse.json(
          { error: "Please select a size for each item" },
          { status: 400 }
        );
      }

      if (!item.color) {
        return NextResponse.json(
          { error: "Please select a color for each item" },
          { status: 400 }
        );
      }

      if (
        !Number.isFinite(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 50
      ) {
        return NextResponse.json(
          { error: "Each item quantity must be between 1 and 50" },
          { status: 400 }
        );
      }
    }

    const total = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const orderId = `DK-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      orderId,
      date: new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
      customerName: String(body.customerName || "").trim(),
      email,
      contact: String(body.contact || "").trim(),
      whatsapp,
      address,
      city: String(body.city || "").trim(),
      notes: String(body.notes || "").trim(),
      items,
      total,
    };

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Disegno <disegnoproducts@gmail.com>";

    const toEmails = (process.env.ORDER_EMAIL_TO || "")
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e && e !== "you@example.com");

    if (
      !apiKey ||
      apiKey === "re_placeholder" ||
      toEmails.length === 0
    ) {
      console.info("[order:preview]", order);
      return NextResponse.json({
        success: true,
        preview: true,
        orderId,
        message:
          "Order received. Set ORDER_EMAIL_TO in .env.local to your real inbox to receive emails.",
      });
    }

    const resend = new Resend(apiKey);
    const { subject, html } = buildOrderEmail(order);

    const sendPayload = {
      from: fromEmail.includes("<")
        ? fromEmail
        : `Disegno Orders <${fromEmail}>`,
      to: toEmails,
      subject,
      html,
    };

    if (email) {
      sendPayload.replyTo = email;
    }

    const { data, error } = await resend.emails.send(sendPayload);

    if (error) {
      console.error("[order:resend]", error);
      return NextResponse.json(
        { error: error.message || "Failed to send order email" },
        { status: 502 }
      );
    }

    console.info("[order:sent]", { orderId, resendId: data?.id });
    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("[order]", error);
    return NextResponse.json(
      { error: "Could not place order. Please try again." },
      { status: 500 }
    );
  }
}
