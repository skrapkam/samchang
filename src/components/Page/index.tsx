/** @jsx jsx */
import styled from "@emotion/styled";
import { useState, useEffect } from "react";
import { jsx, css } from "@emotion/core";
import { throttle } from "throttle-debounce";

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

const PageStyle = css`
  padding-bottom: 80px;
`

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
    <div css={PageStyle} >
      {children}
      <ScrollToTop isVisible={scrollToTopVisible} onClick={scrollToTop}>
        <span role="img" aria-label="sheep">
          {" "}
          ☝{" "}
        </span>
      </ScrollToTop>
    </div>
  );
}
