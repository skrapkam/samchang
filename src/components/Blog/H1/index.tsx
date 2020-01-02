/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import { mq } from "../../../styles/styles";
import styled from "@emotion/styled";

const H1Style = styled.h1`
  max-width: var(--content-width);
  margin: 0 auto 1.625rem;
  font-family: Georgia, Cambria, "Times New Roman", Times;
  color: var(--text-color);
  padding-top: 1.625rem;
  font-size: 3.333rem;

  ${mq[0]} {
    line-height: 4rem;
  }
`;
class H1 extends Component {
  render() {
    return <H1Style>{this.props.children}</H1Style>;
  }
}

export default H1;
