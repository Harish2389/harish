import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),

  GROQ_API_KEY: z.string().min(1),
  GROQ_MODEL: z.string().default("llama3-70b-8192"),

  FREE_DAILY_LIMIT: z.coerce.number().int().positive().default(5),
  SITE_NAME: z.string().default("AI Homework Helper"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const msg = parsed.error.issues
    .map((i) => `${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error("Invalid environment variables:\n" + msg);
}

export const env = parsed.data;
