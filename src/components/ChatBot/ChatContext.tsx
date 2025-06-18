import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextValue {
  open: boolean;
  setOpen: (o: boolean) => void;
  initialApiPrompt?: string; // What to send to the API
  initialDisplayPrompt?: string; // What to show in the UI for the initial message
  setInitialApiPrompt: (p: string | undefined) => void;
  setInitialDisplayPrompt: (p: string | undefined) => void;
  openChatWithPrompt: (displayText: string, apiPrompt: string) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [open, setOpen] = useState(false);
  const [initialApiPrompt, setInitialApiPrompt] = useState<string | undefined>(undefined);
  const [initialDisplayPrompt, setInitialDisplayPrompt] = useState<string | undefined>(undefined);

  const openChatWithPrompt = (displayText: string, apiPrompt: string) => {
    setInitialApiPrompt(apiPrompt);
    setInitialDisplayPrompt(displayText);
    setOpen(true);
  };

  const value: ChatContextValue = {
    open,
    setOpen,
    initialApiPrompt,
    setInitialApiPrompt,
    initialDisplayPrompt,
    setInitialDisplayPrompt,
    openChatWithPrompt
  };

  return React.createElement(ChatContext.Provider, { value }, children);
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};


