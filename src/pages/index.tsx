/** @jsx jsx */
import { graphql } from "gatsby";
import Img from "gatsby-image";
import { Link } from "gatsby";
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import Page from "../components/Page";
import Header from "../components/Header";
import Nav from "../components/Nav";
import Menu from "../components/Menu";
import Button from "../components/Button";
import { SectionWrapper } from "../styles/styles";
import { Helmet } from "react-helmet";
import { mq } from "../styles/styles";
import defaultTheme from "../components/Theme"

const hide = css`
  display: none;
  ${mq[2]} {
    visibility: hidden;
    width: 2px;
    display: inline-block;
  } 
`;
const action = css`
  text-decoration: none;
  color: ${defaultTheme.color.link};
  font-size: 0.8em;
  border: 2px solid ${defaultTheme.color.link};
  border-radius: 2px;
  text-transform: uppercase;
  box-sizing: border-box;
  padding: 7px 10px;
  letter-spacing: 0.5px;
  &:hover {
    background: ${defaultTheme.color.hover});
    color: ${defaultTheme.color.link});
  }
  &:after {
    background: 0 0;
  }
`;

const Excerpt = css`
  margin-top: ${defaultTheme.space[1]};
  display: block;
  max-width: 500px;
`;

const hidden = css`
  display: none;
  ${mq[2]} {
    background: var(--bg);
    display: block;
    position: relative;
    height: 24px;
    width: ${defaultTheme.width[2]};
    bottom: 23px;
  } 
`;

const TextWrapper = styled.div`
  margin-top: ${defaultTheme.space[3]};
  ${mq[2]} {
    padding-left: ${defaultTheme.space[3]};
    padding-right: ${defaultTheme.space[3]};
    margin-top: -26px;
  } 
`;

const ProjectWrapper = styled.div`
  margin: auto 0;
`;

const Projects = css`
  &:not(:last-child) {
    padding-bottom: ${defaultTheme.space[7]};
    margin-bottom: ${defaultTheme.space[7]};
    border-bottom: 1px solid var(--border);
  }
`;

const SectionContainer = styled.div`
  margin: auto;
  padding: 0 ${defaultTheme.space[5]} 0 ${defaultTheme.space[5]};
  ${mq[2]} {
    max-width: ${defaultTheme.width[2]};
    padding: 0;
  } 
`;

const ImageWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30px, 3fr));
  grid-row: auto auto;
  grid-column-gap: 16px;

  &::-webkit-scrollbar {
    display: none;
  }
  img {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  ${mq[2]} {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    -webkit-overflow-scrolling: touch;
    padding-left: ${defaultTheme.space[3]};
    grid-column-gap: 24px;
    overflow: auto;
    padding-bottom: ${defaultTheme.space[3]};

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
          <script async src="https://cdn.splitbee.io/sb.js"></script>

        </Helmet>
        <Header>
          <Nav />

          <Menu />
        </Header>
        <SectionWrapper>
          {data.allMarkdownRemark.edges.map(({ node }) => (
            <div css={Projects} key={node.id}>
              <ProjectWrapper>
                <SectionContainer>
                  <ImageWrapper>
                    <Img
                      sizes={node.frontmatter.image1.childImageSharp.fluid}
                    />
                    <Img
                      sizes={node.frontmatter.image2.childImageSharp.fluid}
                    />
                    <Img
                      sizes={node.frontmatter.image3.childImageSharp.fluid}
                    />
                    <Img
                      sizes={node.frontmatter.image4.childImageSharp.fluid}
                    />
                   
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
                </SectionContainer>
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
      filter: { frontmatter: { section: { eq: "blog" } } }
      sort: { frontmatter: { customField: ASC } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date
            excerpt
            customField
            image1 {
              childImageSharp {
                fluid(maxWidth: 700) {
                  ...GatsbyImageSharpFluid
                }
              }
            }

            image2 {
              childImageSharp {
                fluid(maxWidth: 700) {
                  ...GatsbyImageSharpFluid
                }
              }
            }

            image3 {
              childImageSharp {
                fluid(maxWidth: 700) {
                  ...GatsbyImageSharpFluid
                }
              }
            }

            image4 {
              childImageSharp {
                fluid(maxWidth: 700) {
                  ...GatsbyImageSharpFluid
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
