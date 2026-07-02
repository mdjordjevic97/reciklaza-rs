import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

function getFrom() {
  return process.env.RESEND_FROM || 'Reciklaza.rs <noreply@reciklaza.rs>'
}

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function sendVerificationEmail(email: string, code: string) {
  await getResend().emails.send({
    from: getFrom(),
    to: email,
    subject: 'Verifikacija email adrese — Reciklaza.rs',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">Reciklaza.rs</h2>
        <p>Vas verifikacioni kod je:</p>
        <div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #15803d;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Kod vazi 15 minuta. Ako niste vi zatrazili registraciju, ignorisojte ovaj email.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, code: string) {
  await getResend().emails.send({
    from: getFrom(),
    to: email,
    subject: 'Resetovanje lozinke — Reciklaza.rs',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">Reciklaza.rs</h2>
        <p>Zatrazili ste resetovanje lozinke. Vas kod je:</p>
        <div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #15803d;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Kod vazi 15 minuta. Ako niste vi zatrazili resetovanje, ignorisojte ovaj email.</p>
      </div>
    `,
  })
}

export async function sendApprovalEmail(email: string, companyName: string) {
  await getResend().emails.send({
    from: getFrom(),
    to: email,
    subject: 'Vas nalog je odobren — Reciklaza.rs',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">Reciklaza.rs</h2>
        <p>Postovani,</p>
        <p>Vas nalog za firmu <strong>${companyName}</strong> je pregledan i odobren od strane administratora.</p>
        <p>Sada mozete da se prijavite na platformu i pocnete da koristite sve funkcionalnosti.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.AUTH_URL || 'http://localhost:3000'}/prijava" style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Prijavite se</a>
        </div>
      </div>
    `,
  })
}
