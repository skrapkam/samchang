/** @jsx jsx */

import { Component } from 'react'
import { jsx } from '@emotion/react'
import styled from "@emotion/styled"
import { PillStyle } from '../styles'
 
const FixedStyled = styled(PillStyle)`
    background: rgb(92,194,238);
`
 
class Fixed extends Component {
    render() {
        return <FixedStyled>Fixed</FixedStyled>
    }
}

export default Fixed
