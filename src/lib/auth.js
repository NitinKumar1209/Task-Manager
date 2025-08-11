import bcrypt from 'bcryptjs'

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password) {
  return password && password.length >= 6
}