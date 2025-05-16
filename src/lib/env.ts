import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_PROD_URL: z.string(),
  NEXT_PUBLIC_DEV_URL: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_REGISTER: z.string(),
  NEXT_PUBLIC_YEARLY_PLAN: z.string(),
  NEXT_PUBLIC_MONTHLY_PLAN: z.string(),
  NEXT_PUBLIC_GOOGLE_METRIC_ID: z.string(),
})

const variables = {
  NEXT_PUBLIC_PROD_URL: process.env.NEXT_PUBLIC_PROD_URL,
  NEXT_PUBLIC_DEV_URL: process.env.NEXT_PUBLIC_DEV_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_REGISTER: process.env.NEXT_PUBLIC_REGISTER,
  NEXT_PUBLIC_YEARLY_PLAN: process.env.NEXT_PUBLIC_YEARLY_PLAN,
  NEXT_PUBLIC_MONTHLY_PLAN: process.env.NEXT_PUBLIC_MONTHLY_PLAN,
  NEXT_PUBLIC_GOOGLE_METRIC_ID: process.env.NEXT_PUBLIC_GOOGLE_METRIC_ID,
}

const _env = envSchema.safeParse(variables)

if (_env.success === false) {
  throw new Error('Invalid environment variables')
}

export const env = _env.data
