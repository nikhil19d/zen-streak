import authOptions from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withErroHandler } from "@/lib/handler";
import { requireAuth } from "@/lib/requireAuth";
import { NextResponse } from "next/server";

export const GET = withErroHandler(async () => {
  const session = await requireAuth(authOptions)
  const tasks = await prisma.tasks.findMany({
    where: {
      userId: session.user.id
    }
  })
  return NextResponse.json(
    tasks,
    {
      status: 200
    }
  )
})
