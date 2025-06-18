/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useState, useEffect, useRef, Fragment } from "react";
import { useChat } from "./ChatContext";

const CHAT_API_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/chat"
        : "https://sam-chat-api.vercel.app/api/chat";

// Utility function to detect URLs and convert them to clickable links
const convertUrlsToLinks = (text: string) => {
    // URL regex pattern that matches http/https URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
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
  overflow: visible;
  transform-origin: bottom right;
  transform: scale(${props => (props.visible ? 1 : 0.8)});
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: all 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
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

const MessageArea = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1.1rem 1.8rem 3rem 1.8rem;
  background: #f9fafd;
`;

const MessageWrapper = styled.div<{ iser?: boolean }>`
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

const BottomBar = styled.form<{ focused: boolean }>`
  height: 52px; /* Set a fixed height */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #e7eaf2;
  box-shadow: ${(props) => (props.focused ? "0 0 0 1px #000" : "none")};
  border-color: ${(props) => (props.focused ? "#000" : "#e7eaf2")};
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
};

const getInitialMsg = (): ChatMessage => ({
    text: "Hi! I'm Sam. Feel free to ask me anything about my background, projects, or interests.",
    isUser: false,
    timestamp: new Date().toISOString(),
    showPrompts: true
});

function formatTime(iso: string) {
    const date = new Date(iso);
    return isNaN(date.getTime()) ? "" : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

async function fetchStreamedResponse(message: string, conversationHistory: ChatMessage[], onChunk: (text: string) => void) {
    const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            userMessage: message,
            conversationHistory: conversationHistory
        }),
    });

    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error("Failed to get response reader");
    }
    
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n").filter(line => line.startsWith("data: "));
            let text = "";
            for (const line of lines) {
                const chunk = line.replace("data: ", "");
                if (chunk === "[DONE]") return;
                text += chunk;
            }
            if (text) onChunk(text);
            buffer = buffer.split("\n").filter(l => !l.startsWith("data: ")).join("\n");
        }
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

const PortfolioChatBot = () => {
    const { open, setOpen, initialApiPrompt, setInitialApiPrompt, initialDisplayPrompt, setInitialDisplayPrompt } = useChat();
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        try {
            const stored = localStorage.getItem("portfolioChatHistory");
            if (stored) return JSON.parse(stored);
        } catch { }
        return [getInitialMsg()];
    });
    const [input, setInput] = useState("");
    const [focused, setFocused] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const msgEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dots = useEllipsis();

    const [isScrollable, setIsScrollable] = useState(false);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    
    const [currentPrompts, setCurrentPrompts] = useState(getRandomPrompts());
    
    // Function to detect project context from current URL
    const getProjectContextFromURL = () => {
        if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            if (path.includes('/your-work')) return 'Your Work';
            if (path.includes('/designer-onboarding') || path.includes('/onboarding')) return 'Onboarding';
            if (path.includes('/google')) return 'Google';
            if (path.includes('/music')) return 'Music';
            if (path.includes('/info')) return 'Info';
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
        msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    useEffect(() => {
        localStorage.setItem("portfolioChatHistory", JSON.stringify(messages));
    }, [messages]);

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
            inputRef.current?.focus();
        }
    }, [open]);

    useEffect(() => {
        if (!isStreaming) {
            inputRef.current?.focus();
        }
    }, [isStreaming]);

    const sendMessage = async (
        displayText?: string, // Used for displaying in UI
        apiPrompt?: string,   // Used for sending to API
        e?: React.FormEvent
    ) => {
        e?.preventDefault();
        const textToDisplay = displayText ?? input.trim();
        const textToSendToApi = apiPrompt ?? textToDisplay;

        if (!textToDisplay || isStreaming) return; // Use textToDisplay for check

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

        setMessages(prev => [...prev, { text: "", isUser: false, timestamp: now, streaming: true }]);

        // Get the conversation history up to the current user message (excluding the streaming message)
        const conversationHistory = messages.concat(userMessage);

        let streamedText = "";
        await fetchStreamedResponse(finalApiText, conversationHistory, chunk => { // Use finalApiText with context
            streamedText += chunk;
            setMessages(prev => {
                const newMsgs = [...prev];
                const i = newMsgs.findIndex(m => m.streaming);
                if (i !== -1) newMsgs[i] = { ...newMsgs[i], text: streamedText };
                return newMsgs;
            });
        });

        setMessages(prev => prev.map(m => m.streaming ? { ...m, streaming: false } : m));
        setIsStreaming(false);
    };

    // Reset chat and show prompts
    const resetChat = () => {
        setCurrentPrompts(getRandomPrompts());
        setMessages([getInitialMsg()]);
    };

    // Helper for clickable prompts: pass both clean and contextualized prompt
    const handlePromptClick = (cleanText: string, contextualizedPrompt: string) => {
        sendMessage(cleanText, contextualizedPrompt);
    };

    return (
        <ChatWrapper x={30} y={30}>
            <ChatButton onClick={() => setOpen(!open)} isOpen={open} aria-label="Open chat">💬 Chat</ChatButton>
            <ChatBox visible={open}>
            <TopBar showBorder={isScrollable}>
                    <IconButton onClick={resetChat} title="New Chat">
                        <svg
                            width="25"
                            height="24"
                            viewBox="0 0 25 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginRight: "2px" }}
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
                    <IconButton onClick={() => setOpen(false)} title="Close" style={{ fontSize: "2rem"}}>×</IconButton>
                </TopBar>
                <MessageArea ref={messageAreaRef}>
                    {messages.map((m, i) => (
                        <MessageWrapper key={i} isUser={m.isUser}>
                            <Meta>
                                <Sender>{m.isUser ? "You" : "Sam"}</Sender>
                                <Time>{formatTime(m.timestamp)}</Time>
                            </Meta>
                            {m.streaming && !m.text ? (
                                <Ellipsis>{dots}</Ellipsis>
                            ) : m.streaming && m.text ? (
                                <Message isUser={m.isUser}>
                                    {convertUrlsToLinks(m.text)}
                                    <span>{dots}</span>
                                </Message>
                            ) : (
                                <Fragment>
                                    <Message isUser={m.isUser}>
                                        {convertUrlsToLinks(m.text)}
                                    </Message>
                                    {m.showPrompts && (
                                        <PromptButtonsContainer>
                                        <span style={{ fontSize: "1.2rem", fontWeight: 500, color: "#9098b1", marginTop: "8px", marginBottom: "2px" }}>EXAMPLE QUESTIONS</span>
                                            {currentPrompts.map((prompt, index) => (
                                                <PromptButton
                                                    key={index}
                                                    onClick={() => handlePromptClick(prompt, prompt)}
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
                    <div ref={msgEndRef} />
                </MessageArea>
                <BottomBar focused={focused} onSubmit={(e) => sendMessage(undefined, undefined, e)}>
                    <Input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder="Type a message..."
                        disabled={isStreaming}
                    />
                    <SendButton type="submit" visible={!!input.trim() && !isStreaming}>
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(-90deg)" }}>
                            <path d="M5 12h14M13 5l7 7-7 7" stroke="white" />
                        </svg>
                    </SendButton>
                </BottomBar>
            </ChatBox>

        </ChatWrapper>
    );
};

export default PortfolioChatBot;



