/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

const CalloutStyle = css`
  background-color: rgba(0, 0, 0, 0.03);
  max-width: var(--content-width);
  margin: 32px auto;
  padding: 24px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 4ch auto;

  @media (max-width: 450px) {
    padding: 24px 16px;
  }

`;

const CalloutTitle = styled.h6`
  font-size: 1.8em;
  color: rgb(230, 96, 0);
  margin-bottom: 8px;
  letter-spacing: 1px;
`;
class Callout extends Component {
  render() {
    return (
      <aside>

      <div css={CalloutStyle}>
        <CalloutTitle>💡</CalloutTitle>
        {this.props.children}
        
      </div>
      </aside>
    );
  }
}

export default Callout;
