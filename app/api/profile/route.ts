import authOptions from "@/lib/auth"
import { prisma } from "@/lib/db"
import { withErroHandler } from "@/lib/handler"
import { requireAuth } from "@/lib/requireAuth"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const EditName = z.object({
  name: z.string().min(1)
})

export const GET = withErroHandler(async () => {
  const session = await requireAuth(authOptions)
  const profile = await prisma.user.findFirst({
    where: {
      id: session.user.id
    }
  })
  return NextResponse.json(
    profile,
    {
      status: 200
    }
  )
})

export const PUT = withErroHandler(async (req: NextRequest) => {
  const session = await requireAuth(authOptions)
  const data = EditName.parse(await req.json())
  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      name: data.name
    }
  })
  return NextResponse.json({
    status: 200
  })
})

export const DELETE = withErroHandler(async () => {
  const session = await requireAuth(authOptions)
  await prisma.user.delete({
    where: {
      id: session.user.id
    }
  })
  return NextResponse.json({
    status: 200
  })
})
