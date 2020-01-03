/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const ContentExcerptStyle = styled.section`
  font-size: ${defaultTheme.fontSizes[2]};
  max-width: ${defaultTheme.width[0]};
  margin: ${defaultTheme.space[2]} auto 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: ${defaultTheme.space[3]} ;
`;
class ContentExcerpt extends Component {
  render() {
    return <ContentExcerptStyle>{this.props.children}</ContentExcerptStyle>;
  }
}

export default ContentExcerpt;
