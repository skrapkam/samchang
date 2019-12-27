/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

const List__Style = styled.ol`
  max-width: var(--content-width);
  padding: 0 0 0 20px;
  margin: 0 auto 16px;
  
`;
class OrderedList extends Component {
  render() {
    return <List__Style>{this.props.children}</List__Style>;
  }
}

export default OrderedList;
