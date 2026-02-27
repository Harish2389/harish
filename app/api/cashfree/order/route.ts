import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = Number(body?.amount ?? 499);
    const phone = String(body?.phone ?? "9999999999");
    const email = String(body?.email ?? "test@example.com");
    const name = String(body?.name ?? "Customer");

    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    const env = process.env.CASHFREE_ENV || "SANDBOX";
    const apiVersion = process.env.CASHFREE_API_VERSION || "2025-01-01";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!clientId || !clientSecret || !baseUrl) {
      return NextResponse.json(
        { error: "Missing CASHFREE_CLIENT_ID / CASHFREE_CLIENT_SECRET / NEXT_PUBLIC_BASE_URL" },
        { status: 500 }
      );
    }

    const host =
      env === "PROD" ? "https://api.cashfree.com" : "https://sandbox.cashfree.com";

    const orderId = `order_${Date.now()}`;

    const res = await fetch(`${host}/pg/orders`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-api-version": apiVersion,
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: email, // unique id ok
          customer_email: email,
          customer_phone: phone,
          customer_name: name,
        },
        order_meta: {
          return_url: `${baseUrl}/payment/success?order_id={order_id}`,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: 400 });
    }

    // Cashfree returns payment_session_id for checkout :contentReference[oaicite:2]{index=2}
    return NextResponse.json({
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Order create failed" }, { status: 500 });
  }
}