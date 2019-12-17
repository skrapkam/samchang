/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";

const Content__Style = css`
  max-width: var(--content-width);
  margin: 16px auto 0px;
  ul {
    line-height: 2rem;
  }
  
  li {
    margin: 0 20px;
  }
`;
class Content extends Component {
  render() {
    return <p css={Content__Style}>{this.props.children}</p>;
  }
}

export default Content;
