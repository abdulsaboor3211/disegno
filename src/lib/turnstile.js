// Server-side only: never import this module from a client component.
const verificationError = "Please complete the security check and try again.";
const unavailableError = "Security verification is temporarily unavailable. Please try again shortly.";

export async function verifyTurnstile(token, action) {
  if (typeof token !== "string" || !token.trim() || token.length > 2048) {
    return { success: false, status: 403, error: verificationError };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    return { success: false, status: 503, error: unavailableError };
  }

  const allowedHostnames = (
    process.env.TURNSTILE_ALLOWED_HOSTNAMES ||
    "disegnoproducts.com,www.disegnoproducts.com"
  ).split(",").map((hostname) => hostname.trim().toLowerCase()).filter(Boolean);

  if (process.env.NODE_ENV !== "production") {
    allowedHostnames.push("localhost", "127.0.0.1", "[::1]");
  }

  try {
    // Do not cache or retry a successful verification: tokens are single-use.
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return { success: false, status: 503, error: unavailableError };
    }

    const result = await response.json();
    if (
      result?.success !== true ||
      result.action !== action ||
      typeof result.hostname !== "string" ||
      !allowedHostnames.includes(result.hostname.toLowerCase())
    ) {
      return { success: false, status: 403, error: verificationError };
    }

    return { success: true };
  } catch {
    // Network errors, timeouts, and malformed responses must never bypass verification.
    return { success: false, status: 503, error: unavailableError };
  }
}
