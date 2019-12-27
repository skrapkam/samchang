/** @jsx jsx */
import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { jsx } from "@emotion/core";
import { throttle } from "throttle-debounce";

const Header = styled.div`
  padding: 32px 40px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 999;
  background: #fff;
  box-shadow: ${props =>
    props.showHeaderShadow ? "rgba(0, 0, 0, 0.04) 0px 1px 0px" : "none"};
  @media (max-width: 950px) {
    padding: 32px 24px 32px;
  }

  @media (max-width: 425px) {
    padding: 24px 24px 24px;
    position: fixed;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.04) 0px 1px 0px;
    background-color: #fff;
    top: 0;
    z-index: 999;
  }
`;

export default function ScrollHeader({ children }) {
  const [showHeaderShadow, setHeaderShadow] = useState(false);

  function handleScroll() {
    const headerShadowState = window && window.pageYOffset > 0;
    setHeaderShadow(headerShadowState);
  }

  const throttledScroll = throttle(300, handleScroll); //delay

  useEffect(() => {
    if (window) {
      window.addEventListener("scroll", throttledScroll);
    }

    return () => {
      if (window) {
        window.removeEventListener("scroll", throttledScroll);
      }
    };
  }, []);

  return <Header showHeaderShadow={showHeaderShadow}>{children}</Header>;
}
