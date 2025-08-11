import { prisma } from '@/lib/prisma'
import { hashPassword, comparePassword } from '@/lib/auth'
import { signToken } from '@/lib/jwt'

export class AuthService {
  static async createUser(email, password) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })

      if (existingUser) {
        throw new Error('User already exists')
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

      return user
    } catch (error) {
      throw error
    }
  }

  static async authenticateUser(email, password) {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })

      if (!user) {
        throw new Error('Invalid credentials')
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password)

      if (!isPasswordValid) {
        throw new Error('Invalid credentials')
      }

      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    } catch (error) {
      throw error
    }
  }

  static async getUserById(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return user
    } catch (error) {
      throw error
    }
  }

  static generateToken(user) {
    return signToken({
      userId: user.id,
      email: user.email
    })
  }
}