/** @jsx jsx */
import styled from "@emotion/styled";
import { graphql, Link } from "gatsby";
import React, { useEffect } from "react";
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
import { CaseStudyViewProvider, useCaseStudyView } from "../components/CaseStudyView/CaseStudyViewContext";
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

// Raw HTML tag proxies for media/leaf elements only (avoid container divs/sections)
const RawImg = (props) => React.createElement('img', props);
const RawFigure = (props) => React.createElement('figure', props);
const RawFigcaption = (props) => React.createElement('figcaption', props);
const RawPicture = (props) => React.createElement('picture', props);
const RawSource = (props) => React.createElement('source', props);
const RawNoscript = (props) => React.createElement('noscript', props);

// Lenient for images: render media unfiltered; rely on visualsExclude to hide
const PlainImg = (props) => RawImg(props);
const PlainFigure = (props) => RawFigure(props);
const PlainFigcaption = (props) => RawFigcaption(props);
const PlainPicture = (props) => RawPicture(props);
const PlainSource = (props) => RawSource(props);
const PlainNoscript = (props) => RawNoscript(props);

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
    // Media elements are lenient in Visuals: always render, with visualsExclude to hide
    img: PlainImg,
    figure: PlainFigure,
    figcaption: PlainFigcaption,
    picture: PlainPicture,
    source: PlainSource,
    noscript: PlainNoscript,
    
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
  const excludePatterns = (post.frontmatter && post.frontmatter.visualsExclude) || [];

  // Client-side exclusion for specific images in Visuals view
  const ExclusionManager = () => {
    const { view } = useCaseStudyView();
    useEffect(() => {
      if (!Array.isArray(excludePatterns) || excludePatterns.length === 0) return;

      const markExcluded = (shouldExclude) => {
        excludePatterns.forEach((pattern) => {
          if (!pattern) return;
          const selector = `img[src*="${pattern}"] , source[srcset*="${pattern}"] , a[href*="${pattern}"]`;
          document.querySelectorAll(selector).forEach((el) => {
            // If inside a <figure>, hide the entire figure (caption included)
            const figure = el.closest('figure.gatsby-resp-image-figure, figure');
            if (figure) {
              if (shouldExclude) figure.setAttribute('data-visual-excluded', 'true');
              else figure.removeAttribute('data-visual-excluded');
              return;
            }

            // Else prefer the Gatsby wrapper span/div
            const wrapper = el.closest('.gatsby-resp-image-wrapper');
            const target = wrapper || el;
            if (shouldExclude) target.setAttribute('data-visual-excluded', 'true');
            else target.removeAttribute('data-visual-excluded');

            // Also hide adjacent figcaption spans Gatsby may emit
            const maybeCaption = target.nextElementSibling;
            if (maybeCaption && maybeCaption.classList && maybeCaption.classList.contains('gatsby-resp-image-figcaption')) {
              if (shouldExclude) maybeCaption.setAttribute('data-visual-excluded', 'true');
              else maybeCaption.removeAttribute('data-visual-excluded');
            }
          });
        });
      };

      if (view === 'visuals') {
        markExcluded(true);
      } else {
        markExcluded(false);
      }
    }, [view]);
    return null;
  };

  // Ensure anchor links work with visuals/process toggle
  const AnchorViewSync = () => {
    const { setView } = useCaseStudyView();
    useEffect(() => {
      const ensureVisibleForHash = () => {
        if (typeof window === 'undefined') return;
        const raw = window.location.hash || '';
        if (!raw) return;
        const id = decodeURIComponent(raw.replace(/^#/, ''));
        const headerOffset = 96; // matches scroll-margin-top
        const scrollToId = (smooth = true) => {
          const t = document.getElementById(id);
          if (!t) return;
          const rect = t.getBoundingClientRect();
          const top = window.pageYOffset + rect.top - headerOffset;
          if (smooth) {
            window.scrollTo({ top, behavior: 'smooth' });
          } else {
            window.scrollTo({ top });
          }
        };
        const scheduleScrolls = () => {
          // Smooth first, then adjust once layout settles
          scrollToId(true);
          setTimeout(() => scrollToId(false), 180);
          setTimeout(() => scrollToId(false), 360);
          // Allow guard to re-enable after anchor-driven scrolls complete
          setTimeout(() => { try { (window).__cs_anchor_nav = false; } catch (e) {} }, 800);
        };

        let observer;
        const setupObserver = () => {
          if (observer) observer.disconnect();
          observer = new MutationObserver(() => {
            const t = document.getElementById(id);
            if (!t) return; // still not in DOM
            const wrapEl = t.closest('[data-cs-wrap]');
            const visible = !wrapEl || wrapEl.getAttribute('data-visible') === 'true';
            if (visible) {
              observer.disconnect();
              // Defer one tick to allow layout after expand
              setTimeout(scheduleScrolls, 0);
            }
          });
          observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
        };

        const target = document.getElementById(id);
        if (!target) {
          // Switch to Process so hidden sections mount, then observe and scroll
          try { (window).__cs_anchor_nav = true; } catch (e) {}
          setView('process');
          setupObserver();
          return;
        }
        const wrap = target.closest('[data-cs-wrap]');
        const hiddenByView = wrap && wrap.getAttribute('data-visible') === 'false';
        if (hiddenByView) {
          try { (window).__cs_anchor_nav = true; } catch (e) {}
          setView('process');
          setupObserver();
        } else {
          // Target already visible
          scheduleScrolls();
        }
      };

      // Initial load and when view changes
      // Run twice: once now, once next tick to ensure DOM committed
      ensureVisibleForHash();
      const id = setTimeout(ensureVisibleForHash, 0);
      window.addEventListener('hashchange', ensureVisibleForHash);
      return () => {
        clearTimeout(id);
        window.removeEventListener('hashchange', ensureVisibleForHash);
      };
    }, [setView]);
    return null;
  };

  // Prevent auto-scroll on manual toggles when a hash is present
  const ViewScrollGuard = () => {
    const { view } = useCaseStudyView();
    const prevViewRef = React.useRef(view);
    useEffect(() => {
      if (typeof window === 'undefined') return;
      const prev = prevViewRef.current;
      prevViewRef.current = view;
      if (prev === view) return; // not a toggle
      if (!window.location.hash) return;
      // Skip guard for anchor-driven navigations
      try { if ((window).__cs_anchor_nav) return; } catch (e) {}
      const y = window.scrollY || window.pageYOffset;

      // Freeze body to prevent browser auto-anchoring during DOM changes
      const body = document.body;
      const orig = {
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
      };
      body.style.position = 'fixed';
      body.style.top = `-${y}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';

      const unfreeze = () => {
        body.style.position = orig.position;
        body.style.top = orig.top;
        body.style.left = orig.left;
        body.style.right = orig.right;
        body.style.width = orig.width;
        window.scrollTo({ top: y });
      };

      const t = setTimeout(unfreeze, 420);
      return () => {
        clearTimeout(t);
        unfreeze();
      };
    }, [view]);
    return null;
  };


  const showToggle = post && post.fields && post.fields.slug !== '/design-leadership';

  return (
    <CaseStudyViewProvider>
      <Page floatingSlot={showToggle ? <Toggle /> : null}> 
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
          {/* Hide excluded media when in Visuals view */}
          <style>{`
            html[data-case-study-view="visuals"] [data-visual-excluded="true"] {
              display: none !important;
            }
            html[data-case-study-view="visuals"] [data-visual-excluded="true"] + .gatsby-resp-image-figcaption {
              display: none !important;
            }
          `}</style>
        </Helmet>
        <ExclusionManager />
        <AnchorViewSync />
        <ViewScrollGuard />
        {renderAst(post.htmlAst)}
        {/* <Footer>
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
          </Footer> */}
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
        visualsExclude
      }
    }
  }
`;
