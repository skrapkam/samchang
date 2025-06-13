/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useState, useEffect, useRef } from "react";

const ChatWrapper = styled.div`
  position: fixed;
  z-index: 999;
`;

const ChatButton = styled.button`
  background: #111;
  color: #fff;
  padding: 1rem;
  border-radius: 50%;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
`;

const ChatBox = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 300px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const Message = styled.div<{ isUser?: boolean }>`
  text-align: ${props => (props.isUser ? "right" : "left")};
  margin: 0.5rem 0;
  background: ${props => (props.isUser ? "#def" : "#eee")};
  padding: 0.5rem;
  border-radius: 6px;
`;

type ChatMessage = { text: string; isUser: boolean };

const PortfolioChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("portfolioChatHistory");
      if (stored) {
        try {
          return JSON.parse(stored) as ChatMessage[];
        } catch {}
      }
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const dragRef = useRef<{x: number; y: number} | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("portfolioChatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  const startDrag = (e: React.MouseEvent) => {
    dragRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", endDrag);
  };

  const onDrag = (e: MouseEvent) => {
    if (!dragRef.current) return;
    setPosition({
      x: e.clientX - dragRef.current.x,
      y: e.clientY - dragRef.current.y,
    });
  };

  const endDrag = () => {
    dragRef.current = null;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", endDrag);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", endDrag);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage: input,
        projectSlug: window.location.pathname.replace(/^\/|\/$/g, ""),
      }),
    });

    const data = await res.json();
    const botMessage = { text: data.reply, isUser: false };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <ChatWrapper
      style={{ bottom: position.y, right: position.x }}
      onMouseDown={startDrag}
    >
      <ChatButton onClick={() => setOpen(!open)}>💬</ChatButton>
      {open && (
        <ChatBox>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {messages.map((m, i) => (
              <Message key={i} isUser={m.isUser}>{m.text}</Message>
            ))}
          </div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask something..."
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
        </ChatBox>
      )}
    </ChatWrapper>
  );
};

export default PortfolioChatBot;
