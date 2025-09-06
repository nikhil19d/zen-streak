'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface AddTaskFormProps {
  onAdd: (task: string) => void;
  placeholder?: string;
}

export function AddTaskForm({ onAdd, placeholder = "Add a new task..." }: AddTaskFormProps) {
  const [task, setTask] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onAdd(task.trim());
      setTask("");
    }
  };

  return (
    <Card className="p-4 shadow-card">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="submit"
          className="shadow-zen hover:shadow-success transition-zen"
          style={{ backgroundImage: "vat(--color-gradient-zen)" }}
          disabled={!task.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
