"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

export default function Turnstile({ action, onVerify }) {
  const container = useRef(null);
  const widgetId = useRef(null);
  const [siteKey, setSiteKey] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    let active = true;

    async function loadConfiguration() {
      try {
        const response = await fetch("/api/turnstile", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok || !data.siteKey) throw new Error("Unavailable");
        if (active) setSiteKey(data.siteKey);
      } catch {
        if (active) setError("Security check could not load. Please reload and try again.");
      } finally {
        clearTimeout(timeout);
      }
    }

    loadConfiguration();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!siteKey || !scriptReady || !container.current) return;
    let active = true;

    function invalidate(message) {
      if (!active) return;
      onVerify("");
      setVerified(false);
      setError(message);
    }

    try {
      widgetId.current = window.turnstile.render(container.current, {
        sitekey: siteKey,
        action,
        theme: "light",
        size: container.current.clientWidth < 300 ? "compact" : "flexible",
        "response-field": false,
        callback: (token) => {
          if (!active) return;
          onVerify(token);
          setVerified(true);
          setError("");
        },
        "expired-callback": () => invalidate("Security check expired. Please verify again."),
        "timeout-callback": () => invalidate("Security check timed out. Please try again."),
        "error-callback": () => {
          invalidate("Security check failed. Please try again.");
        },
      });
    } catch {
      // Defer to avoid a synchronous state update during the effect.
      queueMicrotask(() => invalidate("Security check could not start. Please reload and try again."));
    }

    return () => {
      active = false;
      if (widgetId.current !== null) {
        window.turnstile?.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [action, onVerify, scriptReady, siteKey]);

  useEffect(() => {
    if (scriptReady) return;
    const timeout = setTimeout(() => {
      setError("Security check is taking too long to load. Please reload and try again.");
    }, 20000);
    return () => clearTimeout(timeout);
  }, [scriptReady]);

  function retry() {
    onVerify("");
    setVerified(false);
    setError("");
    if (widgetId.current !== null && window.turnstile) {
      window.turnstile.reset(widgetId.current);
    } else {
      window.location.reload();
    }
  }

  return (
    <div className="mt-5 space-y-2">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => {
          onVerify("");
          setVerified(false);
          setError("Security check could not load. Please reload and try again.");
        }}
      />
      <div ref={container} />
      <p className="text-xs text-grey-600" role="status" aria-live="polite">
        {error || (verified ? "Security check complete." : "Please complete the security check before submitting.")}
      </p>
      {error && (
        <button type="button" onClick={retry} className="text-sm text-burgundy underline">
          Retry security check
        </button>
      )}
    </div>
  );
}
