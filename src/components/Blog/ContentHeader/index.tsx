/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";


const ContentHeader__Style = styled.h1`
  max-width: var(--content-width);
  margin: 32px auto 0px;
  font-family: Georgia, Cambria, "Times New Roman", Times;
  font-size: 2rem;
  color: #5a5a5a;
  line-height: 40px;
`;
class ContentHeader extends Component {
  render() {
    return (
         <ContentHeader__Style>{this.props.children}</ContentHeader__Style>
      
    );
  }
}

export default ContentHeader;