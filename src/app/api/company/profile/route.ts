import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Company from '@/models/Company';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const company = await Company.findOne({ email: session.user?.email }).select('-password');
  
  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  return NextResponse.json(company);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();

    const allowedUpdates = ['name', 'industry', 'logo', 'description', 'website', 'location'];
    const filteredData: any = {};
    
    allowedUpdates.forEach(key => {
      if (data[key] !== undefined) {
        filteredData[key] = data[key];
      }
    });

    const updatedCompany = await Company.findOneAndUpdate(
      { email: session.user?.email },
      { $set: filteredData },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
