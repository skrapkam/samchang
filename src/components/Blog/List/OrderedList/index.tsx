/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import defaultTheme from "../../../Theme"

const ListStyle = styled.ol`
  max-width: var(--content-width);
  padding: 0 0 0 ${defaultTheme.space[2]}; 
  margin: 0 auto ${defaultTheme.space[2]};

  li {
    padding-bottom: ${defaultTheme.space[3]};
  }
`;

class OrderedList extends Component {
  render() {
    return <ListStyle>{this.props.children}</ListStyle>;
  }
}

export default OrderedList;
