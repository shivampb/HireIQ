import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // Check if we have credentials
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || '"HireIQ" <no-reply@hireiq.app>';

  if (!host || !user || !pass) {
    console.warn('--- EMAIL NOT CONFIGURED ---');
    console.warn(`To: ${to}`);
    console.warn(`Subject: ${subject}`);
    console.warn('Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in .env to send real emails.');
    console.warn('----------------------------');
    return { success: false, message: 'Email not configured' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
