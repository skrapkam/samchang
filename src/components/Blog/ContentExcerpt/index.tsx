/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const ContentExcerptStyle = styled.section`
  font-size: 2.778rem;
  max-width: var(--content-width);
  margin: ${defaultTheme.space[3]} auto 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: ${defaultTheme.space[3]};
`;
class ContentExcerpt extends Component {
  render() {
    return <ContentExcerptStyle>{this.props.children}</ContentExcerptStyle>;
  }
}

export default ContentExcerpt;
