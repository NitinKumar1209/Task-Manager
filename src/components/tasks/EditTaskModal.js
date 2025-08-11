'use client'

import { useState, useEffect } from 'react'

export default function EditTaskModal({ isOpen, onClose, onTaskUpdated, task }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Populate form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setError('')
    }
  }, [task])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('Authentication required')
        setLoading(false)
        return
      }

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim()
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        onTaskUpdated(result.task)
        onClose()
      } else {
        setError(result.message || 'Failed to update task')
      }
    } catch (error) {
      console.error('Update task error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setError('')
    onClose()
  }

  if (!isOpen || !task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description (optional)"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}