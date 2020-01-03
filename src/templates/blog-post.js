/** @jsx jsx */
import styled from "@emotion/styled";
import { graphql } from "gatsby";
import React from "react";
import { css, jsx } from "@emotion/core";
import Link from "gatsby-link";
import RehypeReact from "rehype-react"; // This is so I can write components in my markdown file
import Content from "../components/Blog/Content/index.tsx";
import H1 from "../components/Blog/H1/index.tsx";
import H2 from "../components/Blog/H2/index.tsx";
import H3 from "../components/Blog/H3/index.tsx";
import ContentTitle from "../components/Blog/ContentTitle/index.tsx";
import ContentExcerpt from "../components/Blog/ContentExcerpt/index.tsx";
import UnorderedList from "../components/Blog/List/UnorderedList/index.tsx";
import OrderedList from "../components/Blog/List/OrderedList/index.tsx";
import BlogButton from "../components/Blog/BlogButton/index.tsx";
import Summary from "../components/Blog/Summary/index.tsx";
import Callout from "../components/Blog/Callout/index.tsx";
import Blockquote from "../components/Blog/Blockquote/index.tsx";
import Page from "../components/Page/index.tsx";
import Header from "../components/Header/index.tsx";
import Nav from "../components/Nav/index.tsx";
import Menu from "../components/Menu/index.tsx";
import Button from "../components/Button/index.tsx";
import GIF from "../components/GIF/index.tsx";
import "../styles/styles.tsx";
import { mq } from "../styles/styles";
import { Helmet } from "react-helmet";
import defaultTheme from "../components/Theme";

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {
    p: Content,
    h1: H1,
    h2: H2,
    h3: H3,
    gif: GIF,
    ul: UnorderedList,
    ol: OrderedList,
    "blog-button": BlogButton,
    "button-visit": Button,
    "content-title": ContentTitle,
    "content-excerpt": ContentExcerpt,
    summary: Summary,
    callout: Callout,
    blockquote: Blockquote
  }
}).Compiler;

const Footer = styled.footer`
  max-width: ${defaultTheme.width[1]};
  margin: ${defaultTheme.space[8]} 0 auto;
`;

const SectionLinks = css`
  padding: ${defaultTheme.space[4]} 0 0 0;
  display: grid;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  grid-template-columns: 15ch auto;
`;

const SectionLinksPrevious = css`
  text-align: left;
`;

const SectionLinksNext = css`
  text-align: right;
`;

const ContentWrapper = styled.div`
  max-width: ${defaultTheme.width[1]};
  margin: ${defaultTheme.space[11]} auto 0;
  padding: 0 ${defaultTheme.space[3]};

  li {
    padding: ${defaultTheme.space[1]} 0 ${defaultTheme.space[2]};
  }

  ${mq[1]} {
    max-width: ${defaultTheme.width[2]};
  }

  ${mq[0]} {
    margin: 0 auto;
    padding: ${defaultTheme.space[11]} ${defaultTheme.space[3]} 0;
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
        <Footer>
          <div css={SectionLinks}>
            <div css={SectionLinksPrevious}>
              <p>
                {prev && (
                  <Link to={prev.fields.slug}>{prev.frontmatter.title}</Link>
                )}
              </p>
            </div>
            <div css={SectionLinksNext}>
              <p>
                {next && (
                  <Link to={next.fields.slug}>{next.frontmatter.title}</Link>
                )}
              </p>
            </div>
          </div>
        </Footer>
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
