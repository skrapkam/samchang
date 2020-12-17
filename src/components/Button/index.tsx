/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/core'
import styled from "@emotion/styled";
import defaultTheme from "../Theme"

const ButtonStyled = styled.div`
  margin-top: ${defaultTheme.space[3]};
  font-weight: 600;
  text-align: left;
  -webkit-user-select: none;
  a {
    &:hover {
      color: ${defaultTheme.color.link});
      background-color: ${defaultTheme.color.hover});
      border-bottom: 2px solid ${defaultTheme.color.link});
    }
  }
  a,
  a:active,
  a:focus,
  a:link {
    -webkit-transition: auto;
    transition: auto;
    font-weight: 600;
    text-decoration: none;
    color: ${defaultTheme.color.link});
    font-size: 0.8em;
    border: 2px solid ${defaultTheme.color.link};
    border-radius: 2px;
    text-transform: uppercase;
    box-sizing: border-box;
    padding: 7px 10px;
    letter-spacing: 0.5px;
    border-bottom: 2px solid ${defaultTheme.color.link};
    &:hover {
      background: ${defaultTheme.color.lightGray});
      color: #fff;
    }
    &:after {
      background: 0 0;
    }
  }
`
class Button extends Component {
  render() {
    return <ButtonStyled>{this.props.children}</ButtonStyled>
  }
}

export default Button
