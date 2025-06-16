import React from "react";
import PortfolioChatBot from "./src/components/PortfolioChatBot";
import { ChatProvider } from "./src/components/ChatContext";

export const wrapRootElement = ({ element }: { element: React.ReactNode }) => (
  <ChatProvider>
    {element}
    <PortfolioChatBot />
  </ChatProvider>
);
