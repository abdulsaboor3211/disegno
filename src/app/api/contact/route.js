import { Resend } from "resend";
import { NextResponse } from "next/server";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();
    const message = String(body.message || "").trim();

    if (!whatsapp) {
      return NextResponse.json(
        { error: "WhatsApp number is required" },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email or leave it blank" },
        { status: 400 }
      );
    }

    const payload = {
      name,
      email,
      whatsapp,
      message,
      date: new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }),
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
      console.info("[contact:preview]", payload);
      return NextResponse.json({
        success: true,
        preview: true,
        message:
          "Message received. Set ORDER_EMAIL_TO in .env.local to receive emails.",
      });
    }

    const resend = new Resend(apiKey);
    const sendPayload = {
      from: fromEmail.includes("<")
        ? fromEmail
        : `Disegno Contact <${fromEmail}>`,
      to: toEmails,
      subject: `New contact message${name ? ` — ${name}` : ""}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #2a2a2a; line-height: 1.5;">
          <h2 style="color: #3e3034; margin-bottom: 8px;">New Contact Message</h2>
          <p style="margin-top: 0;">Date: ${escapeHtml(payload.date)}</p>
          <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
            <tr><td style="padding: 4px 0; width: 120px;">Name</td><td>${escapeHtml(name || "—")}</td></tr>
            <tr><td style="padding: 4px 0;">Email</td><td>${escapeHtml(email || "—")}</td></tr>
            <tr><td style="padding: 4px 0;">WhatsApp</td><td>${escapeHtml(whatsapp)}</td></tr>
            <tr><td style="padding: 4px 0; vertical-align: top;">Message</td><td>${escapeHtml(message)}</td></tr>
          </table>
        </div>
      `,
    };

    if (email) {
      sendPayload.replyTo = email;
    }

    const { error } = await resend.emails.send(sendPayload);

    if (error) {
      console.error("[contact:resend]", error);
      return NextResponse.json(
        { error: error.message || "Failed to send message" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "Could not send message. Please try again." },
      { status: 500 }
    );
  }
}
