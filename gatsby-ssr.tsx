import React from "react";
import { ChatProvider } from "./src/components/ChatBot";

export const wrapRootElement = ({ element }: { element: React.ReactNode }) => (
  React.createElement(ChatProvider, null, element)
);
