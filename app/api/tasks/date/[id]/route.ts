import authOptions from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withErroHandler } from "@/lib/handler";
import { requireAuth } from "@/lib/requireAuth";
import { NextRequest, NextResponse } from "next/server";

interface Task {
  id: string,
  userId: string,
  task: string,
  createdAt: Date,
  completed: boolean
}

export const GET = withErroHandler(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const session = await requireAuth(authOptions)
  const allTasks = await prisma.tasks.findMany({
    where: {
      userId: session.user.id,
    }
  })
  const { id } = await params
  const tasks: Task[] = allTasks.filter((task: Task) => task.createdAt.toLocaleDateString().replaceAll('/', '-') == id)
  return NextResponse.json(
    tasks
    , {
      status: 200
    })
})
