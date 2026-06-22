const requests = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit: number, windowMs: number): { success: boolean } {
  const now = Date.now()
  const entry = requests.get(key)

  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true }
  }

  if (entry.count >= limit) {
    return { success: false }
  }

  entry.count++
  return { success: true }
}

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of requests) {
    if (now > entry.resetAt) requests.delete(key)
  }
}, 60000)

export const LIMITS = {
  auth: { limit: 5, window: 60000 },
  api: { limit: 30, window: 60000 },
  upload: { limit: 10, window: 60000 },
  message: { limit: 20, window: 60000 },
}
