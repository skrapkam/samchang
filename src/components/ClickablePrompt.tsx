/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { useChat } from "./ChatContext";

const Styled = styled.button`
  border: 1px solid var(--border);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  &:hover {
    background: var(--border);
  }
`;

interface Props {
  prompt: string;
  children?: React.ReactNode;
}

const ClickablePrompt: React.FC<Props> = ({ prompt, children }) => {
  const { openChatWithPrompt } = useChat();
  return <Styled onClick={() => openChatWithPrompt(prompt)}>{children || prompt}</Styled>;
};

export default ClickablePrompt;

