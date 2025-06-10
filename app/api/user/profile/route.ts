import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { fullname, phone } = await request.json();
    
    if (!fullname) {
      return NextResponse.json(
        { message: 'Full name is required' },
        { status: 400 }
      );
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullname,
        phone: phone || null,
      },
    });
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 