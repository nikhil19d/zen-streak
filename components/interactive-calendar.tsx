'use client'

import { useEffect, useState } from "react";
import { format, isSameDay, startOfToday, isAfter, startOfDay } from "date-fns";
import { CalendarIcon, Target, CheckCircle, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddTaskForm } from "@/components/add-task-form";
import { Task } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";

interface InteractiveCalendarProps {
  allTasks: Task[];
  tasks: Task[];
  className?: string;
  onAddTask?: (task: string) => void;
}

export function InteractiveCalendar({ allTasks, className, onAddTask }: InteractiveCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([])

  // Get tasks for the selected date
  const getTasksForDate = async (date: Date) => {
    try {
      const response = await fetch(`/api/tasks/date/${date.toLocaleDateString().replaceAll("/", "-")}`)
      const data = await response.json()
      setSelectedTasks(data)
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    async function fetchdata() {
      await getTasksForDate(selectedDate)
    }
    fetchdata()
  }, [selectedDate])

  // Get dates that have tasks
  const getTaskDates = (tasks: Task[]): Date[] => {
    const dates = tasks.map(task => new Date(task.createdAt));
    return Array.from(new Set(dates.map(date => date.toDateString())))
      .map(dateString => new Date(dateString));
  };


  const tasksForDate = (date: Date): Task[] => {
    return allTasks.filter(task => isSameDay(new Date(task.createdAt), date));
  };
  // Get streak level for date (0-3 for color intensity)
  const getStreakLevel = (date: Date): number => {
    const tasksForthatDate = tasksForDate(date);
    const completedCount = tasksForthatDate.filter(task => task.completed).length;
    if (completedCount === 0) return 0;
    if (completedCount <= 2) return 1;
    if (completedCount <= 4) return 2;
    return 3;
  };

  // const SelectedTasks = Array.isArray(selectedTasks) ? selectedTasks : []
  const completedTasks = selectedTasks.filter(task => task.completed);
  const pendingTasks = selectedTasks.filter(task => !task.completed);
  const isSelectedDateInPast = isAfter(startOfDay(new Date()), startOfDay(selectedDate));

  // Custom day renderer with streak colors
  const streakDates = getTaskDates(allTasks);
  const modifiers = {
    hasTask: streakDates,
    streak1: streakDates.filter(date => getStreakLevel(date) === 1),
    streak2: streakDates.filter(date => getStreakLevel(date) === 2),
    streak3: streakDates.filter(date => getStreakLevel(date) === 3),
  };

  const modifiersClassNames = {
    hasTask: "relative",
    streak1: "bg-gradient-to-br from-primary/20 to-primary/30 rounded-full text-primary border-primary/40",
    streak2: "bg-gradient-to-br from-primary/40 to-primary/60 rounded-full text-primary-foreground border-primary/60",
    streak3: "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-full border-accent shadow-zen",
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Calendar */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Task Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="pointer-events-auto"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-primary/20 to-primary/30 rounded border border-primary/40"></div>
              <span>Light streak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-primary/40 to-primary/60 rounded border border-primary/60"></div>
              <span>Medium streak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-primary to-accent rounded border border-accent"></div>
              <span>Strong streak</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details - Full Width */}
      <Card className="shadow-card w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
            <Badge variant={selectedTasks.length > 0 ? "secondary" : "outline"}>
              {selectedTasks.length} {selectedTasks.length === 1 ? "task" : "tasks"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {/* Add Task Section - Only show for today/future dates */}
          {!isSelectedDateInPast && onAddTask && (
            <div className="mb-4">
              <AddTaskForm onAdd={onAddTask} placeholder="Add task for this date..." />
            </div>
          )}

          {selectedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks for this date</p>
              {!isSelectedDateInPast && <p className="text-sm">Add tasks using the form above!</p>}
              {isSelectedDateInPast && <p className="text-sm">This date is in the past</p>}
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-success">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xl font-bold">{completedTasks.length}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-orange-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-xl font-bold">{pendingTasks.length}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>

              <Separator />

              {/* Task List */}
              <div className="space-y-3">
                {completedTasks.length > 0 && (
                  <div>
                    <h4 className="font-medium text-success mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Completed Tasks
                    </h4>
                    <div className="space-y-2">
                      {completedTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg"
                        >
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          <span className="flex-1 line-through text-muted-foreground">
                            {task.task}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(task.createdAt), "h:mm a")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pendingTasks.length > 0 && (
                  <div>
                    <h4 className="font-medium text-orange-500 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pending Tasks
                    </h4>
                    <div className="space-y-2">
                      {pendingTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg"
                        >
                          <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                          <span className="flex-1">{task.task}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(task.createdAt), "h:mm a")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
