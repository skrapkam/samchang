/** @jsx jsx */

import { Component } from 'react'
import { css, jsx } from '@emotion/core'

const Button__Styled = css`
  margin-top: 24px;
  font-weight: 600;
  text-align: left;
  -webkit-user-select: none;
  a:visited {
    &:hover {
      background: white: 
      color: var(--link-color);
      border-bottom: 2px solid var(--link-color);
    }
  }
  a,
  a:active,
  a:focus,
  a:hover,
  a:link {
    font-weight: 600;
    text-decoration: none;
    color: var(--link-color);
    font-size: 0.8em;
    border: 2px solid var(--link-color);
    border-radius: 2px;
    text-transform: uppercase;
    box-sizing: border-box;
    padding: 7px 10px;
    letter-spacing: 0.5px;
    border-bottom: 2px solid var(--link-color);
    &:hover {
      background: var(--link-color);
      color: #fff;
    }
    &:after {
      background: 0 0;
    }
  }
`
class Button extends Component {
  render() {
    return <div css={Button__Styled}>{this.props.children}</div>
  }
}

export default Button
