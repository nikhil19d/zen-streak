import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Task {
  id: string;
  task: string;
  completed: boolean;
  createdAt: Date;
  userId: string
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  streak: number;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/tasks")
        const data = await response.json()
        setTasks(data)
      } catch (e) {
        console.log(e)
      }
    }
    async function fetchAllTasks() {
      try {
        const response = await fetch("/api/alltasks")
        const data = await response.json()
        setAllTasks(data)
      } catch (e) {
        console.log(e)
      }
    }
    fetchAllTasks()
    fetchTasks()
  }, [])

  const addTask = async (taskText: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ task: taskText }),
        headers: { "Content-Type": "application/json" }
      })
      const data = await response.json()
      setTasks(prev => [data, ...prev]);
      console.log(data)
    } catch (e) {
      console.log(e)
    }
    toast.success("Task added successfully!");
  };

  const toggleTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
      })
      console.log("success")
    } catch (e) {
      console.log(e)
    }
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updated = { ...task, completed: !task.completed };
        if (updated.completed) {
          toast.success("Task completed! 🎉", {
            description: "Great job on completing your task!",
          });
        }
        return updated;
      }
      return task;
    }));
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
      })
    } catch (e) {
      console.log(e)
    }
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted successfully!");
  };

  // Calculate stats
  const getStats = (): TaskStats => {
    const [streak, setStreak] = useState<number>(0)
    const totalTasks = tasks.length;
    // const safe = Array.isArray(tasks) ? tasks : []
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    useEffect(() => {
      async function getStreak() {
        const response = await fetch("/api/streak")
        const data = await response.json()
        setStreak(data.streak)
      }
      getStreak()
    }, [])
    return {
      totalTasks,
      completedTasks,
      completionRate,
      streak
    };
  };

  return {
    tasks,
    allTasks,
    addTask,
    toggleTask,
    deleteTask,
    stats: getStats()
  };
}
