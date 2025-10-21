"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

import type { TodoListType, Subtask } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoList } from "@/components/todo/TodoList";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function Home() {
  const [todoLists, setTodoLists] = useState<TodoListType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const emptyStateImage = PlaceHolderImages.find(img => img.id === 'empty-state');

  const handleAddTodoList = (listData: Omit<TodoListType, "id">) => {
    const newList: TodoListType = {
      ...listData,
      id: Date.now().toString(),
    };
    setTodoLists((prev) => [newList, ...prev]);
    setIsDialogOpen(false);
  };

  const handleDeleteTodoList = (id: string) => {
    setTodoLists((prev) => prev.filter((list) => list.id !== id));
  };

  const handleToggleSubtask = (listId: string, taskId: string) => {
    setTodoLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map((task) => {
              if (task.id === taskId) {
                return { ...task, completed: !task.completed };
              }
              return task;
            }),
          };
        }
        return list;
      })
    );
  };

  const filteredTodoLists = useMemo(() => {
    if (!searchQuery) {
      return todoLists;
    }
    return todoLists.filter((list) =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [todoLists, searchQuery]);

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex min-h-screen w-full flex-col">
        <Header
          setSearchQuery={setSearchQuery}
          createTodoTrigger={
            <DialogTrigger asChild>
              <Button>
                <Plus className="-ml-1 h-4 w-4" />
                New List
              </Button>
            </DialogTrigger>
          }
        />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {todoLists.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
              <div className="flex flex-col items-center gap-4 text-center">
                {emptyStateImage && (
                    <Image
                      src={emptyStateImage.imageUrl}
                      alt={emptyStateImage.description}
                      width={400}
                      height={300}
                      className="max-w-xs rounded-lg"
                      data-ai-hint={emptyStateImage.imageHint}
                    />
                )}
                <h3 className="text-2xl font-bold tracking-tight">
                  You have no to-do lists
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get started by creating a new one.
                </p>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <Plus className="-ml-1 h-4 w-4" />
                    Create List
                  </Button>
                </DialogTrigger>
              </div>
            </div>
          ) : (
            <TodoList
              lists={filteredTodoLists}
              onDelete={handleDeleteTodoList}
              onToggleSubtask={handleToggleSubtask}
            />
          )}
        </main>
        <CreateTodoDialog onAddTodoList={handleAddTodoList} />
      </div>
    </Dialog>
  );
}
