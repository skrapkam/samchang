import { Component } from 'react'
import React from 'react'
import styled from '@emotion/styled'
import { mq } from "../../styles/styles";


const Container = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  column-gap: 40px;
  row-gap: 40px;
  margin: 0 auto;
  padding: 32px 40px 40px 40px;
  background: red;
  img {
    border: none;
  }

  ${mq[1]} {
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
