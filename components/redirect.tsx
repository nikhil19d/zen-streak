'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type RedirectProp = ReturnType<typeof useSession>

export default function Redirect({ sessionData }: { sessionData: RedirectProp }) {
  const router = useRouter()
  useEffect(() => {
    if (!sessionData.data) router.push('/')
    else if (sessionData.data.user.email) router.push('/dashboard')
  }, [sessionData, router])
  return null
}
