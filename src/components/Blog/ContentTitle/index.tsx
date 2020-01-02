/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/core'
import { mq } from "../../../styles/styles";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const ContentTitleStyle = styled.header`
  max-width: var(--content-width);
  margin: ${defaultTheme.space[4]} auto 0;
  font-size: ${defaultTheme.fontSizes[6]};
  font-family: Georgia, Cambria, 'Times New Roman', Times;
  color: var(--link-color);
  line-height: .8;

  ${mq[0]} {
    margin: auto 0;
  } 
`
class ContentTitle extends Component {
  render() {
    return <ContentTitleStyle>{this.props.children}</ContentTitleStyle>
  }
}

export default ContentTitle
