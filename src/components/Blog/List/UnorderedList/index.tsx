/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import defaultTheme from "../../../Theme"

const ListStyle = styled.ul`
  max-width: ${defaultTheme.width[0]};
  padding: 0 0 0 ${defaultTheme.space[2]};
  margin: 0 auto ${defaultTheme.space[2]};
`;

class UnorderedList extends Component {
  render() {
    return <ListStyle>{this.props.children}</ListStyle>;
  }
}

export default UnorderedList;
