import { Resend } from "resend";
import { NextResponse } from "next/server";

const REQUIRED_FIELDS = [
  "customerName",
  "email",
  "contact",
  "whatsapp",
  "address",
  "productSku",
  "productName",
  "quantity",
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildOrderEmail(order) {
  const unitPrice = Number(order.unitPrice) || 0;
  const quantity = Number(order.quantity) || 1;
  const total = unitPrice * quantity;
  const orderId = order.orderId;

  return {
    subject: `New Order ${orderId} — ${order.productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #2a2a2a; line-height: 1.5;">
        <h2 style="color: #8b2942; margin-bottom: 8px;">New Disegno Order</h2>
        <p style="margin-top: 0;">Order ID: <strong>${escapeHtml(orderId)}</strong></p>
        <p style="margin-top: 0;">Date: ${escapeHtml(order.date)}</p>

        <h3 style="margin-bottom: 8px;">Customer</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
          <tr><td style="padding: 4px 0; width: 140px;">Name</td><td>${escapeHtml(order.customerName)}</td></tr>
          <tr><td style="padding: 4px 0;">Email</td><td>${escapeHtml(order.email)}</td></tr>
          <tr><td style="padding: 4px 0;">Contact</td><td>${escapeHtml(order.contact)}</td></tr>
          <tr><td style="padding: 4px 0;">WhatsApp</td><td>${escapeHtml(order.whatsapp)}</td></tr>
          <tr><td style="padding: 4px 0;">City</td><td>${escapeHtml(order.city || "—")}</td></tr>
          <tr><td style="padding: 4px 0; vertical-align: top;">Address</td><td>${escapeHtml(order.address)}</td></tr>
          <tr><td style="padding: 4px 0; vertical-align: top;">Notes</td><td>${escapeHtml(order.notes || "—")}</td></tr>
        </table>

        <h3 style="margin-bottom: 8px; margin-top: 24px;">Product</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
          <tr><td style="padding: 4px 0; width: 140px;">SKU</td><td>${escapeHtml(order.productSku)}</td></tr>
          <tr><td style="padding: 4px 0;">Product</td><td>${escapeHtml(order.productName)}</td></tr>
          <tr><td style="padding: 4px 0;">Size</td><td>${escapeHtml(order.size || "—")}</td></tr>
          <tr><td style="padding: 4px 0;">Color</td><td>${escapeHtml(order.color || "—")}</td></tr>
          <tr><td style="padding: 4px 0;">Quantity</td><td>${escapeHtml(quantity)}</td></tr>
          <tr><td style="padding: 4px 0;">Unit price</td><td>Rs. ${unitPrice.toLocaleString("en-PK")}</td></tr>
          <tr><td style="padding: 4px 0;"><strong>Total</strong></td><td><strong>Rs. ${total.toLocaleString("en-PK")}</strong></td></tr>
        </table>
      </div>
    `,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();

    for (const field of REQUIRED_FIELDS) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const quantity = Number(body.quantity);
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 50) {
      return NextResponse.json(
        { error: "Quantity must be between 1 and 50" },
        { status: 400 }
      );
    }

    const email = String(body.email).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required" },
        { status: 400 }
      );
    }

    const orderId = `DK-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      orderId,
      date: new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
      customerName: String(body.customerName).trim(),
      email,
      contact: String(body.contact).trim(),
      whatsapp: String(body.whatsapp).trim(),
      address: String(body.address).trim(),
      city: String(body.city || "").trim(),
      notes: String(body.notes || "").trim(),
      productSku: String(body.productSku).trim(),
      productName: String(body.productName).trim(),
      size: String(body.size || "").trim(),
      color: String(body.color || "").trim(),
      quantity,
      unitPrice: Number(body.unitPrice) || 0,
    };

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.ORDER_EMAIL_TO;

    if (
      !apiKey ||
      apiKey === "re_placeholder" ||
      !fromEmail ||
      !toEmail ||
      toEmail === "you@example.com"
    ) {
      console.info("[order:preview]", order);
      return NextResponse.json({
        success: true,
        preview: true,
        orderId,
        message:
          "Order received. Resend is not configured yet — update .env.local to send real emails.",
      });
    }

    const resend = new Resend(apiKey);
    const { subject, html } = buildOrderEmail(order);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error("[order:resend]", error);
      return NextResponse.json(
        { error: error.message || "Failed to send order email" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("[order]", error);
    return NextResponse.json(
      { error: "Could not place order. Please try again." },
      { status: 500 }
    );
  }
}
