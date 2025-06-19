import React from "react";
import { PortfolioChatBot, ChatProvider } from "./src/components/ChatBot";
import SecretBypassToggle from "./src/components/Bypass/SecretBypassToggle";

export const wrapRootElement = ({ element }: { element: React.ReactNode }) => (
  React.createElement(ChatProvider, null,
    element,
    React.createElement(PortfolioChatBot, null),
    React.createElement(SecretBypassToggle, null)
  )
);
