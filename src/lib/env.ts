import { z } from "zod";

const envSchema = z.object({
  // Supabase (required)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),

  // Rebrickable (required for catalog)
  REBRICKABLE_API_KEY: z.string().min(1),

  // BrickLink (required for pricing)
  BRICKLINK_CONSUMER_KEY: z.string().optional().default(""),
  BRICKLINK_CONSUMER_SECRET: z.string().optional().default(""),
  BRICKLINK_TOKEN: z.string().optional().default(""),
  BRICKLINK_TOKEN_SECRET: z.string().optional().default(""),

  // Optional
  BRICKECONOMY_API_KEY: z.string().optional().default(""),
  BRICKOWL_API_KEY: z.string().optional().default(""),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Missing or invalid environment variables:\n${formatted}`);
  }

  return result.data;
}
