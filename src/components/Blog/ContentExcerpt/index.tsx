/** @jsx jsx */

import { Component } from 'react'
import { css, jsx } from '@emotion/core'

const Content__Excerpt = css`
  font-size: 2.778rem;
  max-width: var(--content-width);
  margin: 24px auto 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 24px;
`
class ContentExcerpt extends Component {
  render() {
    return <div css={Content__Excerpt}>{this.props.children}</div>
  }
}

export default ContentExcerpt
