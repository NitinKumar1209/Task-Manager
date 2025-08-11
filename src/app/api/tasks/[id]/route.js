import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/middleware/auth'

// PUT /api/tasks/[id] - Update task
export async function PUT(request, { params }) {
  try {
    // Await params before accessing properties
    const { id: taskId } = await params
    
    // Authenticate user
    const authResult = await authenticateUser(request)
    
    if (authResult.error) {
      return NextResponse.json(
        { 
          success: false,
          message: authResult.error 
        },
        { status: authResult.status }
      )
    }

    const body = await request.json()
    const { title, description, completed } = body

    // Validate task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: authResult.userId
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Task not found' 
        },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData = {}
    
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Title is required' 
          },
          { status: 400 }
        )
      }
      if (title.length > 100) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Title must be less than 100 characters' 
          },
          { status: 400 }
        )
      }
      updateData.title = title.trim()
    }

    if (description !== undefined) {
      if (description && description.length > 500) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Description must be less than 500 characters' 
          },
          { status: 400 }
        )
      }
      updateData.description = description ? description.trim() : null
    }

    if (completed !== undefined) {
      updateData.completed = Boolean(completed)
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Task updated successfully',
        task: updatedTask
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error updating task:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Task not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to update task' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(request, { params }) {
  try {
    // Await params before accessing properties
    const { id: taskId } = await params
    
    // Authenticate user
    const authResult = await authenticateUser(request)
    
    if (authResult.error) {
      return NextResponse.json(
        { 
          success: false,
          message: authResult.error 
        },
        { status: authResult.status }
      )
    }

    // Validate task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: authResult.userId
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Task not found' 
        },
        { status: 404 }
      )
    }

    // Delete task
    await prisma.task.delete({
      where: { id: taskId }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Task deleted successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting task:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Task not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to delete task' 
      },
      { status: 500 }
    )
  }
}

// GET /api/tasks/[id] - Get single task
export async function GET(request, { params }) {
  try {
    // Await params before accessing properties
    const { id: taskId } = await params
    
    // Authenticate user
    const authResult = await authenticateUser(request)
    
    if (authResult.error) {
      return NextResponse.json(
        { 
          success: false,
          message: authResult.error 
        },
        { status: authResult.status }
      )
    }

    // Find task
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: authResult.userId
      }
    })

    if (!task) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Task not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Task fetched successfully',
        task
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch task' 
      },
      { status: 500 }
    )
  }
}