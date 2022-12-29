/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import defaultTheme from "../../../Theme"

const ListStyle = styled.ol`
  max-width: ${defaultTheme.width[0]};
  padding: 0 0 0 1.8rem; 
  margin: 0 auto ${defaultTheme.space[2]};

`;

class OrderedList extends Component {
  render() {
    return <ListStyle>{this.props.children}</ListStyle>;
  }
}

export default OrderedList;
