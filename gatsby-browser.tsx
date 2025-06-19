import React from "react";
import { inject } from "@vercel/analytics";
import { PortfolioChatBot, ChatProvider } from "./src/components/ChatBot";
import SecretBypassToggle from "./src/components/Bypass/SecretBypassToggle";

// Inject Vercel Analytics
export const onInitialClientRender = () => {
  inject();
};

export const wrapRootElement = ({ element }: { element: React.ReactNode }) => (
  React.createElement(ChatProvider, null,
    element,
    React.createElement(PortfolioChatBot, null),
    React.createElement(SecretBypassToggle, null)
  )
);
