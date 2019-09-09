/** @jsx jsx */ import Link from 'gatsby-link'
import styled from '@emotion/styled'
import { Component } from 'react'
import { jsx } from '@emotion/core'

const NavWrapper = styled.div`
  font-weight: 400;
  width: 70%;
  display: inline-block;
`

class Nav extends Component {
  render() {
    return (
      <NavWrapper>
        <p>
          <Link to="/">Sam Chang</Link>
          {this.props.title ? ' / ' + this.props.title : null}
        </p>{' '}
        <p />
      </NavWrapper>
    )
  }
}

export default Nav
