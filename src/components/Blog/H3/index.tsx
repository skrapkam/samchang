/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const H3Style = styled.h3`
  max-width: ${defaultTheme.width[0]};
  margin: 0 auto -${defaultTheme.space[2]};
  font-family: ${defaultTheme.fonts.serif};
  font-weight: 400;
  font-size: ${defaultTheme.fontSizes[2]};
  color: ${defaultTheme.color.text};
`;
class H3 extends Component {
  render() {
    return <H3Style>{this.props.children}</H3Style>;
  }
}

export default H3;
