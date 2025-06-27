/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useRef, useState, useEffect } from "react";
import { useBypassToken } from "./useBypassToken";

/**
 * Invisible hit-area in the top-right corner.
 * When clicked/tapped 3× within 1 second, a login panel is toggled.
 */
const HitArea = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  z-index: 9999;
  /* Invisible but still clickable */
  background: transparent;
`;

const Panel = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 260px;
  background: #ffffff;
  border: 1px solid #e5e7eb; /* Tailwind's gray-200 */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  padding: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.6rem;
  font-size: 1.4rem;
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 6px;
  &:focus {
    outline: none;
    border-color: #3b82f6; /* blue-500 */
  }
`;

const Button = styled.button`
  background: #3b82f6; /* blue-500 */
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0.6rem;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background: #2563eb; /* blue-600 */
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 1.6rem;
  color: #6b7280; /* gray-500 */
  cursor: pointer;
`;

const SecretBypassToggle = () => {
  const [isClient, setIsClient] = useState(false);
  const clickTimestamps = useRef<number[]>([]);
  const [visible, setVisible] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [, setBypassToken] = useBypassToken();

  // Ensure component only renders on client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const registerClick = () => {
    const now = Date.now();
    clickTimestamps.current.push(now);
    // Keep only the last 3 timestamps
    if (clickTimestamps.current.length > 3) {
      clickTimestamps.current.shift();
    }

    if (
      clickTimestamps.current.length === 3 &&
      now - clickTimestamps.current[0] <= 1000
    ) {
      setVisible((v) => !v);
      clickTimestamps.current = [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBypassToken(tokenInput.trim() || undefined);
    setTokenInput("");
    setVisible(false);
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  return (
    <>
      <HitArea onClick={registerClick} onTouchStart={registerClick} />
      {visible && (
        <Panel>
          <CloseBtn onClick={() => setVisible(false)}>×</CloseBtn>
          <label
            css={css`
              font-size: 1.3rem;
              color: #374151; /* gray-700 */
              font-weight: 500;
            `}
          >
            Bypass Token
          </label>
          <form onSubmit={handleSubmit} css={css`display: flex; gap: 0.5rem;`}>
            <Input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Enter token"
            />
            <Button type="submit">Save</Button>
          </form>
        </Panel>
      )}
    </>
  );
};

export default SecretBypassToggle; 