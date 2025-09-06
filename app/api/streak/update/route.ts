import { prisma } from "@/lib/db";
import { withErroHandler } from "@/lib/handler";
import { yesterdayTask } from "@/lib/tasks";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErroHandler(async (req: NextRequest) => {
  if (req.method != "GET") return NextResponse.json({
    success: false,
    message: "only GET method is processed"
  }, {
    status: 400
  })
  const users = await prisma.user.findMany()
  for (const user of users) {
    const streakCount = await prisma.streak.findUniqueOrThrow({
      where: {
        userId: user.id
      }
    })
    const allTasks = await prisma.tasks.findMany({
      where: {
        userId: user.id
      }
    })
    const tasks = yesterdayTask(allTasks)

    const completedTasks = tasks.filter(task => task.completed)
    const check = completedTasks.length / tasks.length

    // check for the eligibility to update the streak
    if (check >= 0.6) {
      await prisma.streak.update({
        where: {
          userId: user.id
        }, data: {
          streak: streakCount.streak + 1
        }
      })
    } else {
      await prisma.streak.update({
        where: {
          userId: user.id
        }, data: {
          streak: 0
        }
      })
    }
  }
  return NextResponse.json({
    success: true,
    message: `you are testing for cron scheduler`
  }, {
    status: 200
  })
})
