'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function AddTaskModal({ isOpen, onClose, onTaskAdded }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset()
      setError('')
    }
  }, [isOpen, reset])

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('Authentication required')
        setLoading(false)
        return
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description || ''
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        onTaskAdded(result.task)
        reset()
        onClose()
      } else {
        setError(result.message || 'Failed to create task')
      }
    } catch (error) {
      console.error('Create task error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setError('')
    onClose()
  }

  // Don't render anything if modal is not open
  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Add New Task
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              type="button"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter task title"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  {...register('title', {
                    required: 'Title is required',
                    maxLength: {
                      value: 100,
                      message: 'Title must be less than 100 characters'
                    }
                  })}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Enter task description (optional)"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  {...register('description', {
                    maxLength: {
                      value: 500,
                      message: 'Description must be less than 500 characters'
                    }
                  })}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}