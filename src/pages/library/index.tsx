import { useState, useEffect, useRef } from "react";
import Nav from "../../components/Nav";
import Menu from "../../components/Menu";
import {
  MediumSectionWrapper,
  Grid,
  CoverTitle,
} from "../../styles/styles";
import Page from "../../components/Page";
import Header from "../../components/Header";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import styled from "@emotion/styled";

const BookCard = styled.div`
  position: relative;
  width: 220px;
  margin: 0 auto 2.5rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.5rem 1rem 1rem 1rem;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
`;

const BookImage = styled.img`
  width: 120px;
  height: 180px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
`;

const BookDate = styled.div`
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 0.5rem;
`;

const BookLink = styled.a`
  color: #007acc;
  text-decoration: underline;
  font-size: 0.98rem;
`;

interface BookNode {
  id: string;
  title: string;
  properties: {
    Date_Read?: {
      value?: {
        start?: string;
      };
    };
    URL?: {
      value?: string;
    };
    Image?: {
      value?: Array<{
        type?: string;
        name?: string;
        external?: {
          url?: string;
        };
      }>;
    };
    Type?: {
      value?: {
        name?: string;
        color?: string;
      };
    };
  };
}

interface LibraryProps {
  data: {
    books: {
      edges: Array<{
        node: BookNode;
      }>;
    };
  };
}

const LibraryPage: React.FC<LibraryProps> = ({ data }) => {
  const bookItems = data.books.edges
    .filter(({ node }) => node.properties.Type?.value?.name === "Book")
    .sort((a, b) => {
      const dateA = a.node.properties.Date_Read?.value?.start;
      const dateB = b.node.properties.Date_Read?.value?.start;
      
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1; // items without dates go to the end
      if (!dateB) return -1;
      
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

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
          A collection of books I've read and recommend. Each one has shaped my thinking or inspired me in some way.
        </p>
      </MediumSectionWrapper>
      <Grid>
        {bookItems.map(({ node }) => {
          const imageUrl = node.properties.Image?.value?.[0]?.external?.url;
          const readDate = node.properties.Date_Read?.value?.start;
          const bookUrl = node.properties.URL?.value;

          return (
            <BookCard key={node.id}>
              {imageUrl && (
                <BookImage 
                  src={imageUrl} 
                  alt={node.title}
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <CoverTitle>
                {bookUrl ? (
                  <BookLink href={bookUrl} target="_blank" rel="noopener noreferrer">
                    {node.title}
                  </BookLink>
                ) : (
                  node.title
                )}
              </CoverTitle>
              {readDate && (
                <BookDate>
                  {new Date(readDate).getFullYear()}
                </BookDate>
              )}
            </BookCard>
          );
        })}
      </Grid>
    </Page>
  );
};

export default LibraryPage;

export const BooksQuery = graphql`
  query LibraryBooksQuery {
    books: allNotion {
      edges {
        node {
          id
          title
          properties {
            Date_Read: Date_Read {
              value {
                start
              }
            }
            URL {
              value
            }
            Image {
              value {
                type
                name
                external {
                  url
                }
              }
            }
            Type {
              value {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`; 