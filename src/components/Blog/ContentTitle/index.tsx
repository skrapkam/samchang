/** @jsx jsx */

import { Component } from 'react'
import { css, jsx } from '@emotion/core'
import { mq } from "../../../styles/styles";

const ContentTitle__Style = css`
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
    return <div css={ContentTitle__Style}>{this.props.children}</div>
  }
}

export default ContentTitle
