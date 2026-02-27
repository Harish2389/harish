"use client";

export default function PricingPage() {
  const pay = async () => {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();

    if (data?.url) window.location.href = data.url;
    else alert(data?.error || "Payment error");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Pricing</h1>
      <p style={{ marginTop: 8 }}>Get premium access</p>

      <button
        onClick={pay}
        style={{
          marginTop: 16,
          padding: "10px 16px",
          borderRadius: 10,
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Buy Now
      </button>
    </div>
  );
}