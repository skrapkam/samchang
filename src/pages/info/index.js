/** @jsx jsx */

import { Component } from "react";
import { css, jsx } from "@emotion/core";
import Nav from "../../components/Nav";
import Menu from "../../components/Menu";
import Page from "../../components/Page";
import { HeaderWrapper } from "../../styles/styles.js";
import { MediumSectionWrapper } from "../../styles/styles.js";
import { Helmet } from "react-helmet";
import Link from "gatsby-link";

const Summary__Popout = css`
  margin-bottom: 8px;
  color: var(--link-color);
  text-decoration: none;
  border-bottom: 1px solid var(--link-color);
  padding: 0 0 2px;
  line-height: 1.5em;
`;

class info extends Component {
  render() {
    return (
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
        <HeaderWrapper>
          <Nav title="Info" />
          <Menu />
        </HeaderWrapper>
        <MediumSectionWrapper>
          <h2>Present</h2>
          <ul>
            <li>
              Product Designer at <a href="https://99designs.com/">99designs</a>
            </li>
            <li>
              Learning how to <a href="https://github.com/skrapkam">code</a>{" "}
            </li>
            <li>
              Making <Link to="/music">music</Link>{" "}
            </li>
            <li>
              <Link to="/reading">Reading</Link>
            </li>
            <li>
              <a href="https://photos.samchang.design">
                Taking horrible photos
              </a>
            </li>
          </ul>
          <h2>Past</h2>
          <ul>
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
              <details>
                <summary>
                  <span css={Summary__Popout}>Dumb websites made for fun</span>
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
                  <li>
                    <a href="https://theyodelkid.com">theyodelkid</a> is a
                    website dedicated to the yodel kid
                  </li>
                  <li>
                    <a href="https://thelongestyeahboyever.com/">
                      the longest yeah boy ever
                    </a>{" "}
                    is a website dedicated to{" "}
                    <a href="https://www.youtube.com/watch?v=fvtQYsckLxk">
                      Kondwani Sichinga
                    </a>
                  </li>
                  <li>
                    <a href="http://chloeburbankgenerator.com">
                      Chloe Burban album cover generator
                    </a>
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
              <a href="https://emotion.sh">Emotion</a>; hosted on{" "}
              <a href="https://www.netlify.com/">Netlify</a>
            </li>
            <li>Fonts: System Fonts and Georgia</li>
            <li>
              The code that powers this website is{" "}
              <a href="https://github.com/skrapkam/samchang">open source</a>
            </li>
            <li>
              <a href="https://github.com/skrapkam/samchang/commits/master">
                Last updated 10/22/19
              </a>
            </li>
          </ul>
        </MediumSectionWrapper>
      </Page>
    );
  }
}

export default info;
