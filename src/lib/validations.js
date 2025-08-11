export function validateRegisterInput(email, password, confirmPassword) {
  const errors = []

  // Email validation
  if (!email) {
    errors.push('Email is required')
  } else if (!validateEmail(email)) {
    errors.push('Please enter a valid email address')
  }

  // Password validation
  if (!password) {
    errors.push('Password is required')
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }

  // Confirm password validation
  if (confirmPassword !== undefined) {
    if (!confirmPassword) {
      errors.push('Please confirm your password')
    } else if (password !== confirmPassword) {
      errors.push('Passwords do not match')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateLoginInput(email, password) {
  const errors = []

  if (!email) {
    errors.push('Email is required')
  } else if (!validateEmail(email)) {
    errors.push('Please enter a valid email address')
  }

  if (!password) {
    errors.push('Password is required')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}