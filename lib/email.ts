interface VerificationEmailParams {
  toName: string
  toEmail: string
  verificationUrl: string
}

interface ResetPasswordEmailParams {
  toName: string
  toEmail: string
  resetUrl: string
}

async function sendEmailJS(templateId: string, templateParams: Record<string, string>): Promise<void> {
  const serviceId = process.env.MAIL_SERVICE_ID
  const publicKey = process.env.MAIL_PUBLIC_KEY
  const privateKey = process.env.MAIL_PRIVATE_KEY

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.error('[email] Missing MAIL_* env vars', { serviceId: !!serviceId, templateId: !!templateId, publicKey: !!publicKey, privateKey: !!privateKey })
    throw new Error('[email] Missing required MAIL_* environment variables')
  }

  const body = JSON.stringify({
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: privateKey,
    template_params: templateParams,
  })

  console.log('[email] Sending via EmailJS REST API to template:', templateId)

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  const text = await response.text()
  console.log('[email] EmailJS response:', response.status, text)

  if (!response.ok) {
    throw new Error(`[email] EmailJS API error ${response.status}: ${text}`)
  }
}

export async function sendVerificationEmail({
  toName,
  toEmail,
  verificationUrl,
}: VerificationEmailParams): Promise<void> {
  const templateId = process.env.MAIL_TEMPLATE_ID
  if (!templateId) throw new Error('[email] Missing MAIL_TEMPLATE_ID')

  await sendEmailJS(templateId, {
    to_name: toName,
    to_email: toEmail,
    email: toEmail,
    user_email: toEmail,
    verification_url: verificationUrl,
    company_name: process.env.MAIL_COMPANY_NAME ?? 'LLM Chat',
    company_email: process.env.MAIL_COMPANY_EMAIL ?? '',
  })
}

export async function sendResetPasswordEmail({
  toName,
  toEmail,
  resetUrl,
}: ResetPasswordEmailParams): Promise<void> {
  const templateId = process.env.MAIL_RESET_TEMPLATE_ID
  if (!templateId) throw new Error('[email] Missing MAIL_RESET_TEMPLATE_ID')

  await sendEmailJS(templateId, {
    to_name: toName,
    to_email: toEmail,
    email: toEmail,
    user_email: toEmail,
    reset_url: resetUrl,
    company_name: process.env.MAIL_COMPANY_NAME ?? 'LLM Chat',
    company_email: process.env.MAIL_COMPANY_EMAIL ?? '',
  })
}
