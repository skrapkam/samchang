/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { mq } from "../../../styles/styles";
import defaultTheme from "../../Theme"

const H2Styled = styled.h2`
  max-width: ${defaultTheme.width[0]};
  margin: 0 auto ${defaultTheme.space[2]};
  font-weight: 500;
  font-family: ${defaultTheme.fonts.serif};
  font-size: ${defaultTheme.fontSizes[3]};
  color: ${defaultTheme.color.text};
  line-height: 5rem;


`;
class H2 extends Component {
  render() {
    return <H2Styled>{this.props.children}</H2Styled>;
  }
}

export default H2;
