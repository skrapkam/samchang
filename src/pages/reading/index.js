/** @jsx jsx */

import { Component } from 'react'
import { css, jsx } from '@emotion/core'
import Nav from '../../components/Nav'
import Menu from '../../components/Menu'
import Page from '../../components/Page'
import { HeaderWrapper } from '../../styles/styles.js'
import { MediumSectionWrapper } from '../../styles/styles.js'

import { Helmet } from 'react-helmet'

const ul = css`
  padding-top: 16px;
`

class reading extends Component {
  render() {
    return (
      <Page>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Reading | Sam Chang</title>
          <meta http-equiv="x-ua-compatible" content="ie=edge; chrome=1" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
        </Helmet>
        <HeaderWrapper>
          <Nav title="Reading" />
          <Menu />
        </HeaderWrapper>
        <MediumSectionWrapper>
          <p>
            Books I'm reading at the moment broken up into themes. You can find
            a full list of books I've read in the past{' '}
            <a href="https://readernaut.com/reader/skrapkam">here</a>.
          </p>
          <ul css={ul}>
            <h2>Design</h2>
            <li>
              <a href="https://www.amazon.com/Designing-Behavior-Change-Psychology-Behavioral/dp/1449367623">
                Designing for Behavior Change
              </a>{' '}
              by Stephen Wendel
            </li>
          </ul>
          <ul>
            <h2>Software Engineering</h2>
            <li>
              <a href="https://www.amazon.com/Mythical-Man-Month-Software-Engineering-Anniversary/dp/0201835959">
                The Mythical Man-Month: Essays on Software Engineering
              </a>{' '}
              by Brooks Jr., Frederick P
            </li>
          </ul>
        </MediumSectionWrapper>
      </Page>
    )
  }
}

export default reading
