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

const saveCurrentThread = (messages: ChatMessage[], threadId: string, name?: string) => {
    // Don't save empty threads (only assistant message, no user messages)
    if (messages.length <= 1 || !messages.some(m => m.isUser)) return;

    const thread: ChatThread = {
        id: threadId,
        name: name || generateThreadName(messages),
        created: messages[0]?.timestamp || new Date().toISOString(),
        messages: messages.filter(m => !m.streaming) // Don't save streaming messages
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

// Utility function to detect URLs and convert them to clickable links
const convertUrlsToLinks = (text: string) => {
    // If no URLs or markdown links, just return the text as-is to preserve spacing
    if (!text.includes('http') && !text.includes('[')) {
        return text;
    }
    
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
                parts.push(processedText.slice(lastIndex, matchIndex));
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
            parts.push(processedText.slice(lastIndex));
        }
        
        return parts;
    }
    
    // Handle plain URLs that weren't already converted
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = processedText.split(urlRegex);
    
    return parts.map((part, index) => {
        if (urlRegex.test(part)) {
            return (
                <StyledLink 
                    key={index} 
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    {part}
                </StyledLink>
            );
        }
        // Return the text part as-is to preserve original spacing
        return part;
    });
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
  backdrop-filter: blur(8px);
  color: #000;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  font-size: 1.7rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  transition: box-shadow 0.2s;

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
  padding: 1rem 0.7rem 1rem 0.9rem;
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
  height: 75%;
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
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e7eaf2;
  background: #f9fafd;
`;

const HistoryTitle = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: #222;
`;

const HistoryCloseButton = styled(IconButton)`
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
`;

const HistoryContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
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
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #464646;
  }
`;

const ThreadItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 2rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
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
  &:hover {
    background: #dfdfdf;
    text-decoration: none;
  }
`;

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
    "What are your technical skills?",
    "What's your favorite programming language?",
    "Tell me about your education",
    "What are your hobbies?",
    "What's your work style?",
    "What are your career goals?",
    "What's your favorite project you've worked on?",
    "What technologies are you most passionate about?",
    "What's your approach to problem-solving?",
    "What do you do for fun?"
];

const getRandomPrompts = () => {
    const shuffled = [...ALL_PROMPTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
};

// Add after helper functions
function postProcessText(text: string) {
    return text
        .replace(/([.!?])([A-Z])/g, "$1 $2")  // ensure space after .,!,? if missing
        .replace(/:([A-Za-z0-9])/g, ": $1")    // ensure space after colon if missing
        .replace(/([a-zA-Z])(\d)/g, "$1 $2")   // ensure space between letter and number (e.g., "at99designs" -> "at 99designs")
        .replace(/(\d)([a-zA-Z])/g, "$1 $2")   // ensure space between number and letter (e.g., "99designs" -> "99 designs" if needed)
        // Fix email addresses with missing @ symbol or double @ symbols
        .replace(/([a-zA-Z]+)\s+(\d+)\s*@\s*([a-zA-Z]+)\s*@\s*([a-zA-Z]+\.[a-zA-Z]+)/g, "$1$2@$4")
        .replace(/([a-zA-Z]+)\s+(\d+)\s+([a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+)/g, "$1$2@$3")
        .replace(/([a-zA-Z]+)\s+(\d+)\s*@\s*([a-zA-Z]+\.[a-zA-Z]+)/g, "$1$2@$3")
        // Fix social media handles with missing @ symbol
        .replace(/(Instagram|X|Twitter):\s*([A-Za-z0-9_]+)/gi, "$1: @$2")
        // Fix LinkedIn URLs and names
        .replace(/LinkedIn:\s*([A-Za-z\s]+)(?:\s*-\s*\d+)?/g, "LinkedIn: $1")
        // Ensure sentences end with proper punctuation
        .replace(/([a-zA-Z])\s*$/g, "$1.")  // add period if sentence doesn't end with punctuation
        .replace(/\s{2,}/g, " ");             // collapse multiple spaces
}

// Function to strip HTML tags, particularly figcaption tags
function stripHtmlTags(text: string): string {
    return text
        // Remove figcaption tags and their content
        .replace(/<figcaption[^>]*>.*?<\/figcaption>/gi, '')
        // Remove any other HTML tags
        .replace(/<[^>]*>/g, '')
        // Clean up extra whitespace that might be left after removing tags
        .replace(/\s+/g, ' ')
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
  
  // First try the [[cite:slug#section]] format
  const citationRegex = /\[\[cite:([^#\]]+)#([^\]]+)\]\]/g;
  let citationIndex = 1;
  let match;
  const citations: Array<{match: string, index: number, position: number, slug: string, section: string}> = [];

  // First pass: collect all citations with their positions
  while ((match = citationRegex.exec(rawText)) !== null) {
    const [fullMatch, slug, section] = match;
    
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
    cleanText = cleanText.replace(/\s+/g, ' ')
      .replace(/\s+([.!?])/g, '$1')
      .replace(/([.!?])\s+\[/g, '$1 [')
      .replace(/,\s*\./g, '.')
      .replace(/,\s*,/g, ',');
    
    mainText = cleanText.trim();
  }

  // If no [[cite:]] format found, look for inline citations throughout the text
  if (sources.length === 0) {
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
        const citationNumbers = new Set<number>();
        matches.forEach(match => {
          const num = parseInt(match[1], 10);
          citationNumbers.add(num);
        });
        Array.from(citationNumbers).sort((a, b) => a - b).forEach(num => {
          sources.push({
            index: num,
            title: `Reference ${num}`,
            url: '#',
            slug: `reference-${num}`,
            section: `citation-${num}`
          });
        });
        // Convert (1) format to [1] format for consistency
        if (pattern.source === '\\((\\d+)\\)') {
          mainText = mainText.replace(/\((\d+)\)/g, '[$1]');
        }
        break; // Use the first pattern that finds matches
      }
    }
    // If no inline citations found, check for trailing numbers (non-global regex)
    if (!foundCitations) {
      const endingNumbers = mainText.match(/(\d+)\s*$/);
      if (endingNumbers) {
        const numbers = endingNumbers[1].split('');
        let newText = mainText.slice(0, mainText.lastIndexOf(endingNumbers[1])).trim();
        // Normalize the text
        newText = newText.replace(/\s+/g, ' ');
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
              title: `Reference ${citationCount}`,
              url: '#',
              slug: `reference-${citationCount}`,
              section: `citation-${citationCount}`
            });
            processedSentence += ` [${citationCount}]`;
          }
          return processedSentence;
        });
        mainText = processedSentences.join(' ').trim();
      }
    }
    // If still no citations found, check for structured content with trailing numbers
    if (sources.length === 0) {
      const endingNumbers = mainText.match(/(\d+)\s*$/);
      if (endingNumbers) {
        const numbers = endingNumbers[1].split('');
        let newText = mainText.slice(0, mainText.lastIndexOf(endingNumbers[1])).trim();
        // Normalize the text
        newText = newText.replace(/\s+/g, ' ');
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
                title: `Reference ${citationCount}`,
                url: '#',
                slug: `reference-${citationCount}`,
                section: `citation-${citationCount}`
              });
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
  return { mainText, sources };
}

function insertCitationSuperscripts(text: string, sources: Source[]): (string | JSX.Element)[] {
  if (!sources?.length) return [text];

  const parts: (string | JSX.Element)[] = [];
  const regex = /\[(\d+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the citation
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
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

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

const PortfolioChatBot = () => {
    const { open, setOpen, initialApiPrompt, setInitialApiPrompt, initialDisplayPrompt, setInitialDisplayPrompt } = useChat();
    
    // Thread Management State
    const [currentThreadId, setCurrentThreadIdState] = useState<string>(() => getCurrentThreadId() || generateThreadId());
    const [showHistory, setShowHistory] = useState(false);
    const [threads, setThreads] = useState<ChatThread[]>(() => getThreads());
    
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
    const msgEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dots = useEllipsis();

    const [isScrollable, setIsScrollable] = useState(false);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    
    const [currentPrompts, setCurrentPrompts] = useState(getRandomPrompts());
    
    const [sessionId, setSessionId] = useState<string>(() => getOrCreateSessionId());

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
        if (messages.length > 1 && messages.some(m => m.isUser)) {
            saveCurrentThread(messages, currentThreadId);
            setThreads(getThreads()); // Refresh threads list
        }
    }, [messages, currentThreadId]);
    
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
            if (path.includes('/ladder/affordability')) return 'Ladder Affordability';
            if (path.includes('/ladder/billing-checkout')) return 'Ladder Billing Checkout';
            if (path.includes('/ladder/design-leadership')) return 'Ladder Design Leadership';
            if (path.includes('/ladder/first-payment-failure')) return 'Ladder First Payment Failure';
            if (path.includes('/ladder/reroute')) return 'Ladder Reroute';
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

        setMessages(prev => [...prev, { text: "", isUser: false, timestamp: now, streaming: true }]);

        try {
            let streamedText = "";
            await fetchStreamedResponse(finalApiText, sessionId, chunk => {
                streamedText += chunk;
                setMessages(prev => {
                    const newMsgs = [...prev];
                    const i = newMsgs.findIndex(m => m.streaming);
                    if (i !== -1) newMsgs[i] = { ...newMsgs[i], text: streamedText };
                    return newMsgs;
                });
            }, (newSessionId) => {
                setSessionId(newSessionId);
            });

            const { mainText, sources } = parseSourcesSection(postProcessText(stripHtmlTags(streamedText)));
            setMessages(prev => prev.map(m => m.streaming ? { ...m, streaming: false, text: mainText, sources } : m));
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
    const startNewChat = () => {
        // Save current thread if it has user messages
        if (messages.length > 1 && messages.some(m => m.isUser)) {
            saveCurrentThread(messages, currentThreadId);
        }
        
        // Create new thread
        const newThreadId = generateThreadId();
        setCurrentThreadIdState(newThreadId);
        setCurrentPrompts(getRandomPrompts());
        setMessages([getInitialMsg()]);
        setRateLimitError(null);
        setSessionId(generateSessionId());
        setThreads(getThreads()); // Refresh threads list
    };

    const openThread = (thread: ChatThread) => {
        // Save current thread before switching
        if (messages.length > 1 && messages.some(m => m.isUser)) {
            saveCurrentThread(messages, currentThreadId);
        }
        
        setCurrentThreadIdState(thread.id);
        setMessages(thread.messages);
        setShowHistory(false);
        setRateLimitError(null);
        setThreads(getThreads()); // Refresh threads list
    };

    const handleDeleteThread = (threadId: string) => {
        deleteThread(threadId);
        setThreads(getThreads());
        
        // If deleting current thread, start a new one
        if (threadId === currentThreadId) {
            startNewChat();
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

    return (
        <ChatWrapper x={30} y={30}>
            <ChatButton onClick={() => setOpen(!open)} isOpen={open} aria-label="Open chat">💬 Chat</ChatButton>
            <MobileOverlay visible={open} />
            <ChatBox visible={open}>
                <TopBar showBorder={isScrollable}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <IconButton onClick={() => setShowHistory(true)} title="Chat History">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M8 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M7 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span style={{ fontSize: "1.5rem", fontWeight: 500 }}>History</span>
                        </IconButton>
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
                    </div>
                    <IconButton onClick={() => setOpen(false)} title="Close" style={{ fontSize: "2rem"}}>×</IconButton>
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
                                    {m.sources && m.sources.length > 0
                                        ? insertCitationSuperscripts(m.text, m.sources)
                                        : (m.text.includes('http') || m.text.includes('['))
                                            ? convertUrlsToLinks(m.text)
                                            : m.text}
                                    <span>{dots}</span>
                                </Message>
                            ) : (
                                <Fragment>
                                    <Message isUser={m.isUser}>
                                        {m.sources && m.sources.length > 0
                                            ? insertCitationSuperscripts(m.text, m.sources)
                                            : (m.text.includes('http') || m.text.includes('['))
                                                ? convertUrlsToLinks(m.text)
                                                : m.text}
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
                        <HistoryTitle>Chat History</HistoryTitle>
                        <HistoryCloseButton onClick={() => setShowHistory(false)} title="Close">Close</HistoryCloseButton>
                    </HistoryHeader>
                    
                    <HistoryContent>
                        {threads.length === 0 ? (
                            <EmptyState>
                                <EmptyStateIcon>💬</EmptyStateIcon>
                                <div>No chat history yet</div>
                                <div style={{ fontSize: "1.2rem", marginTop: "0.5rem", opacity: 0.7 }}>
                                    Start a conversation to see your chat history here
                                </div>
                            </EmptyState>
                        ) : (
                            threads
                                .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
                                .map((thread) => (
                                    <ThreadItem key={thread.id}>
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
                                            <ThreadActionButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openThread(thread);
                                                }}
                                                title="Open thread"
                                            >
                                                📂
                                            </ThreadActionButton>
                                            <ThreadActionButton
                                                className="delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Are you sure you want to delete this conversation?')) {
                                                        handleDeleteThread(thread.id);
                                                    }
                                                }}
                                                title="Delete thread"
                                            >
                                                🗑️
                                            </ThreadActionButton>
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
                                        Thinking...
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
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: ${props => (props.visible ? 1 : 0)};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`;

export default PortfolioChatBot;



