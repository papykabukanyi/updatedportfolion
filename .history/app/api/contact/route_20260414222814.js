// Contact form API - uses Resend HTTPS API (no SMTP, works on Railway)
import { query } from '@/lib/db'

const stripHtml = (str) => String(str).replace(/<[^>]*>/g, '').trim()
const clamp = (str, max) => stripHtml(str).slice(0, max)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY
  const recipient = process.env.CONTACT_RECIPIENT || 'papykabukanyi@gmail.com'

  if (!apiKey) {
    console.error('RESEND_API_KEY env var is not set')
    return Response.json({ error: 'Server mail configuration is missing.' }, { status: 503 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, subject, message } = body ?? {}

  if (!name || !email || !subject || !message) {
    return Response.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const safeName    = clamp(name,    100)
  const safeEmail   = clamp(email,   200)
  const safeSubject = clamp(subject, 200)
  const safeMessage = clamp(message, 2000)

  if (!emailRegex.test(safeEmail)) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const html =
    '<!DOCTYPE html>' +
    '<html lang="en"><head><meta charset="UTF-8"></head>' +
    '<body style="margin:0;padding:0;background:#050508;font-family:Arial,sans-serif">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background:#050508;padding:32px 16px">' +
    '<tr><td align="center">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="background:#0d0d1a;border-radius:12px;border:1px solid rgba(0,212,255,0.2);overflow:hidden;max-width:100%">' +
    '<tr><td style="background:linear-gradient(135deg,#00d4ff20,#7c3aed20);padding:24px 28px;border-bottom:1px solid rgba(0,212,255,0.15)">' +
    '<h1 style="margin:0;font-size:20px;font-weight:800;color:#00d4ff">New Portfolio Message</h1>' +
    '<p style="margin:4px 0 0;font-size:13px;color:#64748b">Sent via your portfolio contact form</p>' +
    '</td></tr>' +
    '<tr><td style="padding:24px 28px">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">' +
    '<tr><td style="padding:8px 0;width:90px;color:#64748b;font-size:13px;text-transform:uppercase">Name</td>' +
    '<td style="padding:8px 0;color:#e2e8f0;font-size:15px;font-weight:600">' + safeName + '</td></tr>' +
    '<tr><td colspan="2" style="border-bottom:1px solid rgba(255,255,255,0.05)"></td></tr>' +
    '<tr><td style="padding:8px 0;color:#64748b;font-size:13px;text-transform:uppercase">Email</td>' +
    '<td style="padding:8px 0"><a href="mailto:' + safeEmail + '" style="color:#00d4ff;font-size:15px;text-decoration:none">' + safeEmail + '</a></td></tr>' +
    '<tr><td colspan="2" style="border-bottom:1px solid rgba(255,255,255,0.05)"></td></tr>' +
    '<tr><td style="padding:8px 0;color:#64748b;font-size:13px;text-transform:uppercase">Subject</td>' +
    '<td style="padding:8px 0;color:#e2e8f0;font-size:15px">' + safeSubject + '</td></tr>' +
    '</table>' +
    '<p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase">Message</p>' +
    '<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:16px;color:#cbd5e1;font-size:15px;line-height:1.7;white-space:pre-wrap;border:1px solid rgba(255,255,255,0.06)">' + safeMessage + '</div>' +
    '</td></tr>' +
    '<tr><td style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.05);text-align:center">' +
    '<p style="margin:0;font-size:12px;color:#334155">Reply directly to this email to respond to ' + safeName + '</p>' +
    '</td></tr>' +
    '</table></td></tr></table></body></html>'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [recipient],
      reply_to: safeName + ' <' + safeEmail + '>',
      subject: '[Portfolio] ' + safeSubject,
      html,
      text: 'Name: ' + safeName + '\nEmail: ' + safeEmail + '\nSubject: ' + safeSubject + '\n\n' + safeMessage,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('Resend error:', data)
    return Response.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }

  console.log('Email sent:', data.id)
  return Response.json({ success: true, id: data.id })
}
