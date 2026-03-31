import emailjs from '@emailjs/nodejs'

/**
 * Server-side email utility using EmailJS Node.js SDK.
 * Requires MAIL_* environment variables to be set.
 *
 * IMPORTANT: Non-browser API requests must be enabled in the
 * EmailJS dashboard → Account → Security.
 */

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

export async function sendResetPasswordEmail({
  toName,
  toEmail,
  resetUrl,
}: ResetPasswordEmailParams): Promise<void> {
  const serviceId = process.env.MAIL_SERVICE_ID
  const templateId = process.env.MAIL_RESET_TEMPLATE_ID
  const publicKey = process.env.MAIL_PUBLIC_KEY
  const privateKey = process.env.MAIL_PRIVATE_KEY

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.error(
      '[email] Missing MAIL_* env vars — reset password email not sent',
    )
    return
  }

  const recipientEmail = toEmail.trim()

  if (!recipientEmail) {
    throw new Error('[email] Recipient email is empty')
  }

  await emailjs.send(
    serviceId,
    templateId,
    {
      to_name: toName,
      to_email: recipientEmail,
      email: recipientEmail,
      user_email: recipientEmail,
      reset_url: resetUrl,
      company_name: process.env.MAIL_COMPANY_NAME ?? 'LLM Chat',
      company_email: process.env.MAIL_COMPANY_EMAIL ?? '',
    },
    {
      publicKey,
      privateKey,
    },
  )
}

export async function sendVerificationEmail({
  toName,
  toEmail,
  verificationUrl,
}: VerificationEmailParams): Promise<void> {
  const serviceId = process.env.MAIL_SERVICE_ID
  const templateId = process.env.MAIL_TEMPLATE_ID
  const publicKey = process.env.MAIL_PUBLIC_KEY
  const privateKey = process.env.MAIL_PRIVATE_KEY

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.error('[email] Missing MAIL_* env vars — email not sent')
    return
  }

  const recipientEmail = toEmail.trim()

  if (!recipientEmail) {
    throw new Error('[email] Recipient email is empty')
  }

  await emailjs.send(
    serviceId,
    templateId,
    {
      to_name: toName,
      to_email: recipientEmail,
      email: recipientEmail,
      user_email: recipientEmail,
      verification_url: verificationUrl,
      company_name: process.env.MAIL_COMPANY_NAME ?? 'LLM Chat',
      company_email: process.env.MAIL_COMPANY_EMAIL ?? '',
    },
    {
      publicKey,
      privateKey,
    },
  )
}
