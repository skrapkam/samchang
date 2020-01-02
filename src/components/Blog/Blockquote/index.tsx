/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const BlockquoteStyle = styled.blockquote`
  background-color: #fff3e6;
  max-width: var(--content-width);
  margin: ${defaultTheme.space[4]} auto;
  padding: ${defaultTheme.space[3]}; 
  border-left: 8px solid #ffcfb8;
  border-radius: 8px;
  
  p {
    margin: ${defaultTheme.space[0]};
  }
`;

class Blockquote extends Component {
  render() {
    return (
      <BlockquoteStyle>
        {this.props.children}
      </BlockquoteStyle>
    );
  }
}

export default Blockquote;
