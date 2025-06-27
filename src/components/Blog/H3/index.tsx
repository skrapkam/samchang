/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { mq } from "../../../styles/styles";
import defaultTheme from "../../Theme"

const H3Styled = styled.h3`
  max-width: ${defaultTheme.width[0]};
  margin: 0 auto ${defaultTheme.space[3]};
  font-weight: 500;
  font-family: ${defaultTheme.fonts.serif};
  font-size: ${defaultTheme.fontSizes[2]};
  color: ${defaultTheme.color.text};
  line-height: 5rem;
`;

interface H3Props {
  id?: string;
  children: React.ReactNode;
}

class H3 extends Component<H3Props> {
  render() {
    const { id, children, ...rest } = this.props;
    return <H3Styled id={id} {...rest}>{children}</H3Styled>;
  }
}

export default H3;
