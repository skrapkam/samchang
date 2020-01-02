/** @jsx jsx */
import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { jsx } from "@emotion/core";
import { throttle } from "throttle-debounce";
import { mq } from "../../styles/styles";
import defaultTheme from "../Theme"

const Header = styled.div`
  padding: ${defaultTheme.space[4]} ${defaultTheme.space[5]};
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 999;
  background: #fff;
  box-shadow: ${props =>
    props.showHeaderShadow ? "rgba(0, 0, 0, 0.04) 0px 1px 0px" : "none"};

  ${mq[1]} {
    padding: ${defaultTheme.space[4]} ${defaultTheme.space[3]} ${defaultTheme.space[4]};
  }

  ${mq[0]} {
    padding: ${defaultTheme.space[3]} ${defaultTheme.space[3]} ${defaultTheme.space[3]};
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
