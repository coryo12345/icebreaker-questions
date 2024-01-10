import type { Config } from 'drizzle-kit';

export default {
  schema: './src/server/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
} satisfies Config;
