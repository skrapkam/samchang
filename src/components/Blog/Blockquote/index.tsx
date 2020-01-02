/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

const BlockquoteStyle = styled.blockquote`
  background-color: #fff3e6;
  max-width: var(--content-width);
  margin: 32px auto;
  padding: 24px;
  border-left: 8px solid #ffcfb8;
  border-radius: 8px;
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
