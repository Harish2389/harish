"use client";

import Script from "next/script";
import { useState } from "react";

declare global {
  interface Window {
    Cashfree?: any;
  }
}

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const payNow = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cashfree/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          amount: 499,
          name: "Customer",
          email: "test@example.com",
          phone: "9999999999",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(data));

      const paymentSessionId = data.payment_session_id;

      // cashfree.js checkout using payment_session_id :contentReference[oaicite:4]{index=4}
      const cf = window.Cashfree?.({ mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox" });
      await cf.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
      <h1 className="text-xl font-semibold mb-3">Payment</h1>
      <button className="border px-4 py-2" onClick={payNow} disabled={loading}>
        {loading ? "Processing..." : "Pay ₹499"}
      </button>
    </div>
  );
}