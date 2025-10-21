"use client";

import type { TodoListType } from "@/lib/types";
import { TodoCard } from "./TodoCard";

type TodoListProps = {
  lists: TodoListType[];
  onDelete: (id: string) => void;
  onToggleSubtask: (listId: string, taskId: string) => void;
};

export function TodoList({ lists, onDelete, onToggleSubtask }: TodoListProps) {
    if (lists.length === 0) {
        return (
             <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">No results found</h3>
                    <p className="text-sm text-muted-foreground">
                        Try adjusting your search terms.
                    </p>
                </div>
            </div>
        )
    }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {lists.map((list) => (
        <TodoCard
          key={list.id}
          list={list}
          onDelete={onDelete}
          onToggleSubtask={onToggleSubtask}
        />
      ))}
    </div>
  );
}
