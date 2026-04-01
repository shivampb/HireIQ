import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, industry } = await req.json();

    if (!name || !email || !password || !industry) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      industry,
    });

    return NextResponse.json(
      {
        message: 'Company registered successfully',
        company: {
          id: company._id,
          name: company.name,
          email: company.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
