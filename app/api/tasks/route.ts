import authOptions from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withErroHandler } from "@/lib/handler";
import { requireAuth } from "@/lib/requireAuth";
import { todayTask } from "@/lib/tasks";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const TasksSchema = z.object({
  task: z.string().min(1)
})

// retrive all today's tasks
export const GET = withErroHandler(async () => {
  const session = await requireAuth(authOptions)
  const allTasks = await prisma.tasks.findMany({
    where: {
      userId: session.user.id,
    }
  })
  const tasks = todayTask(allTasks)
  return NextResponse.json(
    tasks
    , {
      status: 200
    })
})

// create tasks
export const POST = withErroHandler(async (req: NextRequest) => {
  const session = await requireAuth(authOptions)
  const data = TasksSchema.parse(await req.json())
  const task = await prisma.tasks.create({
    data: {
      userId: session.user.id,
      task: data.task.toLowerCase()
    }
  })
  return NextResponse.json(
    task, {
    status: 200
  })
})

export const DELETE = withErroHandler(async () => {
  const session = await requireAuth(authOptions)
  await prisma.tasks.deleteMany({
    where: {
      userId: session.user.id
    }
  })
  return NextResponse.json({
    status: 200
  })
})
