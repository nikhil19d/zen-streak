'use client'
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card";
import { TaskItem } from "@/components/task-item";
import { AddTaskForm } from "@/components/add-task-form";
import { InteractiveCalendar } from "@/components/interactive-calendar";
import { useTasks } from "@/hooks/use-tasks";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Flame, Target, TrendingUp, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
interface Profile {
  name: string,
  email: string,
  img: string,
}
const Index = () => {
  const router = useRouter()
  const { tasks, allTasks, addTask, toggleTask, deleteTask, stats } = useTasks();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    img: ""
  })
  // const Tasks = Array.isArray(tasks) ? tasks : []
  useEffect(() => {
    async function fetchProfile() {
      const response = await fetch("/api/profile")
      const data = await response.json()
      setProfile(data)
    }
    fetchProfile()
  }, [])

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar cred={profile} onAddTask={addTask} />

        <div className="cursor-default flex-1">
          {/* Header with Sidebar Trigger */}
          <header className="h-16 flex items-center border-b bg-card/50 backdrop-blur-sm px-6">
            {/* <SidebarTrigger className="mr-4" /> */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "var(--color-gradient-zen)" }}>
                Zen Streak Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Build consistency, achieve your goals, find your zen
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={async () => {
                const data = await signOut({ redirect: false, callbackUrl: "/" })
                router.push(data.url)
                console.log("clicked")
              }
              }
              className="ml-4"
            >
              Sign Out
            </Button>
            {/* <Redirect sessionData={session} /> */}
          </header>

          <main className="p-6">
            <div className="cursor-default grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Current Streak"
                value={stats.streak}
                description={stats.streak === 1 ? "day in a row" : "days in a row"}
                icon={<Flame />}
                variant={stats.streak > 0 ? "zen" : "default"}
              />
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                description="tasks created"
                icon={<Target />}
                variant="default"
              />
              <StatCard
                title="Completed"
                value={stats.completedTasks}
                description="tasks finished"
                icon={<CheckCircle />}
                variant={stats.completedTasks > 0 ? "success" : "default"}
              />
              <StatCard
                title="Success Rate"
                value={`${stats.completionRate}%`}
                description="completion rate"
                icon={<TrendingUp />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tasks Section */}
              <div className="space-y-6 max-h-screen overflow-y-auto">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Today's Tasks</h2>
                  <AddTaskForm onAdd={addTask} />
                </div>

                <div className="space-y-3 cursor-default">
                  {tasks.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No tasks yet. Add your first task to get started!</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        id={task.id}
                        task={task.task}
                        completed={task.completed}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Interactive Calendar - Full Width */}
              <div className="w-full">
                <InteractiveCalendar tasks={tasks} allTasks={allTasks} onAddTask={addTask} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
