/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const H2Styled = styled.h2`
  max-width: var(--content-width);
  margin: 0 auto ${defaultTheme.space[2]};
  font-weight: 500;
  font-family: Georgia, Cambria, "Times New Roman", Times;
  font-size: 2.5rem;
  color: var(--text-color);
`;
class H2 extends Component {
  render() {
    return <H2Styled>{this.props.children}</H2Styled>;
  }
}

export default H2;
