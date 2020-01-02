/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

const SummaryStyle = styled.div`
  background-color: rgba(230, 96, 0, 0.12);
  max-width: var(--content-width);
  margin: 32px auto;
  border-radius: 8px;
  padding: 24px;
`;

const SummaryTitle = styled.h6`
  font-size: 1.2em;
  color: rgb(230, 96, 0);
  margin-bottom: 8px;
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
