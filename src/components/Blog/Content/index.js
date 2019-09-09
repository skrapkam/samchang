/** @jsx jsx */

import { Component } from 'react'
import { css, jsx } from '@emotion/core'

const Content__Style = css`
  line-height: 2rem;
  max-width: var(--content-width);
  margin: 16px auto 0px;
  ul {
    line-height: 2rem;
  }
  @media (max-width: 950px) {
    font-size: var(--tiny-text);
  }
  li {
    padding: 0 15px;
    margin: 0 20px;
  }
`
class Content extends Component {
  render() {
    return <div css={Content__Style}>{this.props.children}</div>
  }
}

export default Content
