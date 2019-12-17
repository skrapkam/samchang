import { Component } from 'react'
import React from 'react'
import styled from '@emotion/styled'

const Container = styled('div')`
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  column-gap: 40px;
  row-gap: 40px;
  margin: 0 auto;
  padding: 32px 40px 40px 40px;
  img {
    border: none;
  }
  @media (max-width: 950px) {
    padding: 0 var(--baseline);
    row-gap: 24px;
  }
`
class Gallery extends Component {
  render() {
    return <Container />
  }
}
export default Gallery
