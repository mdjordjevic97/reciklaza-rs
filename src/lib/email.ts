import nodemailer from 'nodemailer'

const port = parseInt(process.env.SMTP_PORT || '587')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM = process.env.SMTP_FROM || 'Reciklaža.rs <noreply@reciklaza.rs>'

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendVerificationEmail(email: string, code: string) {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Verifikacija email adrese — Reciklaža.rs',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">Reciklaža.rs</h2>
        <p>Vaš verifikacioni kod je:</p>
        <div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #15803d;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Kod važi 15 minuta. Ako niste vi zatražili registraciju, ignorišite ovaj email.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, code: string) {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Resetovanje lozinke — Reciklaža.rs',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">Reciklaža.rs</h2>
        <p>Zatražili ste resetovanje lozinke. Vaš kod je:</p>
        <div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #15803d;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Kod važi 15 minuta. Ako niste vi zatražili resetovanje, ignorišite ovaj email.</p>
      </div>
    `,
  })
}

export async function sendApprovalEmail(email: string, companyName: string) {
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Vaš nalog je odobren — Reciklaža.rs',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">Reciklaža.rs</h2>
        <p>Poštovani,</p>
        <p>Vaš nalog za firmu <strong>${companyName}</strong> je pregledan i odobren od strane administratora.</p>
        <p>Sada možete da se prijavite na platformu i počnete da koristite sve funkcionalnosti.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.AUTH_URL || 'http://localhost:3000'}/prijava" style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Prijavite se</a>
        </div>
      </div>
    `,
  })
}
