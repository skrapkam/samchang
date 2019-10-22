/** @jsx jsx */
import { graphql } from "gatsby";
import Img from "gatsby-image";
import Link from "gatsby-link";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import Page from "../components/Page";

import Nav from "../components/Nav";
import Menu from "../components/Menu";
import Button from "../components/Button";
import { HeaderWrapper, SectionWrapper } from "../styles/styles.js";

import { Helmet } from "react-helmet";

const hide = css`
  display: none;
  @media (max-width: 950px) {
    visibility: hidden;
    width: 2px;
    display: inline-block;
  }
`;
const action = css`
  text-decoration: none;
  color: var(--link-color);
  font-size: 0.8em;
  border: 2px solid var(--link-color);
  border-radius: 2px;
  text-transform: uppercase;
  box-sizing: border-box;
  padding: 7px 10px;
  letter-spacing: 0.5px;
  &:hover {
    background: #00f;
    color: #fff;
  }
  &:after {
    background: 0 0;
  }
`;

const Excerpt = css`
  line-height: 24px;
  margin-top: 8px;
  display: block;
  max-width: 450px;
`;

const hidden = css`
  display: none;
  @media (max-width: 950px) {
    background: white;
    display: block;
    position: relative;
    height: 37px;
    width: 100%;
    bottom: 23px;
  }
`;

const TextWrapper = styled.div`
  margin-top: 32px;
  @media (max-width: 950px) {
    padding-left: var(--baseline);
    padding-right: var(--baseline);
    margin-top: -26px;
    font-size: var(--tiny-text);
  }
`;

const ProjectWrapper = styled.div`
  margin: 0 auto 80px;
  a {
  }
  @media (max-width: 950px) {
  }
`;

const ImageWrapper = styled.div`
  display: grid;
  grid-template-columns: 410px 410px;
  grid-row: auto auto;
  grid-column-gap: 32px;
  grid-row-gap: 32px;

  img {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 950px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    -webkit-overflow-scrolling: touch;
    padding-left: var(--baseline);
    grid-column-gap: 24px;
    overflow: auto;
    padding-bottom: 27px;
  }
`;
export default ({ data }) => {
  return (
    <Page>
      <div className="wrapper">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Sam Chang</title>
          <meta http-equiv="x-ua-compatible" content="ie=edge; chrome=1" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
        </Helmet>
        <HeaderWrapper>
          <Nav />

          <Menu />
        </HeaderWrapper>
        <SectionWrapper>
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <div key={node.id}>
              <ProjectWrapper>
                <ImageWrapper>
                  <Img sizes={node.frontmatter.image1.childImageSharp.sizes} />
                  <Img sizes={node.frontmatter.image2.childImageSharp.sizes} />

                  <Img sizes={node.frontmatter.image3.childImageSharp.sizes} />
                  <Img sizes={node.frontmatter.image4.childImageSharp.sizes} />
                  <div css={hide} />
                </ImageWrapper>
                <div css={hidden} />
                <TextWrapper>
                  <p>
                    <strong>{node.frontmatter.title}</strong>,{" "}
                    {node.frontmatter.date}
                  </p>

                  <span css={Excerpt}>{node.frontmatter.excerpt}</span>
                  <Button>
                    <Link css={action} to={node.fields.slug}>
                      View
                    </Link>
                  </Button>
                </TextWrapper>
              </ProjectWrapper>
            </div>
          ))}
        </SectionWrapper>
      </div>
    </Page>
  );
};

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 1000
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "YYYY")
            excerpt

            image1 {
              childImageSharp {
                sizes(maxWidth: 630) {
                  ...GatsbyImageSharpSizes
                }
              }
            }

            image2 {
              childImageSharp {
                sizes(maxWidth: 630) {
                  ...GatsbyImageSharpSizes
                }
              }
            }

            image3 {
              childImageSharp {
                sizes(maxWidth: 630) {
                  ...GatsbyImageSharpSizes
                }
              }
            }

            image4 {
              childImageSharp {
                sizes(maxWidth: 630) {
                  ...GatsbyImageSharpSizes
                }
              }
            }

            section
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`;
