/** @jsx jsx */
import styled from "@emotion/styled";
import { graphql } from "gatsby";
import React from "react";
import { css, jsx } from "@emotion/core";
import Link from "gatsby-link";
import { HeaderWrapper } from "../styles/styles.js";
import { Container } from "../styles/styles.js";
import RehypeReact from "rehype-react"; // This is so I can write components in my markdown file
import Content from "../components/Blog/Content";
import ContentHeader from "../components/Blog/ContentHeader";
import ContentSubhead from "../components/Blog/ContentSubhead";
import ContentTitle from "../components/Blog/ContentTitle";
import ContentExcerpt from "../components/Blog/ContentExcerpt";
import Page from "../components/Page";
import Nav from "../components/Nav";
import Menu from "../components/Menu";
import Button from "../components/Button";
import GIF from "../components/GIF";
import "../styles/styles.js";
import { Helmet } from "react-helmet";

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {
    content: Content,
    "content-header": ContentHeader,
    gif: GIF,
    "content-subhead": ContentSubhead,
    "button-visit": Button,
    "content-title": ContentTitle,
    "content-excerpt": ContentExcerpt
  }
}).Compiler;

const Footer = css`
  max-width: var(--global-width);
  margin: 64px 0 auto;
`;
const SectionLinks = css`
  padding: 32px 0px;
  display: grid;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  grid-template-columns: 20ch auto;
`;
const SectionLinks__Previous = css`
  text-align: left;
`;
const SectionLinks__Next = css`
  text-align: right;
`;
const ContentWrapper = styled.div`
  max-width: var(--global-width);
  margin: 24px auto;
  padding: 0px var(--content-padding);

  @media (max-width: 950px) {
    max-width: 100%;
  }

  @media (max-width: 425px) {
    margin: 0px auto;
    padding: 104px var(--content-padding) 0px;
  }
`;

export default ({ data, pageContext }) => {
  const post = data.markdownRemark;

  const { next, prev } = pageContext;
  return (
    <Container>
      <Page>
        <Helmet
          title={post.frontmatter.title + " | Sam Chang"}
          meta={[
            {
              name: "viewport",
              content:
                "width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
            }
          ]}
        />
        <HeaderWrapper>
          <Nav title={post.frontmatter.title} />
          <Menu />
        </HeaderWrapper>
        <ContentWrapper>
          {renderAst(post.htmlAst)}
          <div css={Footer}>
            <div css={SectionLinks}>
              <div css={SectionLinks__Previous}>
                <p>
                  {prev && (
                    <Link to={prev.fields.slug}>{prev.frontmatter.title}</Link>
                  )}
                </p>
              </div>
              <div css={SectionLinks__Next}>
                <p>
                  {next && (
                    <Link to={next.fields.slug}>{next.frontmatter.title}</Link>
                  )}
                </p>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </Page>
    </Container>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      frontmatter {
        title
      }
    }
  }
`;
