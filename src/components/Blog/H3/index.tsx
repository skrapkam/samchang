/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const H3Style = styled.h3`
  max-width: var(--content-width);
  margin: 0 auto ${defaultTheme.space[1]};
  font-family: Georgia, Cambria, "Times New Roman", Times;
  font-weight: 400;
  font-size: ${defaultTheme.fontSizes[2]};
  color: var(--text-color);
`;
class H3 extends Component {
  render() {
    return <H3Style>{this.props.children}</H3Style>;
  }
}

export default H3;
