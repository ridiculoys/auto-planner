"use client";

import { useState } from "react";
import { Bot, User, Sparkles, Loader2, Edit, Check } from "lucide-react";
import { generateTaskBreakdown } from "@/ai/flows/generate-task-breakdown";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { ConversationMessage, TodoListType } from "@/lib/types";
import { Input } from "../ui/input";

type CreateTodoDialogProps = {
  onAddTodoList: (listData: Omit<TodoListType, "id">) => void;
};

export function CreateTodoDialog({ onAddTodoList }: CreateTodoDialogProps) {
  const [initialPrompt, setInitialPrompt] = useState("");
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [finalTitle, setFinalTitle] = useState<string | null>(null);
  const [finalSteps, setFinalSteps] = useState<string[] | null>(null);
  const [view, setView] = useState<"initial" | "conversation" | "confirmation">("initial");
  const { toast } = useToast();

  const handleInitialGenerate = async () => {
    if (!initialPrompt.trim()) {
      toast({
        variant: "destructive",
        title: "Missing description",
        description: "Please describe the task.",
      });
      return;
    }
    const userMessage: ConversationMessage = { from: "user", text: initialPrompt };
    setConversation([userMessage]);
    setView("conversation");
    await callAI([userMessage]);
  };

  const handleReply = async (reply: string) => {
    if (!reply.trim()) return;
    const newConversation: ConversationMessage[] = [
      ...conversation,
      { from: "user", text: reply },
    ];
    setConversation(newConversation);
    await callAI(newConversation);
  };

  const callAI = async (currentConversation: ConversationMessage[]) => {
    setIsLoading(true);
    try {
      const fullPrompt = currentConversation
        .map((msg) => `${msg.from}: ${msg.text}`)
        .join("\n\n");
      const result = await generateTaskBreakdown({ task: fullPrompt });

      if (result.confirmed && result.steps && result.steps.length > 0 && result.title) {
        setFinalTitle(result.title);
        setFinalSteps(result.steps);
        setView("confirmation");
        if (result.followUpQuestions && result.followUpQuestions.length > 0) {
           setConversation(prev => [...prev, { from: "ai", text: result.followUpQuestions.join(' ') + " Here's what I have so far."}]);
        }
      } else if (result.followUpQuestions && result.followUpQuestions.length > 0) {
        setView("conversation");
        setConversation((prev) => [
          ...prev,
          { from: "ai", text: result.followUpQuestions!.join(" ") },
        ]);
      } else {
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "The AI could not generate steps. Please try rephrasing your request.",
        });
        setView("initial");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An Error Occurred",
        description: "Failed to communicate with the AI. Please try again.",
      });
      setView("initial");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!finalSteps || !finalTitle) return;
    onAddTodoList({
      title: finalTitle,
      summary: initialPrompt,
      createdAt: new Date().toISOString(),
      tasks: finalSteps.map((step) => ({
        id: Math.random().toString(36).substring(2, 9),
        text: step,
        completed: false,
      })),
    });
    resetState();
  };

  const handleEdit = () => {
    setConversation(prev => [...prev, { from: "ai", text: "What would you like to change in this list?" }]);
    setView("conversation");
    setFinalSteps(null);
    setFinalTitle(null);
  }

  const resetState = () => {
    setInitialPrompt("");
    setConversation([]);
    setFinalSteps(null);
    setFinalTitle(null);
    setIsLoading(false);
    setView("initial");
  };

  return (
    <DialogContent className="sm:max-w-[625px]" onInteractOutside={(e) => {
      if (view !== 'initial') e.preventDefault();
    }}>
      <DialogHeader>
        <DialogTitle>Create a new to-do list</DialogTitle>
        <DialogDescription>
          Describe your tasks in natural language, and let AI do the planning.
        </DialogDescription>
      </DialogHeader>

      {view === "initial" && (
        <div className="grid gap-4 py-4">
          <Textarea
            id="prompt"
            placeholder="Describe what you need to do... (e.g., 'buy groceries for pasta, pick up laundry, and water the plants')"
            value={initialPrompt}
            onChange={(e) => setInitialPrompt(e.target.value)}
            rows={5}
          />
          <Button onClick={handleInitialGenerate} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate with AI
          </Button>
        </div>
      )}

      {view === "conversation" && (
        <div className="flex flex-col h-[60vh]">
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-4">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    msg.from === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.from === "ai" && (
                    <div className="p-2 rounded-full bg-primary/20">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-sm rounded-lg p-3 text-sm",
                      msg.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {msg.text}
                  </div>
                  {msg.from === "user" && (
                     <div className="p-2 rounded-full bg-accent">
                      <User className="h-5 w-5 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3 justify-start">
                    <div className="p-2 rounded-full bg-primary/20"><Bot className="h-5 w-5 text-primary" /></div>
                    <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking...</span>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const reply = formData.get('reply') as string;
              handleReply(reply);
              e.currentTarget.reset();
          }} className="mt-4 flex gap-2">
              <Input name="reply" placeholder="Type your response..." autoComplete="off" disabled={isLoading} />
              <Button type="submit" disabled={isLoading}>Send</Button>
          </form>
        </div>
      )}

      {view === "confirmation" && finalSteps && finalTitle && (
        <div>
          <h3 className="font-semibold mb-2">Here's your plan for "{finalTitle}":</h3>
          <ScrollArea className="max-h-60 w-full rounded-md border p-4">
             <ul className="space-y-2">
                {finalSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span>{step}</span>
                    </li>
                ))}
             </ul>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleEdit} disabled={isLoading}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading}>
                <Check className="mr-2 h-4 w-4" />
                Confirm & Create
            </Button>
          </DialogFooter>
        </div>
      )}
    </DialogContent>
  );
}
