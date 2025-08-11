'use client'

import { useState } from 'react'

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted, onEditTask }) {
  const [loading, setLoading] = useState(false)

  const handleToggleComplete = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !task.completed
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        onTaskUpdated(result.task)
      } else {
        console.error('Failed to update task:', result.message)
      }
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (response.ok && result.success) {
        onTaskDeleted(task.id)
      } else {
        console.error('Failed to delete task:', result.message)
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    onEditTask(task)
  }

  return (
    <div className="p-6 hover:bg-gray-50 transition duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            disabled={loading}
            className="flex-shrink-0"
          >
            {task.completed ? (
              <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            ) : (
              <div className="h-6 w-6 border-2 border-gray-400 rounded-full hover:border-green-600" />
            )}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium ${
              task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 text-sm ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-blue-600 transition duration-200"
            title="Edit task"
            disabled={loading}
          >
            <span className="text-lg">✏️</span>
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-600 transition duration-200"
            title="Delete task"
          >
            <span className="text-lg">🗑️</span>
          </button>
        </div>
      </div>
    </div>
  )
}