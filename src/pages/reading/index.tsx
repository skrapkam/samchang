/** @jsx jsx */

import styled from "@emotion/styled";
import { graphql } from "gatsby";
import { css, jsx } from "@emotion/core";
import Nav from "../../components/Nav";
import Menu from "../../components/Menu";
import Page from "../../components/Page";
import { MediumSectionWrapper, Grid, CoverTitle } from "../../styles/styles";
import Header from "../../components/Header";
import { Helmet } from "react-helmet";
import Img from "gatsby-image";

const BookStyle = css`
  max-width: 50vw;
`;

const BookGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  @media (max-width: 450px) {
    grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  }
`;

const reading = ({ data }) => {
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
      <Header>
        <Nav title="Reading" />
        <Menu />
      </Header>
      <MediumSectionWrapper>
        <p>
          A list of books that have shaped who I am, how I work, or how I think
          about the world around me. 
        </p>
      </MediumSectionWrapper>

      <BookGrid>
        {data.books.edges.map(({ node }) => (
          <div>
            <a href={node.url}>
              <Img
                css={BookStyle}
                fluid={node.image.src.childImageSharp.fluid}
              />
              <CoverTitle>{node.title}</CoverTitle>
            </a>
            <p>{node.author}</p>
          </div>
        ))}
      </BookGrid>
    </Page>
  );
};

export default reading;

export const BooksQuery = graphql`
  query {
    books: allBooksJson(sort: { fields: [title], order: ASC }) {
      edges {
        node {
          title
          url
          author
          image {
            src {
              childImageSharp {
                fluid(maxWidth: 650) {
                  ...GatsbyImageSharpFluid_tracedSVG
                }
              }
            }
          }
        }
      }
    }
  }
`;
