/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/core'
import { mq } from "../../../styles/styles";
import styled from "@emotion/styled";
import defaultTheme from "../../Theme"

const ContentTitleStyle = styled.header`
  max-width: ${defaultTheme.width[0]};
  margin: ${defaultTheme.space[4]} auto 0;
  font-size: ${defaultTheme.fontSizes[6]};
  font-family: ${defaultTheme.fonts.serif};
  color: ${defaultTheme.color.link};
  line-height: 1.2;

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
