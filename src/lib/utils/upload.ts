const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_PERMIT_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_PERMIT_SIZE = 10 * 1024 * 1024
export const MAX_IMAGES_PER_LISTING = 8

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Dozvoljeni formati: JPG, PNG, WebP' }
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'Maksimalna veličina slike je 5MB' }
  }
  return { valid: true }
}

export function validatePermitFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_PERMIT_TYPES.includes(file.type)) {
    return { valid: false, error: 'Dozvoljeni formati: JPG, PNG, WebP, PDF' }
  }
  if (file.size > MAX_PERMIT_SIZE) {
    return { valid: false, error: 'Maksimalna veličina fajla je 10MB' }
  }
  return { valid: true }
}
