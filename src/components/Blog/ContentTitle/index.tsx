/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/core'
import { mq } from "../../../styles/styles";
import styled from "@emotion/styled";

const ContentTitleStyle = styled.header`
  max-width: var(--content-width);
  margin: 32px auto 0px;
  font-size: 4.5rem;
  font-family: Georgia, Cambria, 'Times New Roman', Times;
  color: var(--link-color);
  line-height: .8;

  ${mq[0]} {
    margin: auto 0px;
  } 
`
class ContentTitle extends Component {
  render() {
    return <ContentTitleStyle>{this.props.children}</ContentTitleStyle>
  }
}

export default ContentTitle
