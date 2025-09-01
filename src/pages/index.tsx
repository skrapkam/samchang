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
  ${mq[1]} {
    display: none;
    width: 0;
  }
  ${mq[0]} {
    display: none;
    width: 0;
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
    background: white;
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
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-column-gap: 16px;
  grid-row-gap: 16px;

  &::-webkit-scrollbar {
    display: none;
  }
  
  .gatsby-image-wrapper {
    width: 100% !important;
    /* keep a consistent rectangle; allow letterboxing */
    aspect-ratio: 16 / 9;
    height: auto !important;
    padding-bottom: 0 !important; /* override intrinsic ratio padding */
    background: #fff;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
  }
  
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  ${mq[2]} {
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 24px;
    padding-left: ${defaultTheme.space[3]};
    padding-right: ${defaultTheme.space[3]};
    padding-bottom: ${defaultTheme.space[3]};
  } 
  
  /* Enable swipeable carousel on tablets/phones */
  ${mq[1]} {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 80vw;
    grid-template-columns: unset;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    column-gap: 16px;
    padding-left: ${defaultTheme.space[3]};
    padding-right: ${defaultTheme.space[3]};
  }

  ${mq[1]} .gatsby-image-wrapper {
    scroll-snap-align: start;
    width: 80vw !important;
    height: auto !important;
  }

  ${mq[0]} {
    grid-auto-columns: 90vw;
  }

  ${mq[0]} .gatsby-image-wrapper {
    width: 90vw !important;
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
                      fluid={node.frontmatter.image1.childImageSharp.fluid}
                      imgStyle={{ objectFit: "cover", objectPosition: "center top" }}
                      style={{ width: "100%" }}
                    />
                    <Img
                      fluid={node.frontmatter.image2.childImageSharp.fluid}
                      imgStyle={{ objectFit: "cover", objectPosition: "center" }}
                      style={{ width: "100%" }}
                    />
                    <Img
                      fluid={node.frontmatter.image3.childImageSharp.fluid}
                      imgStyle={{ objectFit: "cover", objectPosition: "center" }}
                      style={{ width: "100%" }}
                    />
                    {node.frontmatter.image4 && (
                      <Img
                        fluid={node.frontmatter.image4.childImageSharp.fluid}
                        imgStyle={{ objectFit: "cover", objectPosition: "center" }}
                        style={{ width: "100%" }}
                      />
                    )}
                   
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
