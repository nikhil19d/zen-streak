interface Task {
  id: string
  task: string
  userId: string
  completed: boolean
  createdAt: Date
}

export function todayTask(tasks: Task[]) {
  return tasks.filter(task => {
    const createdDate = `${task.createdAt.toLocaleDateString()}`
    const presentDate = `${new Date().toLocaleDateString()}`
    if (createdDate === presentDate) return task
  })
}

export function yesterdayTask(tasks: Task[]) {
  return tasks.filter(task => {
    const today = new Date()
    const createdDate = `${task.createdAt.toLocaleDateString()}`
    const yesterdayDate = `${today.setDate(today.getDate() - 1).toLocaleString()}`
    if (createdDate === yesterdayDate) return task
  })
}
