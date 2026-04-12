import nodemailer from 'nodemailer'
import dns from 'dns'
import { promisify } from 'util'

const resolve4 = promisify(dns.resolve4)

// Manually resolve smtp.gmail.com to an IPv4 address.
// Railway's network ignores nodemailer's `family: 4` hint and still picks
// the AAAA record, causing ENETUNREACH. Passing the raw IPv4 IP as `host`
// bypasses DNS entirely — `tls.servername` keeps the TLS cert valid.
async function resolveGmailIPv4() {
  try {
    const addrs = await resolve4('smtp.gmail.com')
    return addrs[0] // e.g. "74.125.x.x"
  } catch {
    return 'smtp.gmail.com' // fallback — let it try anyway
  }
}

async function createTransporter() {
  const host = await resolveGmailIPv4()
  return nodemailer.createTransport({
    host,
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      servername: 'smtp.gmail.com', // required for TLS cert check when host is an IP
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
    pool: false,
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
  })
}

function resetTransporter() { /* no-op */ }

// ─── Input sanitisation helpers ─────────────────────────────────────────────
const stripHtml = (str) => String(str).replace(/<[^>]*>/g, '').trim()
const clamp = (str, max) => stripHtml(str).slice(0, max)

// ─── Email format validation ─────────────────────────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Route handler ───────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    // Validate env configuration first
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('SMTP env vars not set')
      return Response.json(
        { error: 'Server mail configuration is missing.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { name, email, subject, message } = body ?? {}

    // Required field check
    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Sanitize & clamp lengths
    const safeName    = clamp(name,    100)
    const safeEmail   = clamp(email,   200)
    const safeSubject = clamp(subject, 200)
    const safeMessage = clamp(message, 2000)

    // Validate email format
    if (!emailRegex.test(safeEmail)) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const recipient = process.env.CONTACT_RECIPIENT || process.env.GMAIL_USER

    const mailOptions = {
      // Envelope
      from:    `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      replyTo: `"${safeName}" <${safeEmail}>`,
      to:      recipient,

      // Content
      subject: `[Portfolio] ${safeSubject}`,

      // Plain-text fallback
      text: [
        `Name:    ${safeName}`,
        `Email:   ${safeEmail}`,
        `Subject: ${safeSubject}`,
        '',
        'Message:',
        safeMessage,
        '',
        '---',
        'Sent via papykabukanyi portfolio contact form',
      ].join('\n'),

      // HTML version
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050508;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050508;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#0d0d1a;border-radius:12px;border:1px solid rgba(0,212,255,0.2);overflow:hidden;max-width:100%">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#00d4ff20,#7c3aed20);padding:24px 28px;border-bottom:1px solid rgba(0,212,255,0.15)">
            <h1 style="margin:0;font-size:20px;font-weight:800;color:#00d4ff">📩 New Portfolio Message</h1>
            <p style="margin:4px 0 0;font-size:13px;color:#64748b">Sent via papykabukanyi.dev contact form</p>
          </td>
        </tr>

        <!-- Fields -->
        <tr>
          <td style="padding:24px 28px">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
              <tr>
                <td style="padding:8px 0;vertical-align:top;width:90px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.05em">Name</td>
                <td style="padding:8px 0;color:#e2e8f0;font-size:15px;font-weight:600">${safeName}</td>
              </tr>
              <tr><td colspan="2" style="border-bottom:1px solid rgba(255,255,255,0.05)"></td></tr>
              <tr>
                <td style="padding:8px 0;vertical-align:top;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.05em">Email</td>
                <td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#00d4ff;font-size:15px;text-decoration:none">${safeEmail}</a></td>
              </tr>
              <tr><td colspan="2" style="border-bottom:1px solid rgba(255,255,255,0.05)"></td></tr>
              <tr>
                <td style="padding:8px 0;vertical-align:top;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.05em">Subject</td>
                <td style="padding:8px 0;color:#e2e8f0;font-size:15px">${safeSubject}</td>
              </tr>
            </table>

            <!-- Message body -->
            <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.08em">Message</p>
            <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:16px;color:#cbd5e1;font-size:15px;line-height:1.7;white-space:pre-wrap;border:1px solid rgba(255,255,255,0.06)">${safeMessage}</div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.05);text-align:center">
            <p style="margin:0;font-size:12px;color:#334155">Reply directly to this email to respond to ${safeName}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
      `.trim(),
    }

    const transporter = await createTransporter()
    const info = await transporter.sendMail(mailOptions)

    console.log('Mail sent — messageId:', info.messageId)

    return Response.json({ success: true, messageId: info.messageId })
  } catch (err) {
    // Reset singleton so next request gets a fresh connection
    resetTransporter()

    // Log full error server-side; return generic message to client
    console.error('SMTP error:', {
      message:  err.message,
      code:     err.code,
      command:  err.command,
      response: err.response,
    })

    // Surface a helpful message for common SMTP errors
    let userMessage = 'Failed to send message. Please try again later.'
    if (err.code === 'ESOCKET' || err.code === 'ECONNECTION' || err.code === 'ENETUNREACH' || err.code === 'ETIMEDOUT') {
      userMessage = 'Could not reach the mail server. Please try again in a moment.'
    } else if (err.responseCode === 535) {
      userMessage = 'Mail authentication error. Please contact me directly.'
    } else if (err.responseCode === 421 || err.responseCode === 450) {
      userMessage = 'Mail server is temporarily unavailable. Please try again shortly.'
    }

    return Response.json({ error: userMessage }, { status: 500 })
  }
}
