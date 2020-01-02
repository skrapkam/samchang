/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

const ContentExcerptStyle = styled.section`
  font-size: 2.778rem;
  max-width: var(--content-width);
  margin: 24px auto 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 24px;
`;
class ContentExcerpt extends Component {
  render() {
    return <ContentExcerptStyle>{this.props.children}</ContentExcerptStyle>;
  }
}

export default ContentExcerpt;
