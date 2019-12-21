/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

const List__Style = styled.ul`
  max-width: var(--content-width);
  padding: 0 0 0 20px;
  margin: 16px auto 0px;
  ul {
    line-height: 2rem;
  }
  
`;
class UnorderedList extends Component {
  render() {
    return <List__Style>{this.props.children}</List__Style>;
  }
}

export default UnorderedList;
