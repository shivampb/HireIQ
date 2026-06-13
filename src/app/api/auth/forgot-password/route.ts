import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const company = await Company.findOne({ email });

    if (!company) {
      // Don't reveal if user exists or not
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    company.resetToken = token;
    company.resetTokenExpiry = expiry;
    await company.save();

    console.log('--- DEBUG: TOKEN SAVED ---');
    console.log('Email:', email);
    console.log('Token:', token);
    console.log('Expiry:', expiry);
    
    // Quick verify
    const verify = await Company.findOne({ resetToken: token });
    console.log('Immediate DB Verify:', verify ? 'FOUND' : 'NOT FOUND');

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    // Send actual email
    const { sendEmail } = await import('@/lib/email');
    await sendEmail({
      to: email,
      subject: 'Reset your HireIQ password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 12px;">
          <h2 style="color: #4f46e5;">Reset your password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for your HireIQ account. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">HireIQ - AI-Powered Technical Assessments</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
