/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/react'
import styled from "@emotion/styled";
import defaultTheme from "../Theme"

const GIFStyle = styled.div`
  max-width: 950px;
  margin: ${defaultTheme.space[4]} auto;
  overflow: hidden;
  @media (max-width: 854px) {
    max-width: 950px;
  }
  img {
    text-align: center;
    margin: auto;
    width: ${defaultTheme.width[2]};
  }
`
class GIF extends Component {
  render() {
    return <GIFStyle>{this.props.children}</GIFStyle>
  }
}

export default GIF
