/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import { mq } from "../../../styles/styles";

const ContentHeader__Style = css`
  max-width: var(--content-width);
  margin: 0 auto 1.625rem;
  font-family: Georgia, Cambria, "Times New Roman", Times;
  color: #5a5a5a;
  padding-top: 1.625rem;

  ${mq[0]} {
    line-height: 4rem;
  } 

  h1 {
    font-size: 3.333rem;
  }
`;
class ContentHeader extends Component {
  render() {
    return (
         <div css={ContentHeader__Style}>
           <h1>{this.props.children}</h1>
         </div>
    );
  }
}

export default ContentHeader;
