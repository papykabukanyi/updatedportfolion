import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Basic server-side validation
    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Sanitize inputs — strip any HTML to prevent injection
    const safe = (str) => String(str).replace(/<[^>]*>/g, '').trim().slice(0, 2000)
    const safeName = safe(name).slice(0, 100)
    const safeEmail = safe(email).slice(0, 200)
    const safeSubject = safe(subject).slice(0, 200)
    const safeMessage = safe(message)

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(safeEmail)) {
      return Response.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      replyTo: `"${safeName}" <${safeEmail}>`,
      to: process.env.GMAIL_USER,
      subject: `[Portfolio] ${safeSubject}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${safeMessage}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0d0d1a;color:#e2e8f0;border-radius:12px;border:1px solid rgba(0,212,255,0.15)">
          <h2 style="margin:0 0 16px;color:#00d4ff;font-size:20px">New message from your portfolio</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr><td style="padding:6px 0;color:#94a3b8;width:80px">Name</td><td style="padding:6px 0;font-weight:600">${safeName}</td></tr>
            <tr><td style="padding:6px 0;color:#94a3b8">Email</td><td style="padding:6px 0"><a href="mailto:${safeEmail}" style="color:#00d4ff">${safeEmail}</a></td></tr>
            <tr><td style="padding:6px 0;color:#94a3b8">Subject</td><td style="padding:6px 0">${safeSubject}</td></tr>
          </table>
          <div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:16px;white-space:pre-wrap;line-height:1.6">${safeMessage}</div>
          <p style="margin:20px 0 0;font-size:12px;color:#475569">Sent via papykabukanyi.dev portfolio</p>
        </div>
      `,
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return Response.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
