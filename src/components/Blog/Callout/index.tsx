/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const CalloutStyle = styled.aside`
  background-color: rgba(0, 0, 0, 0.03);
  max-width: var(--content-width);
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
  font-size: 1.8em;
  color: rgb(230, 96, 0);
  margin-bottom: ${defaultTheme.space[1]};
  letter-spacing: 1px;
`;
class Callout extends Component {
  render() {
    return (
      <CalloutStyle>
          <CalloutTitle>💡</CalloutTitle>
          {this.props.children}
      </CalloutStyle>
    );
  }
}

export default Callout;
