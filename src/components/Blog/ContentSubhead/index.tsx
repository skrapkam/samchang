/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

const ContentSubhead__Style = css`
  max-width: var(--content-width);
  margin: 0 auto 1.625rem;
  h2 {
    font-weight: 500;
    font-family: Georgia, Cambria, "Times New Roman", Times;
    font-size: 2.5rem;
    color: var(--text-color);
  }
`;
class ContentSubhead extends Component {
  render() {
    return (
      <div css={ContentSubhead__Style}>
        <h2>{this.props.children}</h2>
      </div>
    );
  }
}

export default ContentSubhead;
