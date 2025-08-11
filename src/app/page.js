import Link from 'next/link'
import { ArrowRightIcon, CheckCircleIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TaskManager</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link 
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Organize Your Tasks
            <span className="block text-blue-600">Get Things Done</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A simple and powerful task management application to help you stay organized, 
            track your progress, and boost your productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-200 flex items-center group"
            >
              Go to Dashboard
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/auth/register"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-200"
            >
              Get Started Free
            </Link>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Task Management</h3>
              <p className="text-gray-600">
                Create, edit, and organize your tasks with a simple and intuitive interface.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600">
                Mark tasks as complete and track your productivity over time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal & Secure</h3>
              <p className="text-gray-600">
                Your tasks are private and secure with user authentication and data protection.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Organized?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of users who have improved their productivity with TaskManager.
            </p>
            <Link 
              href="/auth/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-200 inline-flex items-center"
            >
              Start Managing Tasks Today
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">TaskManager</span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2025 TaskManager. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}