/** @jsx jsx */
import styled from "@emotion/styled";
import { graphql, Link } from "gatsby";
import React from "react";
import { css, jsx } from "@emotion/react";
import RehypeReact from "rehype-react";
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

// View toggle + selective render plumbing
import { CaseStudyViewProvider } from "../components/CaseStudyView/CaseStudyViewContext";
import Toggle from "../components/CaseStudyView/Toggle";
import VisualBlock from "../components/CaseStudyView/VisualBlock";
import withViewFilter from "../components/CaseStudyView/withViewFilter";

// ✅ Add these imports
import { ClickablePrompt } from "../components/ChatBot";
import PromptContainer from "../components/Blog/PromptContainer";

// Wrap components so in Visuals view they only render if explicitly marked
const VContent = withViewFilter(Content);
const VH1 = withViewFilter(H1);
const VH2 = withViewFilter(H2);
const VH3 = withViewFilter(H3);
const VUnorderedList = withViewFilter(UnorderedList);
const VOrderedList = withViewFilter(OrderedList);
const VBlogButton = withViewFilter(BlogButton);
const VSummary = withViewFilter(Summary);
const VCallout = withViewFilter(Callout);
const VBlockquote = withViewFilter(Blockquote);
const VGIF = withViewFilter(GIF);
const VContentTitle = withViewFilter(ContentTitle);
const VContentExcerpt = withViewFilter(ContentExcerpt);

// (Reverted) No raw tag filtering — rely on curated components only

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {
    // Default components, wrapped to honor Visuals filtering
    p: VContent,
    h1: VH1,
    h2: VH2,
    h3: VH3,
    gif: VGIF,
    ul: VUnorderedList,
    ol: VOrderedList,
    "blog-button": VBlogButton,
    "button-visit": Button,
    button: Button,
    Button: Button,
    link: Link,
    Link: Link,
    "content-title": VContentTitle,
    "content-excerpt": VContentExcerpt,
    summary: VSummary,
    callout: VCallout,
    blockquote: VBlockquote,
    
    // New shortcode to explicitly mark curated Visuals content
    visual: VisualBlock,
    "clickable-prompt": ClickablePrompt,
    "prompt-container": PromptContainer,
  },
}).Compiler;

const Footer = styled.footer`
  max-width: ${defaultTheme.width[1]};
  margin: ${defaultTheme.space[8]} auto 0;
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
  margin: 0 auto 0;
  padding: ${defaultTheme.space[11]} ${defaultTheme.space[3]};
  padding-bottom: ${defaultTheme.space[3]};

  li {
    margin: 2.4rem auto ${defaultTheme.space[3]};
    padding: 0;
  }

  ${mq[1]} {
    max-width: ${defaultTheme.width[2]};
  }

  ${mq[0]} {
    margin: 0 auto;
    padding: ${defaultTheme.space[11]} ${defaultTheme.space[3]} 0;
  }
`;

const BlogPostTemplate = ({ data, pageContext }) => {
  const post = data.markdownRemark;
  const { next, prev, slug } = pageContext;


  return (
    <CaseStudyViewProvider>
      <Page floatingSlot={<Toggle />}> 
      <Helmet
        title={post.frontmatter.title + " | Sam Chang"}
        meta={[
          {
            name: "viewport",
            content:
              "width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover",
          },
        ]}
      />
      <Header>
        <Nav
          title={post.frontmatter.title}
          parentTitle={pageContext.parentTitle}
          parentSlug={pageContext.parentSlug}
        />
        <Menu />
      </Header>
      <ContentWrapper>
        <Helmet>
          {/* Preload custom font for the bottom-left toggle */}
          <link
            rel="preload"
            href="/fonts/BerkeleyMonoTrial-Regular.otf"
            as="font"
            type="font/otf"
          />
        </Helmet>
        {renderAst(post.htmlAst)}
        <Footer>
            <div css={SectionLinks}>
              <div css={SectionLinksPrevious}>
                <p>
                  {prev && prev.fields && (
                    <Link to={prev.fields.slug}>{prev.frontmatter.title}</Link>
                  )}
                </p>
              </div>
              <div css={SectionLinksNext}>
                <p>
                  {next && next.fields && (
                    <Link to={next.fields.slug}>{next.frontmatter.title}</Link>
                  )}
                </p>
              </div>
            </div>
          </Footer>
        </ContentWrapper>

        {/* Chatbot mounted globally */}
      </Page>
    </CaseStudyViewProvider>
  );
};

export default BlogPostTemplate;

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
