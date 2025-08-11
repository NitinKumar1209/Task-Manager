import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center mb-6">
          <CheckCircleIcon className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">TaskManager</span>
        </Link>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link 
            href="/auth/register" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      {/* Login Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <Link 
          href="/" 
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}