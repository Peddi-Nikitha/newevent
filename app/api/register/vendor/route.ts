import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      email, 
      phone, 
      password, 
      businessName, 
      category, 
      location, 
      description, 
      minPrice, 
      maxPrice 
    } = body;

    // Validation
    if (!fullName || !email || !password || !businessName || !category || !location || !description) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user with vendor profile
    const newUser = await prisma.user.create({
      data: {
        fullname: fullName,
        email,
        phone,
        passwordhash: passwordHash,
        role: 'VENDOR',
        Vendor: {
          create: {
            businessname: businessName,
            category,
            location,
            description,
            minprice: minPrice,
            maxprice: maxPrice,
            rating: 0,
            profileimg: '',
          },
        },
      },
      include: {
        Vendor: true,
      },
    });

    // Don't send the password hash back
    const { passwordhash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: 'Vendor registered successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Vendor registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 