/** @jsx jsx */
import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { jsx } from "@emotion/core";
import { throttle } from "throttle-debounce";
import Emoji from "a11y-react-emoji";
import defaultTheme from "../Theme";
import { GlobalStyle } from "../../styles/reset";


const ScrollToTop = styled.div`
  cursor: pointer;
  font-size: 2em;
  opacity: ${props => (props.isVisible ? "1" : "0")};
  transform: translateY(${props => (props.isVisible ? "0" : "90px")});
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translate(0, -6px);
  }

  -webkit-touch-callout: none;
  -webkit-user-select: none; /* Webkit */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10  */

  /* Currently not supported in Opera but will be soon */
  -o-user-select: none;
  user-select: none;
  justify-content: center;
  position: fixed;
  bottom: 32px;
  right: 32px;

  @media (max-width: 1070px) {
    display: none;
  }
`;

const PageStyled = styled.div`
  padding-bottom: ${defaultTheme.space[10]};
  background: var(--bg);

`;

export default function ScrollButton({ children }) {
  const [scrollToTopVisible, setScrollToTopVisible] = useState(false);

  function handleScroll() {
    const scrollToTopState = window && window.pageYOffset > 240;
    setScrollToTopVisible(scrollToTopState);
  }

  const throttledScroll = throttle(300, handleScroll); //delay

  const scrollToTop = () => {
    if (window) {
      window.scrollTo(0, 0);
    }
  };

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

  return (
    <PageStyled>
      <GlobalStyle />
      {children}
      <ScrollToTop isVisible={scrollToTopVisible} onClick={scrollToTop}>
        <Emoji symbol="☝️" label="up" />
      </ScrollToTop>
    </PageStyled>
  );
}
