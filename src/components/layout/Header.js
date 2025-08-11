'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Header({ user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">TaskManager</span>
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <UserCircleIcon className="h-8 w-8" />
              <span className="hidden md:block text-sm font-medium">
                {user?.email}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <p className="font-medium">Signed in as</p>
                  <p className="text-gray-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </header>
  )
}