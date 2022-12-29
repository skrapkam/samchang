/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const ContentStyle = styled.p`
  max-width: ${defaultTheme.width[0]};
  margin: ${defaultTheme.space[3]} auto ${defaultTheme.space[3]};
`;

class Content extends Component {
  render() {
    return <ContentStyle>{this.props.children}</ContentStyle>;
  }
}

export default Content;
