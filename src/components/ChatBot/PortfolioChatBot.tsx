/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useState, useEffect, useRef, Fragment } from "react";
import { useChat } from "./ChatContext";
import { getBypassToken } from "../Bypass/useBypassToken";
import ShimmerText from "../ShimmerText";

const CHAT_API_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/chat"
        : "https://sam-chat-api.vercel.app/api/chat";

// Rate limit bypass token from environment variable
const RATE_LIMIT_BYPASS_TOKEN = process.env.GATSBY_RATE_LIMIT_BYPASS_TOKEN;

// After the RATE_LIMIT_BYPASS_TOKEN constant, add session id helpers
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getOrCreateSessionId = (): string => {
  if (typeof window === "undefined") {
    return generateSessionId();
  }
  let sessionId = localStorage.getItem("chatSessionId");
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem("chatSessionId", sessionId);
  }
  return sessionId;
};

// Chat Thread Management Types and Helpers
type ChatThread = {
    id: string;
    name: string;
    created: string;
    messages: ChatMessage[];
    sessionId?: string; // Add session ID to thread data
};

const THREADS_KEY = "portfolioChatThreads";
const CURRENT_THREAD_KEY = "portfolioCurrentThread";

// Thread Management Helpers
const getThreads = (): ChatThread[] => {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(THREADS_KEY) || "[]");
    } catch {
        return [];
    }
};

const saveThreads = (threads: ChatThread[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
};

const getCurrentThreadId = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CURRENT_THREAD_KEY);
};

const setCurrentThreadId = (threadId: string | null) => {
    if (typeof window === "undefined") return;
    if (threadId) {
        localStorage.setItem(CURRENT_THREAD_KEY, threadId);
    } else {
        localStorage.removeItem(CURRENT_THREAD_KEY);
    }
};

const generateThreadId = () => `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateThreadName = (messages: ChatMessage[]): string => {
    const userMessage = messages.find(m => m.isUser);
    if (userMessage) {
        return userMessage.text.slice(0, 30) + (userMessage.text.length > 30 ? "..." : "");
    }
    return `Chat on ${new Date().toLocaleDateString()}`;
};

const saveCurrentThread = (messages: ChatMessage[], threadId: string, name?: string, sessionId?: string) => {
    // Don't save empty threads (only assistant message, no user messages)
    if (messages.length <= 1 || !messages.some(m => m.isUser)) return;

    const thread: ChatThread = {
        id: threadId,
        name: name || generateThreadName(messages),
        created: messages[0]?.timestamp || new Date().toISOString(),
        messages: messages.filter(m => !m.streaming), // Don't save streaming messages
        sessionId: sessionId // Store the session ID with the thread
    };

    const threads = getThreads();
    const existingIndex = threads.findIndex(t => t.id === threadId);
    
    if (existingIndex >= 0) {
        threads[existingIndex] = thread;
    } else {
        threads.push(thread);
    }
    
    saveThreads(threads);
};

const deleteThread = (threadId: string) => {
    const threads = getThreads().filter(t => t.id !== threadId);
    saveThreads(threads);
};

// Single function to handle all paragraph breaks consistently
const processTextWithParagraphs = (text: string): (string | JSX.Element)[] => {
    if (!text || typeof text !== 'string') return [text];
    
    // Handle paragraph breaks (double newlines) and line breaks (single newlines)
    const paragraphs = text.split('\n\n');
    const result: (string | JSX.Element)[] = [];
    
    paragraphs.forEach((paragraph, paragraphIndex) => {
        // Add paragraph break between paragraphs
        if (paragraphIndex > 0) {
            result.push(<br key={`paragraph-break-1-${paragraphIndex}`} />);
            result.push(<br key={`paragraph-break-2-${paragraphIndex}`} />);
        }
        
        // Handle line breaks within paragraphs
        if (paragraph.includes('\n')) {
            const lines = paragraph.split('\n');
            lines.forEach((line, lineIndex) => {
                if (lineIndex > 0) {
                    result.push(<br key={`line-break-${paragraphIndex}-${lineIndex}`} />);
                }
                if (line.trim()) {
                    result.push(line);
                }
            });
        } else if (paragraph.trim()) {
            result.push(paragraph);
        }
    });
    
    return result;
};

// Utility function to detect URLs and convert them to clickable links
const convertUrlsToLinks = (text: string): (string | JSX.Element)[] => {
    // If no URLs or markdown links, just process paragraph breaks and return
    if (!text.includes('http') && !text.includes('[')) {
        return processTextWithParagraphs(text);
    }
    
    // Preprocess: fix common URL concatenation issues
    text = text.replace(/(https?:\/\/[^\s]+?)https?:\/\//g, '$1 https://') // Separate concatenated URLs
         .replace(/(https?:\/\/[^\s]+?)([A-Z][a-z]{1,})/g, '$1 $2') // Add space before capital words (1+ lowercase letters)
         .replace(/(https?:\/\/[^\s]+?)([.!?])/g, '$1$2') // Keep punctuation attached
    
    // First, handle Markdown-style links [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let processedText = text;
    const markdownMatches: RegExpExecArray[] = [];
    let match;
    
    // Collect all markdown matches
    while ((match = markdownLinkRegex.exec(processedText)) !== null) {
        markdownMatches.push(match);
    }
    
    if (markdownMatches.length > 0) {
        // Split the text by markdown links and reconstruct with React elements
        const parts: (string | JSX.Element)[] = [];
        let lastIndex = 0;
        
        markdownMatches.forEach((match, index) => {
            const [fullMatch, linkText, url] = match;
            const matchIndex = match.index!;
            
            // Add text before the markdown link
            if (matchIndex > lastIndex) {
                const textBefore = processedText.slice(lastIndex, matchIndex);
                const textElements = processTextWithParagraphs(textBefore);
                parts.push(...textElements);
            }
            
            // Add the markdown link as a React element
            parts.push(
                <StyledLink 
                    key={`markdown-${index}`}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    {linkText}
                </StyledLink>
            );
            
            lastIndex = matchIndex + fullMatch.length;
        });
        
        // Add remaining text after the last markdown link
        if (lastIndex < processedText.length) {
            const remainingText = processedText.slice(lastIndex);
            const textElements = processTextWithParagraphs(remainingText);
            parts.push(...textElements);
        }
        
        return parts;
    }
    
    // Handle plain URLs that weren't already converted
    // Basic URL regex since preprocessing already added spaces
            const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Find and replace URLs properly
    const urlResult: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let urlMatch;
    
    while ((urlMatch = urlRegex.exec(processedText)) !== null) {
        const [fullMatch, rawUrl] = urlMatch;
        const matchIndex = urlMatch.index!;
        
        // Clean up trailing punctuation from URL
        const cleanUrl = rawUrl.replace(/[.,!?;:]+$/, '');
        const removedChars = rawUrl.length - cleanUrl.length;
        
        // Add text before the URL
        if (matchIndex > lastIndex) {
            const textBefore = processedText.slice(lastIndex, matchIndex);
            const textElements = processTextWithParagraphs(textBefore);
            urlResult.push(...textElements);
        }
        
        // Add the URL as a link
        urlResult.push(
            <StyledLink 
                key={`url-${matchIndex}`}
                href={cleanUrl} 
                target="_blank" 
                rel="noopener noreferrer"
            >
                {cleanUrl}
            </StyledLink>
        );
        
        // Add any trailing punctuation that was removed
        if (removedChars > 0) {
            urlResult.push(rawUrl.slice(-removedChars));
        }
        
        lastIndex = matchIndex + fullMatch.length;
    }
    
    // Add remaining text after the last URL
    if (lastIndex < processedText.length) {
        const remainingText = processedText.slice(lastIndex);
        const textElements = processTextWithParagraphs(remainingText);
        urlResult.push(...textElements);
    }
    
    return urlResult.length > 0 ? urlResult : processTextWithParagraphs(processedText);
};

// Styled link component with underline styling
const StyledLink = styled.a`
    color: #0066cc;
    text-decoration: underline;
    text-decoration-color: #0066cc;
    text-decoration-thickness: 1px;
    transition: color 0.2s ease;
    
    &:hover {
        color: #004499;
        text-decoration-color: #004499;
    }
    
    &:visited {
        color: #660099;
        text-decoration-color: #660099;
    }
`;

const ChatWrapper = styled.div<{ x: number; y: number }>`
  position: fixed;
  z-index: 9999;
  bottom: ${(props) => props.y}px;
  right: ${(props) => props.x}px;

  /* Mobile: pin wrapper to the top to keep chat visible when keyboard shows */
  @media (max-width: 600px) {
    top: 0;
    right: 0;
    left: 0;
    bottom: auto;
    width: 100%;
  }
`;

const ChatButton = styled.button<{ isOpen: boolean }>`
  background-color: transparent;
  user-select: none;
  opacity: ${(props) => (props.isOpen ? 0.4 : 1)};
  /* Safari and mobile browser compatibility for backdrop-filter */
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  /* Fallback for browsers that don't support backdrop-filter */
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  font-size: 1.7rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  transition: box-shadow 0.2s;
  
  /* Ensure backdrop-filter works on Safari */
  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    background-color: transparent;
  }
  
  /* Mobile-specific fixes */
  @media (max-width: 768px) {
    /* Reduce blur on mobile for better performance */
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }

  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
  }

  /* Keep the button accessible on mobile even when ChatWrapper is moved */
  @media (max-width: 600px) {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9997;
  }
`;

const popIn = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

interface ChatBoxProps {
    visible: boolean;
}

const ChatBox = styled.div<ChatBoxProps>`
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 360px;
  max-width: 90vw;
  min-height: 350px;
  max-height: 520px;
  background: #f9fafd;
  border: 1px solid #e7eaf2;
  border-radius: 10px;
  padding: 0 0 calc(1.2rem + env(safe-area-inset-bottom, 0px)) 0;
  box-shadow: 0 8px 28px rgba(50, 60, 120, 0.13);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: bottom right;
  transform: scale(${props => (props.visible ? 1 : 0.8)});
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: all 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};

  /* Mobile: occupy the top half of the viewport so the keyboard can use the bottom half */
  @media (max-width: 600px) {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    top: auto;
    width: 100vw;
    height: 50dvh;
    max-width: 100vw;
    max-height: 50dvh;
    min-height: 50dvh;
    border-radius: 10px 10px 0 0;
    transform-origin: bottom center;
    z-index: 9999;
    transform: ${props => (props.visible ? 'translateY(0)' : 'translateY(100%)')};
    transition: all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`;

const TopBar = styled.div<{ showBorder: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 1rem 0.9rem;
  height: 5rem;
  user-select: none;
  background: transparent;
  box-shadow: ${(props) => (props.showBorder ? "inset 0 -1px 0 rgba(231, 234, 242, 1)" : "none")};
`;




const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border-radius: 5px;
  border: none;
  color: #7a7a7a;
  font-size: 1.8rem;
  font-weight: 500;
  padding: 4px 10px;
  height: 32px;
  cursor: pointer;
  transition: color 0.2s ease;
  &:hover {
    color: #000;
    background-color: #f2f2f2;
  }
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    fill: currentColor;
    transition: fill 0.2s ease;
  }
`;

// History Panel Styled Components
const HistoryPanel = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 92%;
  background: #f9fafd;
  z-index: 100;
  display: flex;
  flex-direction: column;
  transform: translateY(${props => (props.visible ? '0' : '-100%')});
  opacity: ${props => (props.visible ? 1 : 0)};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
  transition: all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  overflow: hidden; /* To contain children */
  border-radius: 0 0 10px 10px;
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e7eaf2;
  background: #f9fafd;
`;

const HistoryCloseButton = styled(IconButton)`
 display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border-radius: 5px;
  border: none;
  color: #7a7a7a;
  font-size: 1.5rem;
  font-weight: 500;
  padding: 4px 10px;
  height: 32px;
  cursor: pointer;
  transition: color 0.2s ease;
  &:hover {
    color: #000;
    background-color: #f2f2f2;
  }
`;

const HistoryContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const HistoryActions = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #e7eaf2;
  background: #f9fafd;
`;

const NewChatButton = styled.button`
  width: 100%;
  background: #000;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 1rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #464646;
  }
`;

const ThreadItem = styled.div<{ trashHovered?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 2rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: ${props => props.trashHovered ? 'transparent' : '#f2f2f2'};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ThreadInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ThreadName = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: #222;
  margin-bottom: 0.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ThreadDate = styled.div`
  font-size: 1.2rem;
  color: #7a7a7a;
`;

const ThreadActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.2s ease;
  
  ${ThreadItem}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
  
  /* Keep visible on mobile */
  @media (max-width: 600px) {
    opacity: 1;
    transform: translateX(0);
  }
  
`;

const ThreadActionButton = styled.button`
  background: transparent;
  border: none;
  color: #7a7a7a;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 1.4rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f2f2f2;
    color: #000;
  }
  
  &.delete:hover {
    background: #fee;
    color: #d63384;
  }
`;

const TrashIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 5px;
  border: none;
  color: #7a7a7a;
  font-size: 1.8rem;
  font-weight: 500;
  padding: 4px 10px;
  height: 32px;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    background-color: #f2f2f2;
    color: #000;
  }
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    fill: currentColor;
    transition: fill 0.2s ease;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #7a7a7a;
  font-size: 1.4rem;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const MessageArea = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1.1rem 1.8rem 3rem 1.8rem;
  background: #f9fafd;
`;

const MessageWrapper = styled.div<{ isUser?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  margin-bottom: 14px;
`;

const Meta = styled.div`
  font-size: 1.1rem;
  color: #b2b8c7;
  margin-bottom: 2px;
  display: flex;
  gap: 8px;
  align-items: baseline;
`;

const Sender = styled.span`
  font-weight: 500;
  color: #9098b1;
`;

const Time = styled.span`
  font-size: 0.9em;
  color: #c3c6d2;
`;

const Message = styled.div<{ isUser?: boolean }>`
  background: ${(props) => (props.isUser ? "#fffbe0" : "#e7f0fc")};
  color: #181f2a;
  border-radius: 10px;
  padding: 0.72rem 1rem;
  font-size: 1.5rem;
  line-height: 1.6;
  box-shadow: ${(props) =>
        props.isUser
            ? "0 1px 3px rgba(230,220,130,0.06)"
            : "0 1px 3px rgba(130,180,220,0.07)"};
  max-width: 80%;
  word-break: break-word;
  white-space: pre-wrap;
`;

const rotate = keyframes`
  from {
    background-position: 0% 0%;
  }
  to {
    background-position: 400% 0%;
  }
`;

const borderMove = keyframes`
  0% {
    clip-path: inset(0 0 95% 0);
  }
  25% {
    clip-path: inset(0 0 0 95%);
  }
  50% {
    clip-path: inset(95% 0 0 0);
  }
  75% {
    clip-path: inset(0 95% 0 0);
  }
  100% {
    clip-path: inset(0 0 95% 0);
  }
`;

const PromptButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 1.2rem 0;
  align-items: flex-start;
`;

const PromptButton = styled.button`
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
  border: 1px solid #7a7a7a;
  
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

// Inline citation styling
const Citation = styled.a<{ title?: string }>`
  display: inline-block;
  font-size: 0.8em;
  padding: 0 8px;
  border-radius: 2px;
  background: #dfdfdf;
  color: #1563ff;
  border: 1px solid #e0e0e0;
  vertical-align: super;
  line-height: 1;
  font-family: inherit;
  font-weight: 500;
  margin-left: 3px;
  box-shadow: none !important;
  border-bottom: none !important;
  text-decoration: none;
  opacity: 1;
  transition: none;
  position: relative;
  white-space: nowrap;
  &:hover {
    background: #dfdfdf;
    text-decoration: none;
  }
`;

// Component to render processed message content (paragraphs already handled)
const MessageContent = ({ children }: { children: (string | JSX.Element)[] | string }) => {
  if (typeof children === 'string') {
    return <Fragment>{children}</Fragment>;
  }
  
  if (Array.isArray(children)) {
    return (
      <Fragment>
        {children.map((child, index) => (
          <Fragment key={index}>{child}</Fragment>
        ))}
      </Fragment>
    );
  }
  
  return <Fragment>{children}</Fragment>;
};

// Container for rendered source links after each assistant message
const SourcesContainer = styled.div`
  width: 100%;
  /* Remove margin-top and padding-top for edge-to-edge look */
  margin-top: 10px;
  padding-top: 0;
  /* border-top: 1px solid var(--border); */

  .sources-label {
    font-size: 1.18rem;
    color: #8a99b3;
    font-weight: 500;
    margin-bottom: 0.6rem;
    letter-spacing: 0.01em;
  }

  .source-link {
    display: block;
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    border-radius: 5px;
    text-decoration: none;
    color: inherit;
    margin-bottom: 0.7rem;
    transition: box-shadow 0.16s, border 0.16s, background 0.16s;
    border: 1px solid #e3e7ee;
    background: #fafbfc;
    cursor: pointer;
    &:hover {
      border: 1px solid #b0b7c3;
      background: #f5f7fa;
      text-decoration: none;
    }
  }
  .source-link:last-child {
    margin-bottom: 0;
  }

  .source-card {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 1rem 1.2rem 0.8rem 1.2rem;
  }

  .source-context {
    font-size: 1.05rem;
    color: #b0b7c3;
    font-weight: 400;
    margin-bottom: 0.1rem;
    letter-spacing: 0.01em;
  }

  .source-title-row {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .source-number {
    font-size: 1.15rem;
    color: #b0b7c3;
    font-weight: 600;
    margin-right: 0.5rem;
    background: #f3f4f7;
    border-radius: 50%;
    width: 2.1rem;
    height: 2.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid #e3e7ee;
  }

  .source-title {
    color: #222;
    font-size: 1.13rem;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.15s;
    &:hover {
      text-decoration: none;
    }
  }
`;

const BottomBar = styled.form<{ focused: boolean }>`
  height: 52px; /* Set a fixed height */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid ${(props) => (props.focused ? "#000" : "#e7eaf2")};
  border-radius: 15px;
  padding: 0.6rem 0.8rem;
  margin: 0 0.8rem;
  transition: all 0.2s ease;
`;

const Input = styled.input`
  flex: 1 1 auto;
  border: none;
  outline: none;
  background: transparent;
  font-size: max(1.4rem, 16px); /* Prevent zoom on iOS */
  color: #222;
  padding: 0.38rem 0.3rem;
  &::placeholder {
    color: #b2b8c7;
    opacity: 1;
  }
`;

const InputPlaceholder = styled.div`
  position: absolute;
  top: 50%;
  left: 0.68rem;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: max(1.4rem, 16px);
  color: #b2b8c7;
  z-index: 1;
`;

const InputContainer = styled.div`
  position: relative;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: max(1.4rem, 16px); /* Prevent zoom on iOS */
  color: #222;
  padding: 0.38rem 0.3rem;
  
  /* Hide placeholder when shimmer is active */
  &::placeholder {
    color: transparent;
    opacity: 0;
  }
`;

const SendButton = styled.button<{ visible: boolean }>`
  background: #262626;
  border: none;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  margin-left: ${(props) => (props.visible ? "8px" : "0")};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: ${(props) =>
        props.visible ? "translateX(0)" : "translateX(10px)"};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.visible ? "pointer" : "default")};
  pointer-events: ${(props) => (props.visible ? "auto" : "none")};
  svg {
    width: 20px;
    height: 20px;
    stroke: #fff;
    transform: rotate(90deg);
  }
`;

const Ellipsis = styled.div`
  font-size: 1.5rem;
  padding: 0.72rem 1rem;
  color: #999;
  font-style: italic;
`;

const useEllipsis = () => {
    const [dots, setDots] = useState(".");
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length === 3 ? "." : prev + "."));
        }, 400);
        return () => clearInterval(interval);
    }, []);
    return dots;
};

const useShimmerText = () => {
    const words = ["Thinking", "Cooking", "Jamming", "Vibing", "Composing"];
    return words[Math.floor(Math.random() * words.length)];
};




type ChatMessage = {
    text: string;
    isUser: boolean;
    timestamp: string;
    streaming?: boolean;
    showPrompts?: boolean;
    sources?: Source[];
};

const getInitialMsg = (): ChatMessage => ({
    text: "Hi! I'm Sam. Feel free to ask me anything about my background, projects, or interests.",
    isUser: false,
    timestamp: new Date().toISOString(),
    showPrompts: true
});

function formatTime(iso: string) {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "";

    // Helper to compare only the date portion
    const isSameCalendarDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameCalendarDay(date, today)) {
        return "Today";
    }

    if (isSameCalendarDay(date, yesterday)) {
        return "Yesterday";
    }

    // Fallback to locale date string (e.g., Jun 30, 2025)
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatTimeWithTime(iso: string) {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "";

    // Helper to compare only the date portion
    const isSameCalendarDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const timeString = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    if (isSameCalendarDay(date, today)) {
        return `Today at ${timeString}`;
    }

    if (isSameCalendarDay(date, yesterday)) {
        return `Yesterday at ${timeString}`;
    }

    // For older dates, show date and time
    const dateString = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    return `${dateString} at ${timeString}`;
}

// Add new styled components for rate limit error display
const RateLimitError = styled.div`
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  color: #c53030;
  font-size: 1.4rem;
  line-height: 1.5;
`;

const RateLimitInfo = styled.div`
  margin-top: 0.8rem;
  font-size: 1.2rem;
  color: #744210;
  background: #fef5e7;
  border-radius: 6px;
  padding: 0.6rem;
`;

const RateLimitCountdown = styled.div`
  font-weight: 500;
  color: #d69e2e;
  margin-top: 0.4rem;
`;

const RetryButton = styled.button`
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 1.3rem;
  cursor: pointer;
  margin-top: 0.8rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #2c5aa0;
  }
  
  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
`;

// Add rate limit error type
interface RateLimitError {
    limit: number;
    remaining: number;
    reset: number;
    message: string;
}

async function fetchStreamedResponse(message: string, sessionId: string, onChunk: (text: string) => void, onSessionId: (id: string) => void) {
    // Prepare headers with bypass token if available
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    const storedToken = getBypassToken();
    if (storedToken) {
        headers["x-bypass-token"] = storedToken;
    } else if (RATE_LIMIT_BYPASS_TOKEN) {
        // fallback to build-time env token if exists
        headers["x-bypass-token"] = RATE_LIMIT_BYPASS_TOKEN;
    }

    try {
        console.log('Attempting to fetch from:', CHAT_API_URL);
        console.log('Headers:', headers);
        
        const response = await fetch(CHAT_API_URL, {
            method: "POST",
            headers,
            body: JSON.stringify({ 
                userMessage: message,
                sessionId
            }),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        // Capture/propagate session id from headers
        const responseSessionId = response.headers.get('X-Session-Id');
        if (responseSessionId && responseSessionId !== sessionId) {
            onSessionId(responseSessionId);
        }

        // Handle rate limit error
        if (response.status === 429) {
            const limit = response.headers.get("X-RateLimit-Limit");
            const remaining = response.headers.get("X-RateLimit-Remaining");
            const reset = response.headers.get("X-RateLimit-Reset");
            
            const rateLimitError: RateLimitError = {
                limit: limit ? parseInt(limit) : 0,
                remaining: remaining ? parseInt(remaining) : 0,
                reset: reset ? parseInt(reset) : 0,
                message: "You've reached your daily message limit. Please try again later."
            };
            
            throw rateLimitError;
        }

        // Handle other HTTP errors
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            
            // Try to get error details from response
            try {
                const errorData = await response.text();
                if (errorData) {
                    errorMessage += ` - ${errorData}`;
                }
            } catch (e) {
                // Ignore error reading response body
            }
            
            throw new Error(errorMessage);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("Failed to get response reader");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        const processBuffer = () => {
            let newlineIndex: number;
            // Process complete lines delimited by a newline character
            while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
                const fullLine = buffer.slice(0, newlineIndex).trim();
                buffer = buffer.slice(newlineIndex + 1);

                if (!fullLine.startsWith("data: ")) continue;
                const chunk = fullLine.replace("data: ", "");
                if (chunk === "[DONE]") {
                    return true; // signal completion
                }
                if (chunk) {
                    onChunk(chunk);
                }
            }
            return false; // not done yet
        };

        while (true) {
            const { value, done } = await reader.read();
            if (value) {
                buffer += decoder.decode(value, { stream: true });
                const finished = processBuffer();
                if (finished) return;
            }
            if (done) {
                // Flush any remaining bytes from the decoder and process once more
                buffer += decoder.decode();
                processBuffer();
                break;
            }
        }
    } catch (error) {
        console.error('Chat API error:', error);
        
        // Provide more specific error messages
        if (error instanceof TypeError && error.message.includes('fetch')) {
            if (process.env.NODE_ENV === 'development') {
                throw new Error(`Network error: Unable to connect to ${CHAT_API_URL}. Make sure your backend server is running on port 3000.`);
            } else {
                throw new Error('Network error: Unable to connect to the chat service. Please check your internet connection and try again.');
            }
        }
        
        // Re-throw the original error
        throw error;
    }
}

// Helper function to format reset time
function formatResetTime(resetTimestamp: number): string {
    const now = Math.floor(Date.now() / 1000);
    const timeUntilReset = resetTimestamp - now;
    
    if (timeUntilReset <= 0) {
        return "now";
    }
    
    const hours = Math.floor(timeUntilReset / 3600);
    const minutes = Math.floor((timeUntilReset % 3600) / 60);
    
    if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `in ${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
}

const ALL_PROMPTS = [
    "Tell me about your experience and background",
    "What projects have you worked on?",
    "What music do you like?",
    "What's your approach to team alignment?",
    "How do you use user research in your work",
    "Tell me about your education",
    "What are your hobbies?",
    "What's your work style?",
    "What are your career goals?",
    "What's your favorite project you've worked on?",
    "What does good design mean to you?",
    "What's your approach to problem-solving?",
    "What do you do for fun?"
];

const getRandomPrompts = () => {
    const shuffled = [...ALL_PROMPTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
};

// Simplified post-processing since backend now sends clean formatting
function postProcessText(text: string) {
    return text
        .replace(/([.!?])([A-Z])/g, "$1 $2")  // ensure space after .,!,? if missing
        .replace(/:([A-Za-z0-9])/g, ": $1")    // ensure space after colon if missing
        // Fix concatenated words with numbers - but preserve brand names and articles
        // First: letters followed by numbers (like "in2015" -> "in 2015")
        .replace(/\b([a-zA-Z]{2,})(\d+)\b/g, "$1 $2")
        // Handle single letter + number pattern (like "a97%" -> "a 97%" or "a64" -> "a 64")
        .replace(/\b([a-zA-Z])(\d+)\b/g, "$1 $2")
        // Second: letters followed by numbers followed by letters (like "when99designs" -> "when 99designs")
        .replace(/\b([a-zA-Z]{2,})(\d+)([a-zA-Z]{2,})\b/g, (match, prefix, num, suffix) => {
            // Don't split known brand names in the suffix
            const knownBrands = ['designs', 'up'];
            if (knownBrands.includes(suffix.toLowerCase())) {
                return `${prefix} ${num}${suffix}`;
            }
            return `${prefix} ${num} ${suffix}`;
        })
        // Third: numbers followed by letters, but skip known brand names
        .replace(/\b(\d+)([a-zA-Z]{2,})\b/g, (match, num, letters) => {
            // Don't split known brand names or common patterns
            const knownBrands = ['designs', 'up', 'am', 'pm'];
            if (knownBrands.includes(letters.toLowerCase())) {
                return match; // Keep as-is
            }
            return `${num} ${letters}`;
        })
        // Fix email addresses if needed - restore proper email formatting
        .replace(/([a-zA-Z]+)\s+(\d+)\s+([a-zA-Z]+)\s*@\s*([a-zA-Z]+\.[a-zA-Z]+)/g, "$1$2$3@$4")
        .replace(/([a-zA-Z]+)\s+(\d+)\s*@\s*([a-zA-Z]+\.[a-zA-Z]+)/g, "$1$2@$3")
        // Fix social media handles with missing @ symbol
        .replace(/(Instagram|X|Twitter):\s*([A-Za-z0-9_]+)/gi, "$1: @$2")
        // Remove commas between consecutive citations like [1], [2] -> [1] [2]
        .replace(/\]\s*,\s*\[/g, '] [')
        // Remove commas before citations like text, [1] -> text [1]
        .replace(/,\s*\[/g, ' [')
        // Clean up multiple spaces
        .replace(/[ \t]{2,}/g, " ")
        .trim();
}

// Function to strip HTML tags, particularly figcaption tags
function stripHtmlTags(text: string): string {
    return text
        // Remove figcaption tags and their content
        .replace(/<figcaption[^>]*>.*?<\/figcaption>/gi, '')
        // Remove any other HTML tags
        .replace(/<[^>]*>/g, '')
        // Simple formatting - backend now sends clean formatting
        // Protect brand names
        .replace(/LinkedIn/g, '___LINKEDIN___')  // Temporarily protect LinkedIn
        // Handle domain endings followed by capital letters (for URL spacing)
        .replace(/(\.com|\.org|\.net|\.io)([A-Z])/g, '$1\n\n$2')  // Add paragraph breaks after domain endings before capital letters
        // Add paragraph breaks after citations before new sentences
        .replace(/(\[\[cite:[^\]]+\]\]\.\s*)([A-Z])/g, '$1\n\n$2')
        // Clean up extra whitespace but preserve newlines
        .replace(/[ \t]+/g, ' ')  // Replace tabs and multiple spaces with single space
        .replace(/\n[ \t]+/g, '\n')  // Remove spaces/tabs at start of lines
        .replace(/[ \t]+\n/g, '\n')  // Remove spaces/tabs at end of lines
        .replace(/\n{3,}/g, '\n\n')  // Replace multiple newlines with double newlines
        // Restore protected terms
        .replace(/___LINKEDIN___/g, 'LinkedIn')  // Restore LinkedIn
        .trim();
}

// Add type for parsed citation sources
interface Source {
  index: number;
  title: string;
  url: string;
  slug: string;
  section: string;
}

// ---------------------------------------------
// Citation parsing helpers
// ---------------------------------------------

function parseSourcesSection(rawText: string): { mainText: string; sources: Source[] } {
  const sources: Source[] = [];
  let mainText = rawText;
  
  // Early exit: if the text doesn't contain any citation markers, return immediately
  // But still process the text for proper formatting
  const hasAnyCitationMarkers = /\[\[cite:|\[\d+\]|\(\d+\)/.test(rawText);
  if (!hasAnyCitationMarkers) {
    // No citations, but still return the text with proper formatting
    return { mainText: rawText, sources: [] };
  }
  
  // Only accept citations that reference heading sections (h1, h2, h3)
  // The format should be [[cite:slug#heading-section]] where heading-section corresponds to a heading
  const citationRegex = /\[\[cite:([^#\]]+)#([^\]]+)\]\]/g;
  let citationIndex = 1;
  let match;
  const citations: Array<{match: string, index: number, position: number, slug: string, section: string}> = [];

  // First pass: collect all citations with their positions
  while ((match = citationRegex.exec(rawText)) !== null) {
    const [fullMatch, slug, section] = match;
    
    // Validate that the section looks like a heading reference
    // Headings typically contain words separated by hyphens or spaces, not special characters
    // Must start with a letter and contain only letters, numbers, spaces, and hyphens
    // Must not be too short (avoid single characters) and not too long
    const headingPattern = /^[a-zA-Z][a-zA-Z0-9\s\-]{1,50}$/;
    if (!headingPattern.test(section.trim())) {
      // Skip this citation if it doesn't look like a heading reference
      continue;
    }
    
    // Additional validation: must not contain HTML-like patterns or list indicators
    const invalidPatterns = [
      /<[^>]*>/, // HTML tags
      /^li$/i, // List item (case insensitive)
      /^ul$/i, // Unordered list (case insensitive)
      /^ol$/i, // Ordered list (case insensitive)
      /^div$/i, // Div (case insensitive)
      /^span$/i, // Span (case insensitive)
      /^p$/i, // Paragraph (case insensitive)
      /^\d+$/, // Just numbers
      /^[a-z]$/, // Single letter
      /^[a-z]{1,2}$/, // Very short words (likely HTML tags)
    ];
    
    // Additional validation: must reference actual heading sections
    // Check if the section looks like a reasonable heading structure
    const sectionLower = section.trim().toLowerCase();
    
    // Reject sections that are clearly not headings
    const clearlyNotHeadings = [
      'li', 'ul', 'ol', 'div', 'span', 'p', 'section', 'article', 'aside', 'nav', 'header', 'footer',
      'main', 'figure', 'figcaption', 'blockquote', 'pre', 'code', 'table', 'tr', 'td', 'th',
      'form', 'input', 'button', 'label', 'select', 'option', 'textarea', 'fieldset', 'legend'
    ];
    
    if (clearlyNotHeadings.includes(sectionLower)) {
      // Skip this citation if it's clearly not a heading
      continue;
    }
    
    // Accept sections that look like reasonable headings
    // Must be at least 3 characters and contain mostly letters/numbers/hyphens
    const headingCharPattern = /^[a-zA-Z0-9\-]+$/;
    if (!headingCharPattern.test(sectionLower) || sectionLower.length < 3) {
      // Skip this citation if it doesn't look like a reasonable heading
      continue;
    }
    
    if (invalidPatterns.some(pattern => pattern.test(sectionLower))) {
      // Skip this citation if it matches any invalid pattern
      continue;
    }
    
    // Allow single words that are at least 3 characters (like "scope", "background", etc.)
    // but still block very short HTML-like terms
    const words = section.trim().split(/\s+/);
    if (words.length === 1 && words[0].length < 3) {
      // Single very short words are likely not headings
      continue;
    }
    
    citations.push({
      match: fullMatch,
      index: citationIndex,
      position: match.index,
      slug: slug.trim(),
      section: section.trim()
    });
    
    const url = `/${slug.trim()}/#${section.trim().replace(/\s+/g, '')}`;
    
    sources.push({
      index: citationIndex,
      title: section.trim().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      url,
      slug: slug.trim(),
      section: section.trim()
    });
    
    citationIndex++;
  }

  // If we found citations, replace them with numbered citations
  if (citations.length > 0) {
    // Replace citations in reverse order to maintain positions
    let cleanText = rawText;
    citations.slice().reverse().forEach(citation => {
      cleanText = cleanText.replace(citation.match, ` [${citation.index}]`);
    });
    
    // Clean up any double spaces and fix spacing around punctuation
    // But preserve consecutive citations without commas and paragraph breaks
    cleanText = cleanText
      // Preserve paragraph breaks while cleaning up other whitespace
      .split(/\n\n+/)
      .map(paragraph => paragraph
        .replace(/[ \t]+/g, ' ')  // Only collapse spaces/tabs, not newlines
        .replace(/\s+([.!?])/g, '$1')
        .replace(/([.!?])\s+\[/g, '$1 [')
        .replace(/,\s*\./g, '.')
        .replace(/,\s*,/g, ',')
        // Remove commas between consecutive citations like [1], [2] -> [1] [2]
        .replace(/\]\s*,\s*\[/g, '] [')
        // Remove commas before citations like text, [1] -> text [1]
        .replace(/,\s*\[/g, ' [')
        .trim()
      )
      .filter(paragraph => paragraph.length > 0)
      .join('\n\n');
    
    mainText = cleanText.trim();
  }

  // If no [[cite:]] format found, look for inline citations throughout the text
  // But only if they appear to reference heading sections
  if (sources.length === 0) {
    // First check if there are any citation markers at all
    const hasCitationMarkers = /\[\d+\]|\(\d+\)/.test(mainText);
    if (!hasCitationMarkers) {
      // No citation markers found, don't process any citations
      return { mainText, sources: [] };
    }
    
    // Only use matchAll for global regexes
    const inlineCitationPatterns: RegExp[] = [
      /\[(\d+)\]/g,
      /\((\d+)\)/g
    ];

    let foundCitations = false;
    
    for (const pattern of inlineCitationPatterns) {
      const matches = Array.from(mainText.matchAll(pattern));
      if (matches.length > 0) {
        foundCitations = true;
        // Handle inline citations that are already in the text
        // But only create sources if they appear to reference heading content
        const citationNumbers = new Set<number>();
        matches.forEach(match => {
          const num = parseInt(match[1], 10);
          citationNumbers.add(num);
        });
        
        // Only create sources for citations that appear in context that suggests heading references
        // Look for patterns like "see section X" or "as mentioned in X" or similar
        const headingReferencePattern = /\b(?:section|heading|chapter|part|in|see|as mentioned in|referenced in)\s+\[?(\d+)\]?/gi;
        const headingMatches = Array.from(mainText.matchAll(headingReferencePattern));
        const headingCitationNumbers = new Set<number>();
        headingMatches.forEach(match => {
          const num = parseInt(match[1], 10);
          headingCitationNumbers.add(num);
        });
        
        // Only create sources for citations that appear to reference headings
        // AND have explicit citation markers
        Array.from(headingCitationNumbers).sort((a, b) => a - b).forEach(num => {
          // Only create source if there's an actual citation marker [num] in the text
          const citationMarker = new RegExp(`\\[${num}\\]`);
          if (citationMarker.test(mainText)) {
            sources.push({
              index: num,
              title: `Section ${num}`,
              url: '#',
              slug: `section-${num}`,
              section: `section-${num}`
            });
          }
        });
        
        // Convert (1) format to [1] format for consistency
        if (pattern.source === '\\((\\d+)\\)') {
          mainText = mainText.replace(/\((\d+)\)/g, '[$1]');
        }
        break; // Use the first pattern that finds matches
      }
    }
    // If no inline citations found, check for trailing numbers (non-global regex)
    // But only if they appear to reference heading sections
    if (!foundCitations) {
      // Look for trailing comma-separated numbers like "1, 2, 3" or just "3" (before punctuation)
      // But only if the preceding text suggests they reference headings
      const endingNumbersMatch = mainText.match(/(\d+(?:\s*,\s*\d+)*)\s*[.!?]?\s*$/);
      if (endingNumbersMatch) {
        const numbersString = endingNumbersMatch[1];
        const textBeforeNumbers = mainText.slice(0, mainText.lastIndexOf(numbersString)).trim();
        
        // Check if the text before numbers suggests heading references
        // Must be more specific to avoid false positives
        const headingContextPattern = /\b(?:sections?|headings?|chapters?|parts?)\s+(?:are|is|can be found in|referenced in|mentioned in)\s*$/i;
        if (headingContextPattern.test(textBeforeNumbers)) {
          // Parse the numbers properly, handling comma-separated format
          const numbers = numbersString.split(/\s*,\s*/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
          
          if (numbers.length > 0) {
            let newText = textBeforeNumbers;
            // Normalize the text while preserving paragraph breaks
            newText = newText.split(/\n\n+/)
              .map(p => p.replace(/[ \t]+/g, ' ').trim())  // Only collapse spaces/tabs, not newlines
              .filter(p => p.length > 0)
              .join('\n\n');
            // Split into sentences and distribute citations
            const sentences = newText.split(/(?<=[.!?])\s+/).filter(s => s.trim());
            let citationCount = 0;
            const processedSentences = sentences.map((sentence, idx) => {
              const isLastSentence = idx === sentences.length - 1;
              const citationsForThisSentence = isLastSentence 
                ? numbers.length - citationCount
                : Math.min(1, numbers.length - citationCount);
              let processedSentence = sentence.trim();
              if (!processedSentence.match(/[.!?]$/)) {
                processedSentence += '.';
              }
              for (let i = 0; i < citationsForThisSentence && citationCount < numbers.length; i++) {
                citationCount++;
                sources.push({
                  index: citationCount,
                  title: `Section ${citationCount}`,
                  url: '#',
                  slug: `section-${citationCount}`,
                  section: `section-${citationCount}`
                });
                // Add citation without comma
                processedSentence += ` [${citationCount}]`;
              }
              return processedSentence;
            });
            mainText = processedSentences.join(' ').trim();
          }
        }
      }
    }
    // If still no citations found, check for structured content with trailing numbers
    // But only if they appear to reference heading sections
    if (sources.length === 0) {
      // Look for trailing comma-separated numbers like "1, 2, 3" or just "3" (before punctuation)
      // But only if the content suggests heading references
      const endingNumbersMatch = mainText.match(/(\d+(?:\s*,\s*\d+)*)\s*[.!?]?\s*$/);
      if (endingNumbersMatch) {
        const numbersString = endingNumbersMatch[1];
        const textBeforeNumbers = mainText.slice(0, mainText.lastIndexOf(numbersString)).trim();
        
        // Check if the content suggests heading references (e.g., "Impact:", "Constraints:", etc.)
        // Must be more specific and only match if it's actually a section header
        const headingSectionPattern = /^(?:Impact|Constraints|Background|Problem|Solution|Results|Conclusion|Summary|Overview|Introduction|Methods|Approach|Process|Outcome|Findings|Analysis|Discussion|Recommendations|Next Steps|Future Work)\s*:/i;
        if (headingSectionPattern.test(textBeforeNumbers)) {
          // Parse the numbers properly, handling comma-separated format
          const numbers = numbersString.split(/\s*,\s*/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
          
          if (numbers.length > 0) {
            let newText = textBeforeNumbers;
            // Normalize the text while preserving paragraph breaks
            newText = newText.split(/\n\n+/)
              .map(p => p.replace(/[ \t]+/g, ' ').trim())  // Only collapse spaces/tabs, not newlines
              .filter(p => p.length > 0)
              .join('\n\n');
            // Split text into sections (e.g., "Impact:", "Constraints:")
            const sections = newText.split(/(?=\w+:)/).filter(s => s.trim());
            let citationCount = 0;
            const processedSections = sections.map((section) => {
              const colonIndex = section.indexOf(':');
              if (colonIndex === -1) return section;
              const header = section.slice(0, colonIndex + 1);
              let content = section.slice(colonIndex + 1).trim();
              let bulletPoints;
              if (content.includes('-')) {
                bulletPoints = content.split(/(?=^-)/).filter(s => s.trim());
              } else {
                bulletPoints = content.split(/(?=\w+\s*:)/).filter(s => s.trim());
              }
              if (bulletPoints.length <= 1) {
                bulletPoints = content.split(/(?<=[.!?])\s+/).filter(s => s.trim());
              }
              const processedBulletPoints = bulletPoints.map((point, idx) => {
                const isLastPoint = idx === bulletPoints.length - 1;
                const citationsForThisPoint = isLastPoint 
                  ? numbers.length - citationCount
                  : Math.min(1, numbers.length - citationCount); // One citation per point
                let processedPoint = point.trim();
                if (processedPoint.startsWith('-')) {
                  processedPoint = processedPoint.slice(1).trim();
                }
                if (!processedPoint.match(/[.!?]$/)) {
                  processedPoint += '.';
                }
                for (let i = 0; i < citationsForThisPoint && citationCount < numbers.length; i++) {
                  citationCount++;
                  sources.push({
                    index: citationCount,
                    title: `Section ${citationCount}`,
                    url: '#',
                    slug: `section-${citationCount}`,
                    section: `section-${citationCount}`
                  });
                  // Add citation without comma
                  processedPoint += ` [${citationCount}]`;
                }
                return `- ${processedPoint}`;
              });
              return `${header}\n${processedBulletPoints.join('\n')}`;
            });
            mainText = processedSections.join('\n\n').trim();
          }
        }
      }
    }
  }
  
  // Final cleanup: remove any remaining commas between citations
  mainText = mainText
    .replace(/\]\s*,\s*\[/g, '] [')  // Remove commas between consecutive citations
    .replace(/,\s*\[/g, ' [');       // Remove commas before citations
  
  return { mainText, sources };
}

function insertCitationSuperscripts(text: string, sources: Source[]): (string | JSX.Element)[] {
  if (!sources?.length) {
    // No citations, just process paragraphs and return
    return processTextWithParagraphs(text);
  }

  const parts: (string | JSX.Element)[] = [];
  const regex = /\[(\d+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the citation, processing paragraph breaks
    if (match.index > lastIndex) {
      const textBeforeCitation = text.slice(lastIndex, match.index);
      // Process paragraph breaks and handle non-breaking space for citation
      const processedTextBefore = processTextWithParagraphs(textBeforeCitation);
      
      // Handle non-breaking space for the last element before citation
      if (processedTextBefore.length > 0) {
        const lastElement = processedTextBefore[processedTextBefore.length - 1];
        if (typeof lastElement === 'string' && lastElement.trim()) {
          // Replace the last space with a non-breaking space
          const lastSpaceIndex = lastElement.lastIndexOf(' ');
          if (lastSpaceIndex !== -1) {
            processedTextBefore[processedTextBefore.length - 1] = 
              lastElement.slice(0, lastSpaceIndex) + '\u00A0' + lastElement.slice(lastSpaceIndex + 1);
          }
        }
      }
      
      parts.push(...processedTextBefore);
    }

    // Add the citation
    const citationNumber = parseInt(match[1], 10);
    const source = sources.find(s => s.index === citationNumber);
    
    parts.push(
      <Citation
        key={`citation-${match.index}`}
        href={source?.url || '#'}
        title={source?.title}
        target="_blank"
        rel="noopener noreferrer"
      >
        {citationNumber}
      </Citation>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text with paragraph processing
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    const processedRemaining = processTextWithParagraphs(remainingText);
    parts.push(...processedRemaining);
  }

  return parts;
}

const PortfolioChatBot = () => {
    const { open, setOpen, initialApiPrompt, setInitialApiPrompt, initialDisplayPrompt, setInitialDisplayPrompt } = useChat();
    
    // Thread Management State
    const [currentThreadId, setCurrentThreadIdState] = useState<string>(() => getCurrentThreadId() || generateThreadId());
    const [showHistory, setShowHistory] = useState(false);
    const [threads, setThreads] = useState<ChatThread[]>(() => getThreads());
    const [searchQuery, setSearchQuery] = useState("");
    
    // Initialize messages from current thread or default
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const currentId = getCurrentThreadId();
        if (currentId) {
            const existingThreads = getThreads();
            const currentThread = existingThreads.find(t => t.id === currentId);
            if (currentThread) {
                return currentThread.messages;
            }
        }
        // Fallback to legacy localStorage for backward compatibility
        try {
            const stored = localStorage.getItem("portfolioChatHistory");
            if (stored) return JSON.parse(stored);
        } catch { }
        return [getInitialMsg()];
    });
    
    const [input, setInput] = useState("");
    const [focused, setFocused] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [rateLimitError, setRateLimitError] = useState<RateLimitError | null>(null);
    const [countdown, setCountdown] = useState<string>("");
    const [showShimmer, setShowShimmer] = useState(false);
    const [currentShimmerWord, setCurrentShimmerWord] = useState("Thinking");
    const msgEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dots = useEllipsis();

    const [isScrollable, setIsScrollable] = useState(false);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    
    const [currentPrompts, setCurrentPrompts] = useState(getRandomPrompts());
    
    const [sessionId, setSessionId] = useState<string>(() => getOrCreateSessionId());
    
    const [trashHovered, setTrashHovered] = useState(false);
    const [isDeletingThread, setIsDeletingThread] = useState(false);

    // Persist session id changes
    useEffect(() => {
        if (sessionId) {
            localStorage.setItem('chatSessionId', sessionId);
        }
    }, [sessionId]);



    // Persist current thread ID
    useEffect(() => {
        setCurrentThreadId(currentThreadId);
    }, [currentThreadId]);

    // Save current thread when messages change
    useEffect(() => {
        if (messages.length > 1 && messages.some(m => m.isUser) && !isDeletingThread) {
            saveCurrentThread(messages, currentThreadId, undefined, sessionId);
            setThreads(getThreads()); // Refresh threads list
        }
    }, [messages, currentThreadId, sessionId, isDeletingThread]);
    
    // Function to detect project context from current URL
    const getProjectContextFromURL = () => {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            if (path.includes('/your-work')) return 'Your Work';
            if (path.includes('/designer-onboarding') || path.includes('/onboarding')) return 'Onboarding';
            if (path.includes('/google')) return 'Google';
            if (path.includes('/music')) return 'Music';
            if (path.includes('/info')) return 'Info';
            if (path.includes('/music')) return 'Music';
            if (path.includes('/affordability')) return 'Ladder Affordability';
            if (path.includes('/billing-checkout')) return 'Ladder Billing Checkout';
            if (path.includes('/design-leadership')) return 'Ladder Design Leadership';
            if (path.includes('/first-payment-failure')) return 'Ladder First Payment Failure';
            if (path.includes('/reroute')) return 'Ladder Reroute';
            if (path.includes('/ladder')) return 'Ladder';
            // Add more project paths as needed
        }
        return null;
    };
    
    useEffect(() => {
        const el = messageAreaRef.current;
        if (!el) return;
      
        const handleScroll = () => {
          setIsScrollable(el.scrollTop > 0);
        };
      
        // Set once initially
        handleScroll();
      
        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
      }, [messages]);

    useEffect(() => {
        // Scroll to top for new chats, scroll to bottom for ongoing conversations
        if (messages.length === 1) {
            // New chat - scroll to top
            messageAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            // Ongoing conversation - scroll to bottom
            msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, open]);

    // Legacy localStorage cleanup - remove old chat history format
    useEffect(() => {
        // Clean up old format on first load
        if (typeof window !== "undefined") {
            localStorage.removeItem("portfolioChatHistory");
        }
    }, []);

    useEffect(() => {
        if (!initialApiPrompt && !initialDisplayPrompt) return; // Check both new prompts
        const handleInitialPrompt = async () => {
            // Only reset if this is the first message
            if (messages.length === 1 && messages[0].text === getInitialMsg().text) {
                setMessages([getInitialMsg()]);
            }
            await sendMessage(initialDisplayPrompt, initialApiPrompt);
            setInitialApiPrompt(undefined); // Clear after use
            setInitialDisplayPrompt(undefined); // Clear after use
        };
        handleInitialPrompt();
    }, [initialApiPrompt, initialDisplayPrompt]); // Depend on both initial prompts

    useEffect(() => {
        if (open) {
            // Only auto-focus on desktop/tablet, not on mobile to prevent keyboard from opening immediately
            if (typeof window !== 'undefined' && window.innerWidth > 600) {
                inputRef.current?.focus();
            }
        }
    }, [open]);

    useEffect(() => {
        if (!isStreaming) {
            inputRef.current?.focus();
        }
    }, [isStreaming]);

    // Countdown effect for rate limit reset
    useEffect(() => {
        if (!rateLimitError) {
            setCountdown("");
            return;
        }

        const updateCountdown = () => {
            const now = Math.floor(Date.now() / 1000);
            const timeUntilReset = rateLimitError.reset - now;
            
            if (timeUntilReset <= 0) {
                setRateLimitError(null);
                setCountdown("");
                return;
            }
            
            setCountdown(formatResetTime(rateLimitError.reset));
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [rateLimitError]);

    const sendMessage = async (
        displayText?: string, // Used for displaying in UI
        apiPrompt?: string,   // Used for sending to API
        e?: React.FormEvent
    ) => {
        e?.preventDefault();
        const textToDisplay = displayText ?? input.trim();
        const textToSendToApi = apiPrompt ?? textToDisplay;

        if (!textToDisplay || isStreaming || rateLimitError) return; // Check for rate limit error

        // Auto-detect project context for user-typed messages
        let finalApiText = textToSendToApi;
        if (!apiPrompt) { // Only add context if this is a user-typed message (not from clickable prompts)
            const projectContext = getProjectContextFromURL();
            if (projectContext) {
                finalApiText = `[Regarding the ${projectContext} project] ${textToSendToApi}`;
            }
        }

        const now = new Date().toISOString();
        const userMessage = { text: textToDisplay, isUser: true, timestamp: now }; // Use textToDisplay for user message
        setMessages(prev => [...prev, userMessage]);
        if (!displayText) setInput(""); // Only clear input if it was typed, not from prompt click
        setIsStreaming(true);
        setRateLimitError(null); // Clear any previous rate limit errors
        setShowShimmer(true); // Show shimmer effect
        setCurrentShimmerWord(useShimmerText()); // Set a random word for this response

        setMessages(prev => [...prev, { text: "", isUser: false, timestamp: now, streaming: true }]);

        try {
            let streamedText = "";
            await fetchStreamedResponse(finalApiText, sessionId, chunk => {
                streamedText += chunk;
                
                // Apply real-time formatting during streaming
                const strippedText = stripHtmlTags(streamedText);
                const { mainText, sources } = parseSourcesSection(strippedText);
                const formattedText = postProcessText(mainText);
                
                setMessages(prev => {
                    const newMsgs = [...prev];
                    const i = newMsgs.findIndex(m => m.streaming);
                    if (i !== -1) newMsgs[i] = { ...newMsgs[i], text: formattedText, sources };
                    return newMsgs;
                });
            }, (newSessionId) => {
                setSessionId(newSessionId);
            });

            // Final formatting pass after streaming completes
            const { mainText, sources } = parseSourcesSection(stripHtmlTags(streamedText));
            const finalText = postProcessText(mainText);
            setMessages(prev => prev.map(m => m.streaming ? { ...m, streaming: false, text: finalText, sources } : m));
        } catch (error) {
            // Handle rate limit error
            if (error && typeof error === 'object' && 'limit' in error) {
                setRateLimitError(error as RateLimitError);
                // Keep the user's message and show the error. Only remove the streaming placeholder.
                setMessages(prev => prev.filter(m => !m.streaming));
            } else {
                // Handle other errors
                const errorMessage = error instanceof Error ? error.message : "An error occurred";
                setMessages(prev => prev.map(m => m.streaming ? { 
                    ...m, 
                    streaming: false, 
                    text: `Sorry, I encountered an error: ${errorMessage}` 
                } : m));
            }
        } finally {
            setIsStreaming(false);
            // Hide shimmer with a slight delay for smooth transition
            setTimeout(() => setShowShimmer(false), 300);
        }
    };

    // Thread Management Functions
    const startNewChat = (skipSaveOrEvent?: boolean | React.MouseEvent) => {
        const skipSave = typeof skipSaveOrEvent === 'boolean' ? skipSaveOrEvent : false;
        
        // Save current thread if it has user messages and we're not deleting
        if (messages.length > 1 && messages.some(m => m.isUser) && !skipSave) {
            saveCurrentThread(messages, currentThreadId, undefined, sessionId);
        }
        
        // Create new thread with fresh session
        const newThreadId = generateThreadId();
        const newSessionId = generateSessionId();
        
        setCurrentThreadIdState(newThreadId);
        setCurrentPrompts(getRandomPrompts());
        setMessages([getInitialMsg()]);
        setRateLimitError(null);
        setSessionId(newSessionId);
        
        // Clear the persistent session ID to ensure fresh start
        if (typeof window !== "undefined") {
            localStorage.removeItem("chatSessionId");
        }
        
        setThreads(getThreads()); // Refresh threads list
    };

    const openThread = (thread: ChatThread) => {
        // Save current thread before switching
        if (messages.length > 1 && messages.some(m => m.isUser)) {
            saveCurrentThread(messages, currentThreadId, undefined, sessionId);
        }
        
        setCurrentThreadIdState(thread.id);
        setMessages(thread.messages);
        setShowHistory(false);
        setRateLimitError(null);
        
        // Use the thread's session ID if available, otherwise generate new one
        if (thread.sessionId) {
            setSessionId(thread.sessionId);
        } else {
            setSessionId(generateSessionId());
        }
        
        setThreads(getThreads()); // Refresh threads list
    };

    const handleDeleteThread = (threadId: string) => {
        // Set the deletion flag immediately
        setIsDeletingThread(true);
        
        // Delete the thread from localStorage first
        deleteThread(threadId);
        
        // Get the updated threads immediately after deletion
        const updatedThreads = getThreads();
        
        // Update the threads state immediately
        setThreads(updatedThreads);
        
        // If deleting current thread, start a new one
        if (threadId === currentThreadId) {
            // Clear the current thread ID and start new chat
            setCurrentThreadId(null);
            
            // Use React's batch update to ensure all state changes happen together
            setTimeout(() => {
                startNewChat(true); // Pass true to skip saving the deleted thread
                // Reset the deletion flag after new chat is started
                setTimeout(() => {
                    setIsDeletingThread(false);
                }, 100);
            }, 0);
        } else {
            // If not current thread, just reset the flag
            setTimeout(() => {
                setIsDeletingThread(false);
            }, 100);
        }
    };

    // Reset chat and show prompts (legacy function, now calls startNewChat)
    const resetChat = () => {
        startNewChat();
    };

    // Helper for clickable prompts: pass both clean and contextualized prompt
    const handlePromptClick = (cleanText: string, contextualizedPrompt: string) => {
        sendMessage(cleanText, contextualizedPrompt);
    };

    // Check if chat is disabled due to rate limiting
    const isChatDisabled = isStreaming || !!rateLimitError;

    // Filter threads based on search query
    const filteredThreads = threads.filter(thread => {
        if (!searchQuery.trim()) return true;
        
        const query = searchQuery.toLowerCase();
        
        // Search in thread name
        if (thread.name.toLowerCase().includes(query)) return true;
        
        // Search in message content
        return thread.messages.some(message => 
            message.text.toLowerCase().includes(query)
        );
    });

    return (
        <ChatWrapper x={30} y={30}>
            <ChatButton onClick={() => setOpen(!open)} isOpen={open} aria-label="Open chat">💬 Chat</ChatButton>
            <MobileOverlay visible={open} />
            <ChatBox visible={open}>
                <TopBar showBorder={isScrollable}>
                    <IconButton onClick={startNewChat} title="New Chat">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 25 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12.0242 11.3549L12.6101 8.24042C12.6465 8.05155 12.738 7.87779 12.8733 7.7437L18.762 1.89157C19.9732 0.68941 21.9177 0.704519 23.1084 1.92745L23.114 1.93312C23.6915 2.52522 24.0107 3.32792 23.9995 4.15989C23.9892 4.99281 23.6496 5.78606 23.0561 6.36306L17.1972 12.0688C17.0713 12.1916 16.9136 12.2756 16.7428 12.3125L13.6515 12.9707C13.2036 13.066 12.737 12.9282 12.4105 12.6033C12.0839 12.2785 11.9383 11.8101 12.0242 11.3549ZM18.3244 4.97392L14.3895 8.88447L13.9967 10.9668L16.0962 10.5191L20.0124 6.7068L18.3244 4.97392ZM21.357 5.39699L21.7628 5.00225C21.9961 4.77561 22.1296 4.46303 22.1333 4.13534C22.138 3.80765 22.012 3.49224 21.7852 3.25898L21.7796 3.25332C21.3112 2.77264 20.5461 2.76603 20.0702 3.2401L19.6559 3.65089L21.357 5.39699Z"
                                fill="currentColor"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.125 3.00009C13.677 3.00009 14.125 3.44809 14.125 4.00009C14.125 4.55209 13.677 5.00009 13.125 5.00009H7C6.204 5.00009 5.441 5.31609 4.879 5.87909C4.316 6.44109 4 7.20409 4 8.00009V18.0001C4 18.7961 4.316 19.5591 4.879 20.1211C5.441 20.6841 6.204 21.0001 7 21.0001H17C17.796 21.0001 18.559 20.6841 19.121 20.1211C19.684 19.5591 20 18.7961 20 18.0001V11.8751C20 11.3231 20.448 10.8751 21 10.8751C21.552 10.8751 22 11.3231 22 11.8751V18.0001C22 19.3261 21.473 20.5981 20.536 21.5361C19.598 22.4731 18.326 23.0001 17 23.0001H7C5.674 23.0001 4.402 22.4731 3.464 21.5361C2.527 20.5981 2 19.3261 2 18.0001V8.00009C2 6.67409 2.527 5.40209 3.464 4.46409C4.402 3.52709 5.674 3.00009 7 3.00009H13.125Z"
                                fill="currentColor"
                            />
                        </svg>
                        <span style={{ fontSize: "1.5rem", fontWeight: 500 }}>New Chat</span>
                    </IconButton>

                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <IconButton onClick={() => setShowHistory(true)} title="Chat History">
                            <svg width="20" height="20" viewBox="0 0 75 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M39.6208 0C25.1868 0 12.78 8.7969 7.68339 21.3125L5.65214 17.7188C5.39137 17.2271 4.99899 16.8176 4.51886 16.5362C4.03874 16.2547 3.48978 16.1124 2.93339 16.125C2.4125 16.1366 1.90361 16.2837 1.45682 16.5517C1.01004 16.8197 0.640748 17.1995 0.385312 17.6536C0.129877 18.1077 -0.00290168 18.6205 4.80974e-05 19.1415C0.00299788 19.6626 0.141574 20.1738 0.402135 20.625L5.90214 30.4688C6.28447 31.1471 6.9155 31.6501 7.6619 31.8717C8.40831 32.0933 9.21163 32.0161 9.90214 31.6563L19.6834 26.6562C20.0509 26.4878 20.3806 26.2467 20.6526 25.9476C20.9247 25.6485 21.1335 25.2975 21.2665 24.9157C21.3995 24.5339 21.4539 24.1292 21.4265 23.7258C21.3992 23.3224 21.2905 22.9287 21.1072 22.5684C20.9239 22.208 20.6696 21.8884 20.3596 21.6288C20.0497 21.3692 19.6905 21.1749 19.3036 21.0576C18.9166 20.9403 18.51 20.9024 18.1081 20.9462C17.7061 20.99 17.3172 21.1146 16.9646 21.3125L13.3709 23.1562C17.6682 13.1024 27.7937 6 39.6208 6C55.3714 6 68.0271 18.5222 68.0271 34C68.0271 49.4777 55.3714 62 39.6208 62C26.1469 62 14.9234 52.7535 11.9646 40.4375C11.7781 39.6626 11.2915 38.9935 10.6116 38.5774C9.93181 38.1613 9.11454 38.0323 8.33961 38.2188C7.56468 38.4053 6.89557 38.892 6.47948 39.5718C6.06339 40.2516 5.9344 41.0689 6.12089 41.8438C9.72529 56.8475 23.4024 68 39.6208 68C58.5711 68 74.0271 52.7638 74.0271 34C74.0271 15.2361 58.5711 0 39.6208 0ZM39.9958 14.9375C39.5992 14.9416 39.2073 15.0243 38.8429 15.1808C38.4784 15.3373 38.1486 15.5646 37.8725 15.8494C37.5964 16.1342 37.3796 16.4709 37.2345 16.84C37.0894 17.2092 37.0189 17.6034 37.0271 18V34C37.0269 34.45 37.1278 34.8944 37.3226 35.3001C37.5173 35.7058 37.8008 36.0625 38.1521 36.3438L48.1521 44.3438C48.4599 44.5901 48.8132 44.7733 49.1918 44.8831C49.5704 44.9928 49.9669 45.0269 50.3587 44.9834C50.7504 44.9399 51.1298 44.8196 51.4751 44.6295C51.8204 44.4393 52.1249 44.183 52.3711 43.8752C52.6174 43.5674 52.8006 43.2141 52.9103 42.8355C53.02 42.4569 53.054 42.0604 53.0104 41.6686C52.9669 41.2769 52.8466 40.8975 52.6564 40.5522C52.4663 40.207 52.21 39.9025 51.9021 39.6563L43.0271 32.5625V18C43.0355 17.5982 42.963 17.1987 42.814 16.8254C42.6651 16.4522 42.4426 16.1126 42.1599 15.827C41.8771 15.5413 41.5399 15.3154 41.1681 15.1626C40.7964 15.0098 40.3977 14.9333 39.9958 14.9375Z" fill="currentColor"/>
                            </svg>
                            
                        </IconButton>
                        <IconButton onClick={() => setOpen(false)} title="Close" style={{ fontSize: "1.4rem" }}>
                            <svg width="14" height="14" viewBox="0 0 54 55" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "14px", height: "14px" }}>
                                <path fillRule="evenodd" clipRule="evenodd" d="M31.6229 27.2386L52.8327 6.03119C54.1364 4.72767 54.1404 2.61309 52.8385 1.31134C51.5276 0.000514909 49.4232 0.0121891 48.1181 1.31714L26.9083 22.5245L5.69852 1.31714C4.39486 0.0136272 2.28003 0.00959041 0.978137 1.31134C-0.332836 2.62216 -0.321161 4.72623 0.98394 6.03119L22.1938 27.2386L0.98394 48.446C-0.319722 49.7495 -0.323759 51.8641 0.978137 53.1658C2.28911 54.4767 4.39342 54.465 5.69852 53.16L26.9083 31.9526L48.1181 53.16C49.4218 54.4636 51.5366 54.4676 52.8385 53.1658C54.1495 51.855 54.1378 49.7509 52.8327 48.446L31.6229 27.2386Z" fill="currentColor"/>
                            </svg>
                        </IconButton>
                    </div>
                </TopBar>
                <MessageArea ref={messageAreaRef}>
                    {messages.map((m, i) => (
                        <MessageWrapper key={i} isUser={m.isUser}>
                            <Meta>
                                <Sender>{m.isUser ? "You" : "Sam"}</Sender>
                                <Time>{formatTimeWithTime(m.timestamp)}</Time>
                            </Meta>
                            {m.streaming && !m.text ? (
                                <Ellipsis>{dots}</Ellipsis>
                            ) : m.streaming && m.text ? (
                                <Message isUser={m.isUser}>
                                    <MessageContent>
                                        {m.sources && m.sources.length > 0
                                            ? insertCitationSuperscripts(m.text, m.sources)
                                            : convertUrlsToLinks(m.text)}
                                    </MessageContent>
                                    <span>{dots}</span>
                                </Message>
                            ) : (
                                <Fragment>
                                    <Message isUser={m.isUser}>
                                        <MessageContent>
                                                                                    {m.sources && m.sources.length > 0
                                            ? insertCitationSuperscripts(m.text, m.sources)
                                            : convertUrlsToLinks(m.text)}
                                        </MessageContent>
                                    </Message>
                                    {m.sources && m.sources.length > 0 && (
                                        <SourcesContainer>
                                            <div className="sources-label">{m.sources.length === 1 ? "Source" : "Sources"}</div>
                                            {m.sources.map(src => (
                                                <a
                                                    className="source-link"
                                                    key={src.index}
                                                    href={src.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title={src.title}
                                                >
                                                    <div className="source-card">
                                                        <div className="source-title-row">
                                                            <div className="source-number">{src.index}</div>
                                                            <div className="source-title">{src.title}</div>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </SourcesContainer>
                                    )}
                                    {m.showPrompts && (
                                        <PromptButtonsContainer>
                                        <span style={{ fontSize: "1.2rem", fontWeight: 500, color: "#9098b1", marginTop: "8px", marginBottom: "2px" }}>EXAMPLE QUESTIONS</span>
                                            {currentPrompts.map((prompt, index) => (
                                                <PromptButton
                                                    key={index}
                                                    onClick={() => handlePromptClick(prompt, prompt)}
                                                    disabled={isChatDisabled}
                                                >
                                                    {prompt}
                                                </PromptButton>
                                            ))}
                                        </PromptButtonsContainer>
                                    )}
                                </Fragment>
                            )}
                        </MessageWrapper>
                    ))}
                    
                    {/* Rate limit error display */}
                    {rateLimitError && (
                        <RateLimitError>
                            <div>{rateLimitError.message}</div>
                            <RateLimitInfo>
                                <div>Daily limit: {rateLimitError.limit} messages</div>
                                <div>Remaining: {rateLimitError.remaining} messages</div>
                                {countdown && (
                                    <RateLimitCountdown>
                                        Limit resets {countdown}
                                    </RateLimitCountdown>
                                )}
                            </RateLimitInfo>
                            <RetryButton 
                                onClick={() => setRateLimitError(null)}
                                disabled={countdown !== ""}
                            >
                                {countdown ? `Try again ${countdown}` : "Try again now"}
                            </RetryButton>
                        </RateLimitError>
                    )}
                    
                    <div ref={msgEndRef} />
                </MessageArea>
                {/* Overlay for history panel */}
                {showHistory && (
                  <HistoryOverlay visible={showHistory} onClick={() => setShowHistory(false)} />
                )}
                <HistoryPanel visible={showHistory} onClick={e => e.stopPropagation()}>
                    <HistoryHeader>
                        <HistorySearchInput
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <HistoryCloseButton onClick={() => setShowHistory(false)} title="Close">Close</HistoryCloseButton>
                    </HistoryHeader>
                    
                    <HistoryContent>
                        {filteredThreads.length === 0 ? (
                            <EmptyState>
                                <EmptyStateIcon>🔍</EmptyStateIcon>
                                <div>{searchQuery ? "No conversations found" : "No chat history yet"}</div>
                                <div style={{ fontSize: "1.2rem", marginTop: "0.5rem", opacity: 0.7 }}>
                                    {searchQuery ? "Try a different search term" : "Start a conversation to see your chat history here"}
                                </div>
                            </EmptyState>
                        ) : (
                            filteredThreads
                                .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
                                .map((thread) => (
                                    <ThreadItem key={thread.id} trashHovered={trashHovered}>
                                        <ThreadInfo onClick={() => openThread(thread)}>
                                            <ThreadName>{thread.name}</ThreadName>
                                            <ThreadDate>
                                                {formatTime(thread.created)} at{' '}
                                                {new Date(thread.created).toLocaleTimeString([], { 
                                                    hour: 'numeric', 
                                                    minute: '2-digit' 
                                                })}
                                            </ThreadDate>
                                        </ThreadInfo>
                                        <ThreadActions>
                                            <TrashIconButton
                                                className="trash-icon"
                                                onMouseEnter={() => setTrashHovered(true)}
                                                onMouseLeave={() => setTrashHovered(false)}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteThread(thread.id);
                                                }}
                                                title="Delete thread"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M56.8466 9.88636H51.9034H42.017V7.41477C42.017 3.32603 38.691 0 34.6023 0H24.7159C20.6272 0 17.3011 3.32603 17.3011 7.41477V9.88636H7.41477H2.47159C1.10666 9.88636 0 10.993 0 12.358C0 13.7229 1.10666 14.8295 2.47159 14.8295H4.94318V54.375C4.94318 62.5525 11.5952 69.2045 19.7727 69.2045H39.5455C47.7229 69.2045 54.375 62.5525 54.375 54.375V14.8295H56.8466C58.2115 14.8295 59.3182 13.7229 59.3182 12.358C59.3182 10.993 58.2115 9.88636 56.8466 9.88636ZM22.2443 7.41477C22.2443 6.05226 23.3534 4.94318 24.7159 4.94318H34.6023C35.9648 4.94318 37.0739 6.05226 37.0739 7.41477V9.88636H22.2443V7.41477ZM49.4318 54.375C49.4318 59.8263 44.9967 64.2614 39.5455 64.2614H19.7727C14.3215 64.2614 9.88636 59.8263 9.88636 54.375V14.8295H19.7727H39.5455H49.4318V54.375ZM39.5455 24.7159V54.375C39.5455 55.7399 38.4388 56.8466 37.0739 56.8466C35.7089 56.8466 34.6023 55.7399 34.6023 54.375V24.7159C34.6023 23.351 35.7089 22.2443 37.0739 22.2443C38.4388 22.2443 39.5455 23.351 39.5455 24.7159ZM24.7159 24.7159V54.375C24.7159 55.7399 23.6092 56.8466 22.2443 56.8466C20.8794 56.8466 19.7727 55.7399 19.7727 54.375V24.7159C19.7727 23.351 20.8794 22.2443 22.2443 22.2443C23.6092 22.2443 24.7159 23.351 24.7159 24.7159Z" fill="currentColor"/>
                                                </svg>
                                            </TrashIconButton>
                                        </ThreadActions>
                                    </ThreadItem>
                                ))
                        )}
                    </HistoryContent>
                    
                    <HistoryActions>
                        <NewChatButton
                            onClick={() => {
                                setShowHistory(false);
                                startNewChat();
                            }}
                        >
                            New Chat
                        </NewChatButton>
                    </HistoryActions>
                </HistoryPanel>
                <BottomBar focused={focused} onSubmit={(e) => sendMessage(undefined, undefined, e)}>
                    <InputContainer>
                        <StyledInput
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            disabled={isChatDisabled}
                        />
                        {!input && (
                            <InputPlaceholder>
                                {showShimmer ? (
                                    <ShimmerText
                                        shimmerColor="#4a90e2"
                                        baseColor="#b2b8c7"
                                        duration={1200}
                                    >
                                        {currentShimmerWord}...
                                    </ShimmerText>
                                ) : (
                                    rateLimitError ? "Rate limited - try again later" : "Type a message..."
                                )}
                            </InputPlaceholder>
                        )}
                    </InputContainer>
                    <SendButton type="submit" visible={!!input.trim() && !isChatDisabled}>
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(-90deg)" }}>
                            <path d="M5 12h14M13 5l7 7-7 7" stroke="white" />
                        </svg>
                    </SendButton>
                </BottomBar>
            </ChatBox>
        </ChatWrapper>
    );
};

const MobileOverlay = styled.div<{ visible: boolean }>`
  display: none;
  
  @media (max-width: 600px) {
    display: ${props => (props.visible ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9998;
    pointer-events: ${props => (props.visible ? 'auto' : 'none')};
    opacity: ${props => (props.visible ? 1 : 0)};
    transition: opacity 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`;

const HistoryOverlay = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99;
  opacity: ${props => (props.visible ? 1 : 0)};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
  transform: ${props => (props.visible ? 'scale(1)' : 'scale(0.95)')};
  transition: all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 0 0 10px 10px;
  /* Safari and mobile browser compatibility for backdrop-filter */
  -webkit-backdrop-filter: ${props => (props.visible ? 'blur(2px)' : 'blur(0px)')};
  backdrop-filter: ${props => (props.visible ? 'blur(2px)' : 'blur(0px)')};
  
  /* Mobile-specific fixes */
  @media (max-width: 768px) {
    /* Reduce blur on mobile for better performance */
    -webkit-backdrop-filter: ${props => (props.visible ? 'blur(1px)' : 'blur(0px)')};
    backdrop-filter: ${props => (props.visible ? 'blur(1px)' : 'blur(0px)')};
  }
`;

const HistorySearchInput = styled.input`
  flex: 1;
  border: 1px solid #e7eaf2;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  font-size: 1.4rem;
  background: #fff;
  color: #222;
  outline: none;
  transition: border-color 0.2s ease;
  margin-right: 1rem;
  
  &:focus {
    border-color: #000;
  }
  
  &::placeholder {
    color: #b2b8c7;
  }
`;

export default PortfolioChatBot;



