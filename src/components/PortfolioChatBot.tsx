/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useState, useEffect, useRef } from "react";

const CHAT_API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/chat"
    : "https://sam-chat-api.vercel.app/api/chat";

const ChatWrapper = styled.div<{ x: number; y: number }>`
  position: fixed;
  z-index: 9999;
  bottom: ${(props) => props.y}px;
  right: ${(props) => props.x}px;
`;

const ChatButton = styled.button`
background-color: transparent;
user-select: none; /* Standard syntax */

backdrop-filter: blur(2px);
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

const ChatBox = styled.div`
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
  padding: 0 0 0.5rem 0;
  box-shadow: 0 8px 28px rgba(50, 60, 120, 0.13);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.7rem 0.6rem 0.9rem;
  border-bottom: 1px solid #e7eaf2;
  background: #f5f7fa;
  height: 5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #b2b8c7;
  font-size: 1.2rem;
  padding: 2px 6px;
  cursor: pointer;
  transition: color 0.18s;
  &:hover {
    color: #6267a2;
  }
  display: flex;
  align-items: center;
`;

const MessageArea = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1.1rem 1rem 0.3rem 1rem;
  background: #f9fafd;
`;

const MessageWrapper = styled.div<{ isUser?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  margin-bottom: 14px;
`;

const Meta = styled.div`
  font-size: 1rem;
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

const BottomBar = styled.form<{ focused: boolean }>`
  display: flex;
  align-items: center;
  border-top: 1px solid #e7eaf2;
  background: #fff;
  border: ${(props) => (props.focused ? "2px solid #000" : "1px solid #e7eaf2")};
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
  font-size: 1.4rem;
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

const MIN_HEIGHT = 350;
const MAX_HEIGHT = 520;

type ChatMessage = {
  text: string;
  isUser: boolean;
  timestamp: string;
  streaming?: boolean;
};

const getInitialMsg = (): ChatMessage => ({
  text: "Hi! I'm Sam. Feel free to ask me anything about my background, projects, or interests.",
  isUser: false,
  timestamp: new Date().toISOString(),
});

function formatTime(iso: string) {
  const date = new Date(iso);
  return isNaN(date.getTime()) ? "" : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

async function fetchStreamedResponse(message: string, onChunk: (text: string) => void) {
  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userMessage: message }),
  });

  const reader = response.body?.getReader();
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

const PortfolioChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem("portfolioChatHistory");
      if (stored) return JSON.parse(stored);
    } catch {}
    return [getInitialMsg()];
  });
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const msgEndRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    localStorage.setItem("portfolioChatHistory", JSON.stringify(messages));
  }, [messages]);


  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    const now = new Date().toISOString();
    const userMessage = { text: input, isUser: true, timestamp: now };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    setMessages(prev => [...prev, { text: "", isUser: false, timestamp: now, streaming: true }]);

    let streamedText = "";
    await fetchStreamedResponse(input, chunk => {
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

  return (
    <ChatWrapper x={30} y={30}>
      <ChatButton onClick={() => setOpen(!open)}>💬 Chat</ChatButton>
      {open && (
        <ChatBox>
          <TopBar>
          <IconButton onClick={() => setMessages([getInitialMsg()])} title="New chat">
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
  <span style={{ marginLeft: "6px", fontSize: "0.95rem", color: "#5e647a" }}>New chat</span>
</IconButton>
            <IconButton onClick={() => setOpen(false)} title="Close">×</IconButton>
          </TopBar>
          <MessageArea>
            {messages.map((m, i) => (
              <MessageWrapper key={i} isUser={m.isUser}>
                <Meta>
                  <Sender>{m.isUser ? "You" : "Sam"}</Sender>
                  <Time>{formatTime(m.timestamp)}</Time>
                </Meta>
                <Message isUser={m.isUser}>{m.text}</Message>
              </MessageWrapper>
            ))}
            <div ref={msgEndRef} />
          </MessageArea>
          <BottomBar focused={focused} onSubmit={sendMessage}>
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Ask a question"
              disabled={isStreaming}
            />
            <SendButton type="submit" visible={!!input.trim() && !isStreaming}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(-90deg)" }} >
                <path d="M5 12h14M13 5l7 7-7 7" stroke="white" />
              </svg>
            </SendButton>
          </BottomBar>
        </ChatBox>
      )}
    </ChatWrapper>
  );
};

export default PortfolioChatBot;
