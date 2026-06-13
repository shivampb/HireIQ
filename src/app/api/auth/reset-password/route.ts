import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    await dbConnect();

    console.log('--- DEBUG: PASSWORD RESET ATTEMPT ---');
    console.log('Received Token:', token);

    const company = await Company.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!company) {
      console.log('❌ Token not found or expired in DB');
      // Let's check if it exists but is expired
      const expiredCheck = await Company.findOne({ resetToken: token });
      if (expiredCheck) {
        console.log('⚠️ Token exists but is EXPIRED. Expiry was:', expiredCheck.resetTokenExpiry);
      } else {
        console.log('⚠️ Token DOES NOT EXIST at all in the database.');
      }
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 });
    }

    console.log('✅ Token verified for company:', company.email);

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    company.password = hashedPassword;
    company.resetToken = undefined;
    company.resetTokenExpiry = undefined;
    await company.save();

    return NextResponse.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
