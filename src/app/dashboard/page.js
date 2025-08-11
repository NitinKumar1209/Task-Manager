'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import TaskList from '@/components/tasks/TaskList'
import AddTaskModal from '@/components/tasks/AddTaskModal'
import EditTaskModal from '@/components/tasks/EditTaskModal'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    // Decode token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        localStorage.removeItem('token')
        router.push('/auth/login')
        return
      }

      setUser({
        id: payload.userId,
        email: payload.email
      })
    } catch (error) {
      console.error('Token decode error:', error)
      localStorage.removeItem('token')
      router.push('/auth/login')
    }
  }

  const fetchTasks = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/tasks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/auth/login')
        return
      }

      if (response.ok && data.success) {
        setTasks(data.tasks || [])
      } else {
        setError(data.message || 'Failed to fetch tasks')
        console.error('Fetch tasks error:', data)
      }
    } catch (error) {
      console.error('Network error:', error)
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev])
    setIsAddModalOpen(false)
  }

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsEditModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Welcome back, {user?.email}! Manage your tasks below.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          )}

          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {tasks.length}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Tasks
                      </dt>
                                      <dd className="text-lg font-medium text-gray-900">
                        {tasks.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">
                        {tasks.filter(task => task.completed).length}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {tasks.filter(task => task.completed).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold text-sm">
                        {tasks.filter(task => !task.completed).length}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {tasks.filter(task => !task.completed).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your Tasks</h2>
            </div>
            <TaskList 
              tasks={tasks}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
              onEditTask={handleEditTask}
            />
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTaskAdded={handleTaskAdded}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTaskUpdated={handleTaskUpdated}
        task={editingTask}
      />
    </div>
  )
}
