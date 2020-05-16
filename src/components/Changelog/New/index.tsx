/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/core'
import styled from "@emotion/styled"
import { PillStyle } from '../styles'
 
const NewStyled = styled(PillStyle)`
    background: rgb(68, 200, 129);
`
 
class New extends Component {
    render() {
        return <NewStyled>New</NewStyled>
    }
}

export default New
