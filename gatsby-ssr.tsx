import React from "react";
import { PortfolioChatBot, ChatProvider } from "./src/components/ChatBot";

export const wrapRootElement = ({ element }: { element: React.ReactNode }) => (
  <ChatProvider>
    {element}
    <PortfolioChatBot />
  </ChatProvider>
);
