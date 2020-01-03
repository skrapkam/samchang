/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const SummaryStyle = styled.div`
  background-color: rgba(230, 96, 0, 0.12);
  max-width: ${defaultTheme.width[0]};
  margin: ${defaultTheme.space[4]} auto;
  border-radius: 8px;
  padding: ${defaultTheme.space[3]};
`;

const SummaryTitle = styled.h6`
  font-size: ${defaultTheme.fontSizes[2]};
  color: rgb(230, 96, 0);
  margin-bottom: ${defaultTheme.space[1]};
  letter-spacing: 1px;
`;
class Summary extends Component {
  render() {
    return (
      <SummaryStyle>
        <SummaryTitle>TL;DR</SummaryTitle>
        {this.props.children}
      </SummaryStyle>
    );
  }
}

export default Summary;
