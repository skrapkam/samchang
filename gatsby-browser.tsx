import React from "react";
import { inject } from "@vercel/analytics";
import { PortfolioChatBot, ChatProvider } from "./src/components/ChatBot";

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
