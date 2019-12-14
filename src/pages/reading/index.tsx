/** @jsx jsx */

import { Component } from "react";
import { graphql } from 'gatsby';
import { css, jsx } from "@emotion/core";
import Nav from "../../components/Nav";
import Menu from "../../components/Menu";
import Page from "../../components/Page";
import { MediumSectionWrapper } from "../../styles/styles";
import Header from "../../components/Header";
import { Helmet } from "react-helmet";
import Img from "gatsby-image";

const ul = css`
  padding-top: 16px;
`;

const reading = ({ data }) => {
  return (
     <div>
       {data.books.edges.map(({ node }) => (
             <div>
               {node.name}
               <Img fluid={node.image.src.childImageSharp.fluid} />
               </div>

               
         ))}

     </div>
  )
}

export default reading;

export const BooksQuery = graphql`
  query {
    books: allBooksJson(sort: { fields: [name], order: ASC }) {
      edges {
        node {
          slug
          name
          url
          image {
            src {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
            }
             
          }
        }
      }
    }
  }
`