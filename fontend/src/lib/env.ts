// src/lib/env.ts
const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  // Add other env variables here
} as const

for (const [key, value] of Object.entries(env)) {
  if (!value) throw new Error(`Missing env: ${key}`)
}

export default env as Record<keyof typeof env, string>