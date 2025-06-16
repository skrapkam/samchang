import React from "react";
import { inject } from "@vercel/analytics";
import PortfolioChatBot from "./src/components/PortfolioChatBot";
import { ChatProvider } from "./src/components/ChatContext";

// Inject Vercel Analytics
export const onInitialClientRender = () => {
  inject();
};

export const wrapRootElement = ({ element }: { element: React.ReactNode }) => (
  <ChatProvider>
    {element}
    <PortfolioChatBot />
  </ChatProvider>
);
