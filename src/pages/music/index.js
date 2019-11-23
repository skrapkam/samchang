/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import Nav from "../../components/Nav";
import styled from "@emotion/styled";
import Menu from "../../components/Menu";
import { MediumSectionWrapper } from "../../styles/styles.js";
import { Container } from "../../styles/styles.js";
import Page from "../../components/Page";
import Header from "../../components/Header";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import { Helmet } from "react-helmet";

const Grid = styled("div")`
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
    padding: 0 var(--baseline) 24px;
    row-gap: 24px;
  }
`;
const CoverStyle = css`
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const CoverTitle = styled("div")`
  margin-top: 16px;
`;

const music = props => (
  <Container>
    <Page>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Music | Sam Chang</title>
        <meta http-equiv="x-ua-compatible" content="ie=edge; chrome=1" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>
      <Header>
        <Nav title="Music" />
        <Menu />
      </Header>
      <MediumSectionWrapper>
        <p>
          Written and produced by{" "}
          <a href="http://groveralleyway.bandcamp.com">Grover Alleyway</a>. All
          tunes created on a laptop computer using Ableton Live software to
          control and mix VST plugins as well as manipulations of audio
          recordings.
        </p>
      </MediumSectionWrapper>

      <Grid>
        <div>
          <a href="https://song.link/i/1474641684">
            <Img
              css={CoverStyle}
              fluid={props.data.imageTwo.childImageSharp.fluid}
            />
            <CoverTitle>bl33din' luv</CoverTitle>
          </a>
          Jul 2019
        </div>
        <div>
          <a href="https://song.link/album/us/i/1469600060">
            <Img
              css={CoverStyle}
              fluid={props.data.imageOne.childImageSharp.fluid}
            />
            <CoverTitle>Barely Tolerable</CoverTitle>
          </a>
          Feb 2019
        </div>
      </Grid>
    </Page>
  </Container>
);

export default music;

export const fluidImage = graphql`
  fragment fluidImage on File {
    childImageSharp {
      fluid(maxWidth: 1000) {
        ...GatsbyImageSharpFluid_tracedSVG
      }
    }
  }
`;

export const pageQuery = graphql`
  query {
    imageOne: file(relativePath: { eq: "barely-tolerable.jpg" }) {
      ...fluidImage
    }
    imageTwo: file(relativePath: { eq: "bl33ding-luv.jpg" }) {
      ...fluidImage
    }
    imageThree: file(
      relativePath: { eq: "nothing-was-gained-under-the-sun.jpg" }
    ) {
      ...fluidImage
    }
  }
`;
