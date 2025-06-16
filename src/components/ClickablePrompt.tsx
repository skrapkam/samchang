/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { useChat } from "./ChatContext";

const Styled = styled.button`
  background: transparent;
  border-radius: 8px;
  padding: 1rem 1.2rem;
  font-size: 1.4rem;
  color: #181f2a;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
  position: relative;
  border: 1.5px solid black;
  margin-right: .5rem;
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background:transparent;
    border-radius: 8px;
    z-index: -1;
  }
  
  &:hover {
  
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
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

