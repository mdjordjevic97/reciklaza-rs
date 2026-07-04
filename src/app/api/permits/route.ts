import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { validatePermitFile } from '@/lib/utils/upload'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

  const permits = await prisma.permit.findMany({
    where: { userId: session.user.id },
    orderBy: { uploadedAt: 'desc' },
  })
  return NextResponse.json(permits)
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = rateLimit(`upload:${ip}`, LIMITS.upload.limit, LIMITS.upload.window)
  if (!success) return NextResponse.json({ error: 'Previše pokušaja.' }, { status: 429 })

  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

  const formData = await request.formData()
  const files = formData.getAll('permits') as File[]

  if (!files.length) return NextResponse.json({ error: 'Niste odabrali fajl.' }, { status: 400 })

  const results = []
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'permits', session.user.id)
  await mkdir(uploadDir, { recursive: true })

  for (const file of files) {
    const v = validatePermitFile(file)
    if (!v.valid) return NextResponse.json({ error: v.error }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    await writeFile(join(uploadDir, fileName), buffer)

    const permit = await prisma.permit.create({
      data: {
        userId: session.user.id,
        fileUrl: `/uploads/permits/${session.user.id}/${fileName}`,
        fileName: file.name,
        permitType: 'collection',
      },
    })
    results.push(permit)
  }

  return NextResponse.json(results, { status: 201 })
}
