'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { Moon, Sun, Target, CheckCircle, Flame, TrendingUp } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Redirect from "@/components/redirect";
import { createContext } from "react";

interface User {
  name: string,
  email: string,
  img: string
}

export default function Landing() {
  const { theme, setTheme } = useTheme();
  const session = useSession()
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--color-gradient-zen)" }}>
              Zen Streak Tracker
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                Build Consistency,
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--color-gradient-zen)" }}>
                  {" "}Find Your Zen
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Track your daily tasks, build streaks, and achieve your goals with mindful productivity.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-card/50 border">
                <Flame className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Build Streaks</h3>
                  <p className="text-sm text-muted-foreground">Daily consistency</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-card/50 border">
                <CheckCircle className="h-6 w-6 text-success" />
                <div>
                  <h3 className="font-semibold">Track Progress</h3>
                  <p className="text-sm text-muted-foreground">Visual insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-card/50 border">
                <Target className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Set Goals</h3>
                  <p className="text-sm text-muted-foreground">Daily minimums</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-card/50 border">
                <TrendingUp className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Stay Motivated</h3>
                  <p className="text-sm text-muted-foreground">See your growth</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-card">
              <CardHeader className="text-center">
                <CardTitle>Welcome to Zen Streak</CardTitle>
                <CardDescription>
                  Start your journey towards mindful productivity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() =>
                  signIn(undefined, { callbackUrl: "/dashboard" })

                }
                  className="w-full shadow-zen hover:shadow-success transition-zen flex items-center gap-2"
                  style={{ backgroundImage: "var(--color-gradient-zen)" }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign In with Google
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main >

      {/* Footer */}
      < footer className="border-t bg-card/50 backdrop-blur-sm py-6" >
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Zen Streak Tracker. Find your zen through consistency.</p>
        </div>
      </footer >
    </div >
  );
}
