import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateUser } from '@/middleware/auth'

// GET /api/tasks - Fetch all tasks for authenticated user
export async function GET(request) {
  try {
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

    // Fetch user's tasks
    const tasks = await prisma.task.findMany({
      where: {
        userId: authResult.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Tasks fetched successfully',
        tasks
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch tasks' 
      },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create new task
export async function POST(request) {
  try {
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

    // Parse request body
    const body = await request.json()
    const { title, description } = body

    // Validate input
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

    if (description && description.length > 500) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Description must be less than 500 characters' 
        },
        { status: 400 }
      )
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        userId: authResult.userId,
        completed: false
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Task created successfully',
        task
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to create task' 
      },
      { status: 500 }
    )
  }
}