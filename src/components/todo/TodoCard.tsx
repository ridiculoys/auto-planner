"use client";

import { MoreHorizontal, Trash2, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TodoListType } from "@/lib/types";
import { Badge } from "../ui/badge";

type TodoCardProps = {
  list: TodoListType;
  onDelete: (id: string) => void;
  onToggleSubtask: (listId: string, taskId: string) => void;
};

export function TodoCard({ list, onDelete, onToggleSubtask }: TodoCardProps) {
  const completedTasks = list.tasks.filter((task) => task.completed).length;
  const totalTasks = list.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="font-bold text-xl">{list.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => onDelete(list.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Calendar className="h-4 w-4" />
          <span>{format(parseISO(list.createdAt), "MMMM d, yyyy")}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-3">
          {list.tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3">
              <Checkbox
                id={`${list.id}-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => onToggleSubtask(list.id, task.id)}
                className="mt-1"
              />
              <label
                htmlFor={`${list.id}-${task.id}`}
                className={`text-sm ${
                  task.completed ? "text-muted-foreground line-through" : ""
                }`}
              >
                {task.text}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
            <span>Progress</span>
            <Badge variant={progress === 100 ? "default" : "secondary"}>
                {completedTasks}/{totalTasks}
            </Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
            <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      </CardFooter>
    </Card>
  );
}
