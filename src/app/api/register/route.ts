import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { sanitizeText } from '@/lib/utils/sanitize'
import { generateCode, sendVerificationEmail } from '@/lib/email'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = rateLimit(`auth:${ip}`, LIMITS.auth.limit, LIMITS.auth.window)
    if (!success) {
      return NextResponse.json({ error: 'Previše pokušaja. Sačekajte minut.' }, { status: 429 })
    }

    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const companyName = sanitizeText(formData.get('companyName') as string)
    const pib = formData.get('pib') as string
    const address = sanitizeText(formData.get('address') as string)
    const city = formData.get('city') as string
    const contactPerson = sanitizeText(formData.get('contactPerson') as string)
    const phone = formData.get('phone') as string || undefined
    const userType = formData.get('userType') as 'GENERATOR' | 'COLLECTOR'
    const permitFiles = formData.getAll('permits') as File[]

    if (!email || !password || !companyName || !pib || !address || !city || !contactPerson || !userType) {
      return NextResponse.json({ error: 'Sva obavezna polja moraju biti popunjena.' }, { status: 400 })
    }

    if (!/^\d{9}$/.test(pib)) {
      return NextResponse.json({ error: 'PIB mora imati tačno 9 cifara.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Lozinka mora imati najmanje 8 karaktera.' }, { status: 400 })
    }

    if (!['GENERATOR', 'COLLECTOR'].includes(userType)) {
      return NextResponse.json({ error: 'Nevalidan tip korisnika.' }, { status: 400 })
    }

    if (permitFiles.length === 0) {
      return NextResponse.json({ error: 'Morate dodati bar jednu dozvolu.' }, { status: 400 })
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ error: 'Email adresa je već registrovana.' }, { status: 409 })
    }

    const existingPib = await prisma.user.findUnique({ where: { pib } })
    if (existingPib) {
      return NextResponse.json({ error: 'Firma sa ovim PIB-om je već registrovana.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        companyName,
        pib,
        address,
        city,
        contactPerson,
        phone,
        userType,
        emailVerified: false,
        verified: false,
      },
    })

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'permits', user.id)
    await mkdir(uploadDir, { recursive: true })

    for (const file of permitFiles) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const filePath = join(uploadDir, fileName)
      await writeFile(filePath, buffer)

      await prisma.permit.create({
        data: {
          userId: user.id,
          fileUrl: `/uploads/permits/${user.id}/${fileName}`,
          fileName: file.name,
          permitType: 'collection',
        },
      })
    }

    const code = generateCode()
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        type: 'EMAIL_VERIFY',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    try {
      await sendVerificationEmail(email, code)
    } catch (emailError) {
      console.error('Email send error:', emailError)
    }

    await prisma.adminNotification.create({
      data: {
        type: 'NEW_USER',
        title: 'Nova registracija',
        message: `${companyName} (${userType === 'GENERATOR' ? 'Generator' : 'Sakupljač'}) iz grada ${city} se registrovao/la. PIB: ${pib}. Čeka verifikaciju.`,
        data: JSON.stringify({ userId: user.id, companyName, pib, city, userType }),
      },
    })

    return NextResponse.json({ success: true, userId: user.id, email }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Došlo je do greške pri registraciji.' }, { status: 500 })
  }
}
