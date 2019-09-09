/** @jsx jsx */

import { Component } from 'react'
import { css, jsx } from '@emotion/core'

const ContentSubhead__Style = css`
  max-width: var(--content-width);
  margin: 32px auto 0px;
  font-size: 1.3rem;
  color: #5a5a5a;
  line-height: 40px;
`
class ContentSubhead extends Component {
  render() {
    return <div css={ContentSubhead__Style}>{this.props.children}</div>
  }
}

export default ContentSubhead
