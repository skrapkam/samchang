/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const BlockquoteStyle = styled.blockquote`
  background-color: rgba(255, 207, 184, 0.30);
  max-width: ${defaultTheme.width[0]};
  margin: ${defaultTheme.space[4]} auto;
  padding: ${defaultTheme.space[3]}; 
  border-left: 8px solid rgba(255, 207, 184, 0.30);
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
