"use client";

import { Search } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Logo } from "@/components/icons/Logo";
import { Input } from "@/components/ui/input";

type HeaderProps = {
  setSearchQuery: Dispatch<SetStateAction<string>>;
  createTodoTrigger: React.ReactNode;
};

export function Header({ setSearchQuery, createTodoTrigger }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0 md:px-6">
        <div className="flex items-center gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-lg">Auto Planner</span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search lists..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
          {createTodoTrigger}
        </div>
      </div>
    </header>
  );
}
