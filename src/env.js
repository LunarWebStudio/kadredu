import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.string().url(),

    MAIN_ADMIN_EMAIL: z.string().email(),

    EMAIL_SERVER: z.string().url(),
    EMAIL_FROM: z.string(),

    S3_REGION: z
      .string()
      .default(
        process.env.NODE_ENV === "production" ? "ru-central1" : "us-east-1",
      ),
    S3_ENDPOINT: z
      .string()
      .url()
      .default(
        process.env.NODE_ENV === "production"
          ? "https://storage.yandexcloud.net"
          : "http://localhost:9000",
      ),
    S3_BUCKET: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),

    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
  },

  client: {},

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    MAIN_ADMIN_EMAIL: process.env.MAIN_ADMIN_EMAIL,

    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,

    S3_BUCKET: process.env.S3_BUCKET,
    S3_REGION: process.env.S3_REGION,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
