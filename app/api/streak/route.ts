import authOptions from "@/lib/auth";
import { prisma } from "@/lib/db";
import { withErroHandler } from "@/lib/handler";
import { requireAuth } from "@/lib/requireAuth";
import { NextResponse } from "next/server";

export const GET = withErroHandler(async () => {
  const session = await requireAuth(authOptions)
  const streak = await prisma.streak.findUniqueOrThrow({
    where: {
      userId: session.user.id
    }
  })
  return NextResponse.json(
    streak
    , {
      status: 200
    })
})

export const DELETE = withErroHandler(async () => {
  const session = await requireAuth(authOptions)
  await prisma.streak.delete({
    where: {
      userId: session.user.id
    }
  })
  return NextResponse.json({
    status: 200
  })
})
