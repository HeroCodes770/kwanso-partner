import { describe, expect, it } from 'vitest'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  partner_name: z.string().min(2),
})

describe('partner signup schema', () => {
  it('accepts valid payload', () => {
    const result = signupSchema.safeParse({
      email: 'partner@example.com',
      password: 'password1',
      first_name: 'Ama',
      last_name: 'Mensah',
      partner_name: 'Kwanso Fleet Ltd',
    })
    expect(result.success).toBe(true)
  })

  it('rejects short password', () => {
    const result = signupSchema.safeParse({
      email: 'partner@example.com',
      password: 'short',
      first_name: 'Ama',
      last_name: 'Mensah',
      partner_name: 'Kwanso Fleet Ltd',
    })
    expect(result.success).toBe(false)
  })
})
