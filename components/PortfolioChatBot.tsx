/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { useState, useRef, useEffect, FormEvent } from 'react';

const Bubble = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--border);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  font-size: 24px;
`;

const Window = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 320px;
  max-height: 400px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Messages = styled.div`
  flex: 1;
  padding: 8px;
  overflow-y: auto;
`;

const InputBar = styled.form`
  display: flex;
  border-top: 1px solid var(--border);

  input {
    flex: 1;
    border: none;
    padding: 8px;
    outline: none;
  }

  button {
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    background: var(--bg);
    border-left: 1px solid var(--border);
  }
`;

const MessageBubble = styled.div<{ from: 'user' | 'bot' }>`
  background: ${p => (p.from === 'user' ? '#daf1ff' : '#f0f0f0')};
  align-self: ${p => (p.from === 'user' ? 'flex-end' : 'flex-start')};
  margin: 4px 0;
  padding: 6px 8px;
  border-radius: 4px;
  max-width: 85%;
`;

type ChatMessage = { from: 'user' | 'bot'; text: string };

export default function PortfolioChatBot({ projectSlug }: { projectSlug: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userText }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: userText, projectSlug }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { from: 'bot', text: data.reply ?? 'No reply.' }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Error getting reply.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      <Bubble onClick={() => setOpen(o => !o)}>💬</Bubble>
      {open && (
        <Window>
          <Messages>
            {messages.map((m, i) => (
              <MessageBubble key={i} from={m.from}>
                {m.text}
              </MessageBubble>
            ))}
            {loading && <MessageBubble from="bot">...</MessageBubble>}
            <div ref={endRef} />
          </Messages>
          <InputBar onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Sam..."
            />
            <button type="submit">Send</button>
          </InputBar>
        </Window>
      )}
    </>
  );
}
