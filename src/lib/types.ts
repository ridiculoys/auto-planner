export type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

export type TodoListType = {
  id: string;
  title: string;
  createdAt: string; // ISO string
  summary: string; // The initial user prompt
  tasks: Subtask[];
};

export type ConversationMessage = {
  from: 'user' | 'ai';
  text: string;
};
