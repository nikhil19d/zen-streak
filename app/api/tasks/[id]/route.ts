import authOptions from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withErroHandler } from "@/lib/handler";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

// retrive task
export const GET = withErroHandler(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const session = await requireAuth(authOptions)
  const { id } = await params
  const task = await prisma.tasks.findUnique({
    where: {
      id
    }
  })
  if (!task || task.userId !== session.user.id) return NextResponse.json({
    success: false,
    message: "Not authorized to get this task"
  }, {
    status: 403
  })
  return NextResponse.json({
    success: true,
    task
  }, {
    status: 200
  })
})

// delete task
export const DELETE = withErroHandler(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await requireAuth(authOptions)
  const { id } = await params
  await prisma.tasks.delete({
    where: {
      id
    }
  })
  return NextResponse.json(
    null,
    {
      status: 200
    })
})

// mark completed on task field
export const PATCH = withErroHandler(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const task = await prisma.tasks.findUniqueOrThrow({
    where: {
      id
    }
  })
  const updatedTask = await prisma.tasks.update({
    where: {
      id
    }, data: {
      completed: !task.completed
    }
  })
  return NextResponse.json({
    success: true,
    updatedTask
  }, {
    status: 200
  })
})
