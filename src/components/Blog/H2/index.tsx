/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { mq } from "../../../styles/styles";
import defaultTheme from "../../Theme"

const H2Styled = styled.h2`
  max-width: ${defaultTheme.width[0]};
  margin: 0 auto ${defaultTheme.space[3]};
  font-weight: 500;
  font-family: ${defaultTheme.fonts.serif};
  font-size: ${defaultTheme.fontSizes[3]};
  color: ${defaultTheme.color.text};
  line-height: 5rem;
`;

interface H2Props {
  id?: string;
  children: React.ReactNode;
}

class H2 extends Component<H2Props> {
  render() {
    const { id, children, ...rest } = this.props;
    return <H2Styled id={id} {...rest}>{children}</H2Styled>;
  }
}

export default H2;
