import { z } from 'zod'

export const listingSchema = z.object({
  title: z.string().min(5, 'Naslov mora imati najmanje 5 karaktera').max(100).trim(),
  description: z.string().min(20, 'Opis mora imati najmanje 20 karaktera').max(2000).trim(),
  wasteIndexNumber: z.string().min(1, 'Indeksni broj otpada je obavezan'),
  wasteCategory: z.string().min(1, 'Kategorija otpada je obavezna'),
  wasteSubcategory: z.string().nullable().optional(),
  isHazardous: z.boolean(),
  quantity: z.number().positive('Količina mora biti pozitivan broj'),
  unit: z.enum(['kg', 'tona', 'm3', 'komad', 'litar']),
  pricePerUnit: z.number().positive().nullable(),
  municipality: z.string().min(1, 'Opština je obavezna'),
  address: z.string().optional(),
})

export type ListingInput = z.infer<typeof listingSchema>
