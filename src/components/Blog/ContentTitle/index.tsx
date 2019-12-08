/** @jsx jsx */

import { Component } from 'react'
import { css, jsx } from '@emotion/core'

const ContentTitle__Style = css`
  max-width: var(--content-width);
  margin: 32px auto 0px;
  font-size: 2.5rem;
  font-family: Georgia, Cambria, 'Times New Roman', Times;
  color: var(--link-color);
  line-height: 40px;

  @media (max-width: 425px) {
    margin: auto 0px;
  }
`
class ContentTitle extends Component {
  render() {
    return <div css={ContentTitle__Style}>{this.props.children}</div>
  }
}

export default ContentTitle
