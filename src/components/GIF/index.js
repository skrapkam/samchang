/** @jsx jsx */

import { Component } from 'react'
import { css, jsx } from '@emotion/core'

const GIF__Style = css`
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
    return <div css={GIF__Style}>{this.props.children}</div>
  }
}

export default GIF
