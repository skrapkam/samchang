/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

const BlogButtonStyle = styled.div`
  max-width: var(--content-width);
  margin: 16px auto 0px;
`;

class BlogButton extends Component {
  render() {
    return (
      <BlogButtonStyle>
        <p>{this.props.children}</p>
      </BlogButtonStyle>
    );
  }
}

export default BlogButton;
