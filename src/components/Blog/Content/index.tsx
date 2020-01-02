/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

const ContentStyle = styled.p`
  max-width: var(--content-width);
  margin: 0 auto 2.5rem;

  li {
    margin: 0 20px;
  }
`;

class Content extends Component {
  render() {
    return <ContentStyle>{this.props.children}</ContentStyle>;
  }
}

export default Content;
