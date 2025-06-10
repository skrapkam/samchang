/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import { throttle } from 'throttle-debounce';

// Test locally by running `gatsby develop` and opening two tabs:
// one with `?controller=true` to broadcast, and another without to view.

export const WS_SERVER = 'ws://localhost:8080';

const Cursor = styled.div`
  pointer-events: none;
  position: absolute;
  width: 32px;
  height: 32px;
  margin-left: -16px;
  margin-top: -16px;
  border-radius: 50%;
  background: rgba(0, 125, 255, 0.4);
  transition: transform 0.08s linear;
  z-index: 10000;
`;

export default function RemoteCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const isController =
      new URLSearchParams(window.location.search).get('controller') === 'true';

    const socket = new WebSocket(WS_SERVER);
    socketRef.current = socket;

    const sendPosition = throttle(16, (x: number, y: number) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ x, y }));
      }
    });

    const handleMove = (e: MouseEvent) => {
      if (isController) {
        sendPosition(e.clientX, e.clientY);
      }
    };

    if (isController) {
      window.addEventListener('mousemove', handleMove);
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const { x, y } = JSON.parse(event.data);
        const node = cursorRef.current;
        if (node) {
          node.style.transform = `translate(${x}px, ${y}px)`;
        }
      } catch (err) {
        // ignore invalid messages
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      if (isController) {
        window.removeEventListener('mousemove', handleMove);
      }
      socket.removeEventListener('message', handleMessage);
      socket.close();
    };
  }, []);

  return <Cursor ref={cursorRef} />;
}

