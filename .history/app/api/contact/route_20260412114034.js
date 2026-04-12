import nodemailer from 'nodemailer'

/**
 * Gmail SMTP transporter — full configuration.
 *
 * Gmail requires an App Password (not your account password).
 * Generate one at: https://myaccount.google.com/apppasswords
 *
 * Transport uses SMTPS (port 465, implicit TLS) with:
 *   - Connection pooling (up to 5 simultaneous connections)
 *   - Explicit TLS options for maximum compatibility
 *   - 10 s socket timeout
 *   - Auth method: LOGIN (Gmail App Password requirement)
 */
function createTransporter() {
  return nodemailer.createTransport({
    // ─── Server ──────────────────────────────────────────────────
    host: 'smtp.gmail.com',
    port: 465,          // SMTPS — implicit TLS (most reliable for Gmail)
    secure: true,       // true = TLS from the start (required for port 465)

    // ─── CRITICAL: force IPv4 ─────────────────────────────────────
    // Railway (and many PaaS providers) block outbound IPv6.
    // Without this, Node resolves smtp.gmail.com to an IPv6 address
    // (e.g. 2607:f8b0:4023:c03::6d) causing ENETUNREACH / ESOCKET.
    family: 4,

    // ─── Auth ─────────────────────────────────────────────────────
    auth: {
      type: 'login',    // Gmail App Passwords use plain LOGIN auth
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },

    // ─── TLS options ──────────────────────────────────────────────
    tls: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,   // verify Gmail's TLS certificate
    },

    // ─── Connection pool ──────────────────────────────────────────
    pool: true,           // reuse connections across multiple sends
    maxConnections: 3,    // keep low to stay within Railway limits
    maxMessages: 50,      // max messages per connection before cycling

    // ─── Timeouts ─────────────────────────────────────────────────
    connectionTimeout: 15000,   // 15 s to establish TCP connection
    greetingTimeout: 15000,     // 15 s to receive SMTP greeting
    socketTimeout: 15000,       // 15 s of inactivity before timeout

    // ─── Debug (disable in production) ────────────────────────────
    logger: process.env.NODE_ENV !== 'production',
    debug: false,
  })
}

// Singleton transporter — reset on failure so next request gets a fresh one
let _transporter = null
function getTransporter() {
  if (!_transporter) _transporter = createTransporter()
  return _transporter
}
function resetTransporter() {
  if (_transporter) {
    try { _transporter.close() } catch {} // eslint-disable-line no-empty
  }
  _transporter = null
}

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

    const transporter = getTransporter()
    const info = await transporter.sendMail(mailOptions)

    console.log('Mail sent — messageId:', info.messageId)

    return Response.json({ success: true, messageId: info.messageId })
  } catch (err) {
    // Log full error server-side; return generic message to client
    console.error('SMTP error:', {
      message: err.message,
      code:    err.code,
      command: err.command,
      response: err.response,
    })

    // Surface a helpful message for common SMTP errors
    let userMessage = 'Failed to send message. Please try again later.'
    if (err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT') {
      userMessage = 'Could not reach the mail server. Please try again.'
    } else if (err.responseCode === 535) {
      userMessage = 'Mail authentication error. Please contact me directly.'
    } else if (err.responseCode === 421 || err.responseCode === 450) {
      userMessage = 'Mail server is temporarily unavailable. Please try again shortly.'
    }

    return Response.json({ error: userMessage }, { status: 500 })
  }
}
