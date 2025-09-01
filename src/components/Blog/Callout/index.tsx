/** @jsx jsx */

import React from "react";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

interface CalloutProps {
  children: React.ReactNode;
  emoji?: string;
}

const CalloutStyle = styled.aside`
  background-color: rgba(0,0,0, .03);
  max-width: ${defaultTheme.width[0]};
  margin: ${defaultTheme.space[4]} auto;
  padding: ${defaultTheme.space[3]};
  border-radius: 8px;
  display: grid;
  grid-template-columns: 4ch auto;

  @media (max-width: 450px) {
    padding: ${defaultTheme.space[3]} ${defaultTheme.space[2]};
  }
`;

const CalloutTitle = styled.h6`
  font-size: ${defaultTheme.fontSizes[3]};
  color: rgb(230, 96, 0);
  margin-bottom: ${defaultTheme.space[1]};
  letter-spacing: 1px;
`;

const Callout: React.FC<CalloutProps> = ({ children, emoji = "💡" }) => {
  return (
    <CalloutStyle>
      <CalloutTitle>{emoji}</CalloutTitle>
      {children}
    </CalloutStyle>
  );
};

export default Callout;
