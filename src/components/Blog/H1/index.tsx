/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import { mq } from "../../../styles/styles";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const H1Style = styled.h1`
  max-width: var(--content-width);
  margin: 0 auto ${defaultTheme.space[2]};
  font-family: Georgia, Cambria, "Times New Roman", Times;
  color: var(--text-color);
  padding-top: ${defaultTheme.space[2]};
  font-size: 3.333rem;

  ${mq[0]} {
    line-height: 5rem;
  }
`;
class H1 extends Component {
  render() {
    return <H1Style>{this.props.children}</H1Style>;
  }
}

export default H1;
