import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { validateImageFile, MAX_IMAGES_PER_LISTING } from '@/lib/utils/upload'
import { uploadFileToFtp, generateFileName } from '@/lib/ftp-storage'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = rateLimit(`upload:${ip}`, LIMITS.upload.limit, LIMITS.upload.window)
    if (!success) return NextResponse.json({ error: 'Previše upload zahteva.' }, { status: 429 })

    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

    const formData = await request.formData()
    const listingId = formData.get('listingId') as string
    const files = formData.getAll('images') as File[]

    if (!listingId) return NextResponse.json({ error: 'ID oglasa je obavezan.' }, { status: 400 })
    if (files.length === 0) return NextResponse.json({ error: 'Niste dodali slike.' }, { status: 400 })

    const listing = await prisma.listing.findUnique({ where: { id: listingId } })
    if (!listing) return NextResponse.json({ error: 'Oglas nije pronađen.' }, { status: 404 })
    if (listing.userId !== session.user.id) return NextResponse.json({ error: 'Nemate dozvolu.' }, { status: 403 })

    const existingCount = await prisma.listingImage.count({ where: { listingId } })
    if (existingCount + files.length > MAX_IMAGES_PER_LISTING) {
      return NextResponse.json({ error: `Maksimalno ${MAX_IMAGES_PER_LISTING} slika po oglasu.` }, { status: 400 })
    }

    for (const file of files) {
      const validation = validateImageFile(file)
      if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const uploaded = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = generateFileName(file.name)
      const imageUrl = await uploadFileToFtp(buffer, `listings/${listingId}/${fileName}`)

      const image = await prisma.listingImage.create({
        data: {
          listingId,
          imageUrl,
          displayOrder: existingCount + i,
        },
      })
      uploaded.push(image)
    }

    return NextResponse.json({ images: uploaded }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Greška pri uploadu.' }, { status: 500 })
  }
}
