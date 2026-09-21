import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const verifierSource = await readFile(new URL("../src/lib/turnstile.js", import.meta.url), "utf8");

async function harness({ action = "contact", result, env = {}, failure, httpStatus = 200 } = {}) {
  const calls = { verification: [], emails: 0, products: 0 };
  const context = vm.createContext({
    process: { env: { NODE_ENV: "production", TURNSTILE_SECRET_KEY: "private-test-secret", ...env } },
    AbortSignal,
    console,
    fetch: async (url, options) => {
      calls.verification.push({ url, options });
      if (failure) throw failure;
      return Response.json(result === undefined
        ? { success: true, action, hostname: "disegnoproducts.com" }
        : result, { status: httpStatus });
    },
  });
  const verifier = new vm.SourceTextModule(verifierSource, { context });
  await verifier.link(() => { throw new Error("Verifier must have no client dependencies"); });
  await verifier.evaluate();

  function module(exports) {
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
    }, { context });
  }

  async function route(name) {
    const source = await readFile(new URL(`../src/app/api/${name}/route.js`, import.meta.url), "utf8");
    const entry = new vm.SourceTextModule(source, { context });
    await entry.link((specifier) => {
      if (specifier === "@/lib/turnstile") return verifier;
      if (specifier === "next/server") return module({ NextResponse: Response });
      if (specifier === "resend") return module({ Resend: class {
        emails = { send: async () => {
          calls.emails++;
          return { data: { id: "test-email" } };
        } };
      } });
      if (specifier === "@/lib/googleSheets") return module({ getProducts: async () => {
        calls.products++;
        return [{ sku: "test-product", productName: "Test product", productPrice: 100 }];
      } });
      if (specifier === "@/lib/variants") return module({
        formatVariantLabel: (value) => value,
        getSelectedVariantStock: () => 100,
        normalizeVariantSelections: (value) => value || {},
      });
      throw new Error(`Unexpected dependency: ${specifier}`);
    });
    await entry.evaluate();
    return entry.namespace;
  }

  return { verify: verifier.namespace.verifyTurnstile, route, calls };
}

test("missing, malformed, and oversized tokens are rejected before contacting Cloudflare", async () => {
  const { verify, calls } = await harness();
  for (const token of [undefined, null, "", " ", 123, {}, [], "x".repeat(2049)]) {
    assert.equal((await verify(token, "contact")).status, 403);
  }
  assert.equal(calls.verification.length, 0);
});

test("missing secret blocks submissions without a development or preview bypass", async () => {
  for (const NODE_ENV of ["production", "development"]) {
    const { verify, calls } = await harness({ env: { TURNSTILE_SECRET_KEY: "", NODE_ENV } });
    assert.equal((await verify("token", "contact")).status, 503);
    assert.equal(calls.verification.length, 0);
  }
});

test("valid token is verified with the private key, no cache, and a timeout", async () => {
  const { verify, calls } = await harness();
  assert.equal((await verify("valid-token", "contact")).success, true);
  const { url, options } = calls.verification[0];
  assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
  assert.deepEqual(JSON.parse(options.body), { secret: "private-test-secret", response: "valid-token" });
  assert.equal(options.cache, "no-store");
  assert.ok(options.signal instanceof AbortSignal);
});

test("forged, expired, reused, wrong-action, and wrong-host tokens fail closed", async () => {
  for (const result of [
    { success: false, "error-codes": ["invalid-input-response"] },
    { success: false, "error-codes": ["timeout-or-duplicate"] },
    { success: "true", action: "contact", hostname: "disegnoproducts.com" },
    { success: true, action: "order", hostname: "disegnoproducts.com" },
    { success: true, action: "contact", hostname: "attacker.example" },
    { success: true, action: "contact", hostname: "localhost" },
    { success: true },
    null,
  ]) {
    const { verify } = await harness({ result });
    assert.equal((await verify("token", "contact")).status, 403);
  }
});

test("verification runs again on every attempt and rejects a consumed token", async () => {
  const result = { success: true, action: "contact", hostname: "disegnoproducts.com" };
  const { verify, calls } = await harness({ result });
  assert.equal((await verify("same-token", "contact")).success, true);
  result.success = false;
  result["error-codes"] = ["timeout-or-duplicate"];
  assert.equal((await verify("same-token", "contact")).status, 403);
  assert.equal(calls.verification.length, 2);
});

test("network failures, timeouts, and service errors block processing", async () => {
  for (const options of [{ failure: new Error("Network down") }, { failure: new DOMException("Timed out", "TimeoutError") }, { httpStatus: 503 }]) {
    const { verify } = await harness(options);
    assert.equal((await verify("token", "contact")).status, 503);
  }
});

test("custom hostnames and local development are supported explicitly", async () => {
  for (const [hostname, env] of [
    ["preview.example", { TURNSTILE_ALLOWED_HOSTNAMES: "disegnoproducts.com, preview.example" }],
    ["localhost", { NODE_ENV: "development" }],
  ]) {
    const { verify } = await harness({ env, result: { success: true, action: "contact", hostname } });
    assert.equal((await verify("token", "contact")).success, true);
  }
});

const payload = {
  whatsapp: "03000000000",
  message: "Test message",
  address: "Test address",
  items: [{ productSku: "test-product", productName: "Test product", quantity: 1 }],
};

for (const [endpoint, action] of [["contact", "contact"], ["orders", "order"]]) {
  test(`${endpoint}: direct API calls cannot bypass verification or trigger side effects`, async () => {
    for (const token of [undefined, "forged-token"]) {
      const { route, calls } = await harness({ action, result: { success: false } });
      const { POST } = await route(endpoint);
      const response = await POST(new Request(`https://disegnoproducts.com/api/${endpoint}`, {
        method: "POST",
        body: JSON.stringify({ ...payload, turnstileToken: token }),
      }));
      assert.equal(response.status, 403);
      assert.equal(calls.emails, 0);
      assert.equal(calls.products, 0);
    }
  });

  test(`${endpoint}: verified submissions still complete the existing email flow`, async () => {
    const { route, calls } = await harness({ action, env: {
      RESEND_API_KEY: "test-key", ORDER_EMAIL_TO: "orders@example.test",
    } });
    const { POST } = await route(endpoint);
    const response = await POST(new Request(`https://disegnoproducts.com/api/${endpoint}`, {
      method: "POST", body: JSON.stringify({ ...payload, turnstileToken: "valid-token" }),
    }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).success, true);
    assert.equal(calls.emails, 1);
    assert.equal(calls.verification.length, 1);
  });
}

test("public configuration returns only the site key and fails closed when misconfigured", async () => {
  for (const secret of ["private-test-secret", ""]) {
    const { route } = await harness({ env: { TURNSTILE_SITE_KEY: "public-site-key", TURNSTILE_SECRET_KEY: secret } });
    const { GET } = await route("turnstile");
    const response = await GET();
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    const body = await response.json();
    if (secret) {
      assert.deepEqual(body, { siteKey: "public-site-key" });
    } else {
      assert.equal(response.status, 503);
      assert.ok(body.error);
    }
  }
});
