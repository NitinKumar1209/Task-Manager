import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validateEmail, validatePassword } from '@/lib/auth'
import { signToken } from '@/lib/jwt'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      }
    })

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}