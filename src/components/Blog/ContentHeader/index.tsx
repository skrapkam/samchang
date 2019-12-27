/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";


const ContentHeader__Style = css`
  max-width: var(--content-width);
  margin: 0 auto 1rem;
  font-family: Georgia, Cambria, "Times New Roman", Times;
  color: #5a5a5a;
  padding-top: 2.4rem;
  @media (max-width: 425px) {
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
