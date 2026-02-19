import { env } from "./env";

export async function groqSolve(question: string) {
  const system = [
    "You are a professional school tutor for classes 6-12.",
    "Explain answers step-by-step in simple Hindi and English.",
    "If it's math, show calculations clearly.",
    "If information is missing, ask one short follow-up question.",
    "Do NOT help with cheating during live exams; instead explain concepts and practice steps."
  ].join(" ");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.GROQ_MODEL,
      temperature: 0.5,
      messages: [
        { role: "system", content: system },
        { role: "user", content: question },
      ],
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Groq API error (${res.status}): ${txt.slice(0, 300)}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "No answer returned.";
}
