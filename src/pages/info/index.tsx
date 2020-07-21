/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import Nav from "../../components/Nav";
import Menu from "../../components/Menu";
import Page from "../../components/Page";
import Header from "../../components/Header";
import { MediumSectionWrapper } from "../../styles/styles";
import { Helmet } from "react-helmet";
import Link from "gatsby-link";
import Img from "gatsby-image";
import { graphql } from "gatsby";
import styled from "@emotion/styled";
import defaultTheme from "../../components/Theme"

const SummaryPopout = css`
  margin-bottom: ${defaultTheme.space[1]};
  color: ${defaultTheme.color.link};
  text-decoration: none;
  border-bottom: 1px solid ${defaultTheme.color.link};
  padding: 0 0 2px;
  line-height: 1.5em;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;

  @media (max-width: 1160px) {
    grid-template-columns: 3fr;
  }
`;

const AvatarStyle = styled.div`
  width: 28vw;
  height: 30vw;
  margin-top: 220px;
  margin-right: 130px;

  @media (max-width: 1160px) {
    display: none;
  }
`;

const AvatarCaption = styled.div`
  margin-top: ${defaultTheme.space[1]};
`;

const info = props => (
  <Page>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Info | Sam Chang</title>
      <meta http-equiv="x-ua-compatible" content="ie=edge; chrome=1" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
      />
      <meta name="apple-mobile-web-app-capable" content="yes" />
    </Helmet>
    <Header>
      <Nav title="Info" />
      <Menu />
    </Header>
    <GridContainer>
      <MediumSectionWrapper>
        <h2>Present</h2>
        <ul>
          <li>
            I'm currently living in San Jose, California and working as a
            Product Designer for <a href="https://www.ladderlife.com/">Ladder</a>.
          </li>

          <li>
            In my spare time I enjoy{" "}
            <a href="https://github.com/skrapkam">coding</a>,{" "}
            <Link to="/music">producing music</Link>,{" "}
            <Link to="/library">reading</Link>,{" "}
            <a href="https://writing.samchang.design">writing</a>, and taking{" "}
            <a href="https://photos.samchang.design">mediocre photos</a>
          </li>
        </ul>
        <h2>Past</h2>
        <ul>
        <li>
            Product Designer at{" "}
            <a href="https://www.99designs.com/">99designs</a>
          </li>
          <li>
            Designer at{" "}
            <a href="https://www.leftfieldlabs.com/">Left Field Labs</a>
          </li>
          <li>
            Amateur <a href="https://skrapkam.tumblr.com">photographer</a>
          </li>
        </ul>

        <h2>Side Projects</h2>

        <ul>
          <li>
            <a href="https://agymfor.me">A Gym for Me</a> is a curated list of
            specialized gyms
          </li>
          <li>
            <a href="https://groveralleyway.com">Grover Alleyway</a> is a music project
          </li>
          <li>
            <details>
              <summary>
                <span css={SummaryPopout}>Dumb websites made for fun</span>
              </summary>
              <ul>
                <li>
                  <a href="https://kanyeomariwest.com">kanyeomariwest</a> is a
                  Kanye West wisdom generator
                </li>
                <li>
                  <a href="http://youngmulababy.com">youngmulababy</a> is a
                  website dedicated to Lil Wayne
                </li>
              </ul>
            </details>
          </li>
        </ul>
        <h2>Contact</h2>
        <ul>
          <li>
            <a href="mailto:samuel8chang@gmail.com">samuel8chang@gmail.com</a>
          </li>
          <li>
            <a href="https://twitter.com/samchangsucks">@samchangsucks</a>
          </li>
        </ul>
        <h2>Site Colophon</h2>
        <ul>
          <li>
            Built with <a href="https://www.gatsbyjs.org/">Gatsby</a> and{" "}
            <a href="https://emotion.sh">Emotion</a>; deployed on{" "}
            <a href="https://zeit.co/home/">Vercel</a>
          </li>
          <li>Fonts: System Fonts and Georgia</li>
          <li>
            The code that powers this website is{" "}
            <a href="https://github.com/skrapkam/samchang">open source</a>
          </li>
          <li>
            <Link to="/changelog">
              Last updated 07/20/20
            </Link>
          </li>
        </ul>
      </MediumSectionWrapper>
      <AvatarStyle>
        <Img fluid={props.data.avatar.childImageSharp.fluid} />
        <AvatarCaption>
          Photo by <a href="https://austinyu.com">Austin Yu</a>
        </AvatarCaption>
      </AvatarStyle>
    </GridContainer>
  </Page>
);

export default info;

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
    avatar: file(relativePath: { eq: "avatar.jpg" }) {
      ...fluidImage
    }
  }
`;
