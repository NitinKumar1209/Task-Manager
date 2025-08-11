import { NextResponse } from 'next/server'
import { authenticateUser } from '@/middleware/auth'

export async function GET(request) {
  try {
    const authResult = await authenticateUser(request)

    if (authResult.error) {
      return NextResponse.json(
        { 
          success: false,
          message: authResult.error 
        },
        { status: authResult.status }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Token is valid',
        user: authResult.user
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Token verification failed' 
      },
      { status: 500 }
    )
  }
}