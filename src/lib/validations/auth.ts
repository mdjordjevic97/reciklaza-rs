import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Unesite validnu email adresu'),
  password: z.string().min(8, 'Lozinka mora imati najmanje 8 karaktera'),
})

export const registerSchema = z.object({
  email: z.string().email('Unesite validnu email adresu'),
  password: z.string().min(8, 'Lozinka mora imati najmanje 8 karaktera'),
  companyName: z.string().min(2, 'Naziv firme je obavezan').max(200),
  pib: z.string().regex(/^\d{9}$/, 'PIB mora imati tačno 9 cifara'),
  address: z.string().min(5, 'Adresa je obavezna').max(200),
  city: z.string().min(2, 'Grad je obavezan').max(100),
  contactPerson: z.string().min(2, 'Ime kontakt osobe je obavezno').max(100),
  phone: z.string().optional(),
  userType: z.enum(['GENERATOR', 'COLLECTOR'], { message: 'Izaberite tip korisnika' }),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
