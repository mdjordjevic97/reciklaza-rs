export function formatPrice(price: number | null, currency = 'RSD'): string {
  if (price === null) return 'Po dogovoru'
  return new Intl.NumberFormat('sr-RS', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Upravo'
  if (diffMin < 60) return `Pre ${diffMin} min`
  if (diffHours < 24) return `Pre ${diffHours}h`
  if (diffDays < 30) return `Pre ${diffDays} dana`
  return formatDate(date)
}

export function formatQuantity(quantity: number, unit: string): string {
  const unitLabels: Record<string, string> = {
    kg: 'kg',
    tona: 't',
    m3: 'm³',
    komad: 'kom',
    litar: 'L',
  }
  return `${new Intl.NumberFormat('sr-RS').format(quantity)} ${unitLabels[unit] || unit}`
}
