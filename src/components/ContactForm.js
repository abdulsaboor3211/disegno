"use client";

import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  whatsapp: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setMessage(
        data.preview
          ? data.message
          : "Message sent. We will get back to you soon."
      );
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-grey-200 bg-white p-6 sm:p-8 text-center">
        <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-3">
          Message sent
        </p>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
          Thank you
        </h2>
        <p className="text-grey-700 mb-6">{message}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setMessage("");
          }}
          className="inline-flex items-center justify-center px-8 py-3 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-grey-200 bg-white p-5 sm:p-7 space-y-4"
    >
      <div>
        <p className="text-burgundy text-xs font-semibold uppercase tracking-[0.25em] mb-2">
          Send a message
        </p>
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Contact form
        </h2>
      </div>

      <label className="block">
        <span className="block text-xs font-semibold uppercase tracking-wider text-grey-700 mb-1.5">
          Name
        </span>
        <input
          className="w-full border border-grey-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          autoComplete="name"
        />
      </label>

      <label className="block">
        <span className="block text-xs font-semibold uppercase tracking-wider text-grey-700 mb-1.5">
          Email
        </span>
        <input
          type="email"
          className="w-full border border-grey-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          autoComplete="email"
        />
      </label>

      <label className="block">
        <span className="block text-xs font-semibold uppercase tracking-wider text-grey-700 mb-1.5">
          WhatsApp number <span className="text-burgundy">*</span>
        </span>
        <input
          type="tel"
          required
          className="w-full border border-grey-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-burgundy"
          value={form.whatsapp}
          onChange={(event) => updateField("whatsapp", event.target.value)}
          placeholder="03XXXXXXXXX"
        />
      </label>

      <label className="block">
        <span className="block text-xs font-semibold uppercase tracking-wider text-grey-700 mb-1.5">
          Message <span className="text-burgundy">*</span>
        </span>
        <textarea
          required
          rows={5}
          className="w-full border border-grey-300 bg-white px-3 py-2.5 text-sm resize-y min-h-[120px] focus:outline-none focus:border-burgundy"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="How can we help?"
        />
      </label>

      {status === "error" && (
        <p className="text-sm text-burgundy" role="alert">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full inline-flex items-center justify-center px-8 py-3.5 bg-action text-white text-sm font-semibold uppercase tracking-wider hover:bg-action-dark transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
