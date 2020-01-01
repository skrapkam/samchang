/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

const Content__Style = styled.p`
  max-width: var(--content-width);
  margin: 0 auto 2.5rem;

  li {
    margin: 0 20px;
  }
`;
class Content extends Component {
  render() {
    return <Content__Style>{this.props.children}</Content__Style>;
  }
}

export default Content;
