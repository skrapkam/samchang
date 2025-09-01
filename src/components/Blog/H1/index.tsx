/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { mq } from "../../../styles/styles";
import defaultTheme from "../../Theme"

const H1Styled = styled.h1`
  max-width: ${defaultTheme.width[0]};
  margin: 0 auto 0;
  font-weight: 500;
  font-family: ${defaultTheme.fonts.serif};
  font-size: ${defaultTheme.fontSizes[4]};
  color: ${defaultTheme.color.text};
  line-height: 5rem;
`;

interface H1Props {
  id?: string;
  children: React.ReactNode;
}

class H1 extends Component<H1Props> {
  render() {
    const { id, children, ...rest } = this.props;
    return <H1Styled id={id} {...rest}>{children}</H1Styled>;
  }
}

export default H1;
