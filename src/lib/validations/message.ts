import { z } from 'zod'

export const messageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1, 'Poruka ne može biti prazna').max(2000),
})

export type MessageInput = z.infer<typeof messageSchema>
