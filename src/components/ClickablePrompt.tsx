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
  projectContext?: string;
  children?: React.ReactNode;
  onPromptClick?: (displayText: string, apiPrompt: string) => void;
  [key: string]: any;
}

const ClickablePrompt: React.FC<Props> = (props) => {
  const { openChatWithPrompt } = useChat();
  
  // Extract props - try multiple ways to get projectContext
  const prompt = props.prompt || props['prompt'];
  const projectContext = props.projectContext || props['projectcontext'] || props['projectContext'];
  const children = props.children;
  
  // Fallback: try to get project context from current page URL
  const getProjectContextFromURL = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('/your-work')) return 'Your Work';
      if (path.includes('/designer-onboarding') || path.includes('/onboarding')) return 'Onboarding';
    }
    return null;
  };
  
  const finalProjectContext = projectContext || getProjectContextFromURL();
  
  const contextualizedPrompt = finalProjectContext 
    ? `[Regarding the ${finalProjectContext} project] ${prompt}`
    : prompt;

  // Ensure displayText is always a string. If children is an array, join it. If it's a single ReactNode, stringify it.
  const displayText = (children && typeof children === 'string')
    ? children
    : (Array.isArray(children) ? children.join('') : (children ? String(children) : prompt));
  
  const handleClick = () => {
    if (props.onPromptClick) {
      props.onPromptClick(displayText, contextualizedPrompt);
    } else {
      // Fallback for cases where onPromptClick is not provided (e.g., direct usage)
      openChatWithPrompt(displayText, contextualizedPrompt);
    }
  };
  
  return <Styled onClick={handleClick}>{displayText}</Styled>;
};

export default ClickablePrompt;

