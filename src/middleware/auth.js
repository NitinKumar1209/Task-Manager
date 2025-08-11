import { verifyToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function authenticateUser(request) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No token provided', status: 401 }
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    let decoded
    try {
      decoded = verifyToken(token)
    } catch (error) {
      return { error: 'Invalid or expired token', status: 401 }
    }

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return { error: 'User not found', status: 401 }
    }

    return { user, userId: user.id }

  } catch (error) {
    console.error('Authentication error:', error)
    return { error: 'Authentication failed', status: 500 }
  }
}