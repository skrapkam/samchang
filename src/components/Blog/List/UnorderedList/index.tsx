/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

const ListStyle = styled.ul`
  max-width: var(--content-width);
  padding: 0 0 0 20px;
  margin: 0 auto 16px;

  li {
    padding-bottom: 2.125rem;
  }
`;

class UnorderedList extends Component {
  render() {
    return <ListStyle>{this.props.children}</ListStyle>;
  }
}

export default UnorderedList;
