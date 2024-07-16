import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },

  client: {
    NEXT_PUBLIC_SEQUENCE_ACCESS_KEY: z.string(),
    NEXT_PUBLIC_SEQUENCE_PROJECT_ID: z.string(),
    NEXT_PUBLIC_ENV: z.enum(['dev', 'next', 'production']),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SEQUENCE_ACCESS_KEY:
      process.env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY,
    NEXT_PUBLIC_SEQUENCE_PROJECT_ID:
      process.env.NEXT_PUBLIC_SEQUENCE_PROJECT_ID,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  },
  emptyStringAsUndefined: true,
});
