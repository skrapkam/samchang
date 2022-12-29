/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/react'
import styled from "@emotion/styled"
import { PillStyle } from '../styles'
 
const UpdatedStyled = styled(PillStyle)`
    background: rgb(0, 191, 178);
`
 
class Updated extends Component {
    render() {
        return <UpdatedStyled>Updated</UpdatedStyled>
    }
}

export default Updated
