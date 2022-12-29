/** @jsx jsx */

import styled from "@emotion/styled";
import { graphql } from "gatsby";
import { css, jsx } from "@emotion/react";
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

const library = ({ data }) => {
  return (
    <Page>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Library | Sam Chang</title>
        <meta http-equiv="x-ua-compatible" content="ie=edge; chrome=1" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>
      <Header>
        <Nav title="Library" />
        <Menu />
      </Header>
      <MediumSectionWrapper>
        <p>
          Reading is a big part of my life. Here are the books I've read in 2022 so far. For a full list of books I've read over the years, please visit my <a href="https://www.librarything.com/catalog/samchang">LibraryThing catalog</a>. I also try to take notes as I read, which you can <a href="https://www.notion.so/samchang/91d9159c48c144b8bdcb3ff2a595d369?v=c591ebc4b67b43d5a6198d31176018ff">check out here</a>. 
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

export default library;

export const BooksQuery = graphql`
  query {
    books: allBooksJson(sort: {date: DESC}) {
      edges {
        node {
          title
          url
          author
          date
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
