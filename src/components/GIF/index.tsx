/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/core'
import styled from "@emotion/styled";

const GIFStyle = styled.div`
  max-width: 950px;
  margin: 32px auto;
  overflow: hidden;
  @media (max-width: 854px) {
    max-width: 950px;
  }
  img {
    text-align: center;
    margin: auto;
    width: 100%;
  }
`
class GIF extends Component {
  render() {
    return <GIFStyle>{this.props.children}</GIFStyle>
  }
}

export default GIF
