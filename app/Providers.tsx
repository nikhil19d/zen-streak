'use client'

import { SessionProvider } from "next-auth/react"
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"


export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}

