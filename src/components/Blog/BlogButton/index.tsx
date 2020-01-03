/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const BlogButtonStyle = styled.div`
  max-width: ${defaultTheme.width[0]};
  margin: ${defaultTheme.space[2]} auto 0;
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
