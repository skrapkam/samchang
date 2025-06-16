import React, { createContext, useContext, useState } from "react";

interface ChatContextValue {
  open: boolean;
  setOpen: (o: boolean) => void;
  initialPrompt?: string;
  setInitialPrompt: (p: string | undefined) => void;
  openChatWithPrompt: (prompt: string) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(undefined);

  const openChatWithPrompt = (prompt: string) => {
    setInitialPrompt(prompt);
    setOpen(true);
  };

  return (
    <ChatContext.Provider value={{ open, setOpen, initialPrompt, setInitialPrompt, openChatWithPrompt }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};


