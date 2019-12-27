/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

const H3Style = css`
  max-width: var(--content-width);
  margin: 0 auto 1rem ;
  h3 {
    font-weight: 500;
    font-style: italic;
    font-size: 2rem;
    color: #5a5a5a;
  }
`;
class H3 extends Component {
  render() {
    return (
      <div css={H3Style}>
        <h3>{this.props.children}</h3>
      </div>
    );
  }
}

export default H3;
