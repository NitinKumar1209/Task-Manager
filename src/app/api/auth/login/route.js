import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, validateEmail } from '@/lib/auth'
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

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email
    })

    // Update last login (optional)
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    })

    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Login error:', error)
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}