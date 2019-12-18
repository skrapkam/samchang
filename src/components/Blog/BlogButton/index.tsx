/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

const BlogButton__Style = css`
max-width: var(--content-width);

margin: 16px auto 0px;
`;
class BlogButton extends Component {
  render() {
    return (
      <div css={BlogButton__Style}>
        <p>{this.props.children}</p>
      </div>
    );
  }
}

export default BlogButton;
