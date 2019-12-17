/** @jsx jsx */
import styled from "@emotion/styled";
import { graphql } from "gatsby";
import React from "react";
import { css, jsx } from "@emotion/core";
import Link from "gatsby-link";
import RehypeReact from "rehype-react"; // This is so I can write components in my markdown file
import Content from "../components/Blog/Content/index.tsx";
import ContentHeader from "../components/Blog/ContentHeader/index.tsx";
import ContentSubhead from "../components/Blog/ContentSubhead/index.tsx";
import ContentTitle from "../components/Blog/ContentTitle/index.tsx";
import ContentExcerpt from "../components/Blog/ContentExcerpt/index.tsx";
import Summary from "../components/Blog/Summary/index.tsx";
import Page from "../components/Page/index.tsx";
import Header from "../components/Header/index.tsx";
import Nav from "../components/Nav/index.tsx";
import Menu from "../components/Menu/index.tsx";
import Button from "../components/Button/index.tsx";
import GIF from "../components/GIF/index.tsx";
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
    "content-excerpt": ContentExcerpt,
    summary: Summary
  }
}).Compiler;

const Footer = css`
  max-width: var(--global-width);
  margin: 64px 0 auto;
`;
const SectionLinks = css`
  padding: 32px 0 0 0;
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
  margin: 120px auto 0;
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
      <Header>
        <Nav title={post.frontmatter.title} />
        <Menu />
      </Header>
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
