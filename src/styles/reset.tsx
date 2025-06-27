import { Global, css } from "@emotion/react";
import * as React from 'react'
import defaultTheme from "../components/Theme";

export const GlobalStyle = () => (
  <Global
    styles={css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html {
        font-family: ${defaultTheme.fonts.body};
        -webkit-font-smoothing: antialiased;
        font-smoothing: antialiased;
        font-size: 62.5%;
        line-height: 1.8;

      }

 
      body {
        width: 100%;
        background: var(--bg);
        font-size: 1.8rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        color: ${defaultTheme.color.text};
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }

      @media (prefers-color-scheme: light) {
        body {
          --bg: white;
          --link: #0050e6;
          --text: #000000;
          --border: rgba(0, 0, 0, 0.1);
          --shadow: rgba(0, 0, 0, 0.04);
          --callout: rgba(0,0,0, .03);
          --blockquote: rgba(255, 207, 184, 0.30);
          --hover: #E6F0FD;
        }
     }
      
      @media (prefers-color-scheme: dark) {
         body {
           --bg: rgb(5,5,5);
           --link: rgb(255, 149, 0);
           --text: rgb(227, 228, 232);
           --border: rgba(255, 255, 255, 0.1);
           --shadow: rgba(255,255,255, .04);
           --callout: rgba(255,255,255, .03);
           --blockquote: rgba(150, 196, 226, 0.5);
           --hover: #2D2D2D;
         }
      }
      
      img {
        user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
      }

      ::selection {
        background: rgb(255, 245, 177);
      }

      ul {
        padding: ${defaultTheme.space[1]} 0 ${defaultTheme.space[4]};
      }

      ul ul {
        padding: 0 0 0;
      }

      h1 {
        font-weight: 500;
      }

      h2 {
        font-weight: 400;
        font-size: 1.889rem;
      }

      li {
        padding: 4px 0;
      }

      .hide {
        display: none;
      }

      .show:active .hide {
        display: block;
      }

      @media (max-width: 450px) {
        :focus {
          outline: none;
        }

        body {
          line-height: 1.7;
        }
      }

      a,
      a:link,
      a:visited,
      a:focus,
      a:hover,
      a:active {
        color: ${defaultTheme.color.link};
        text-decoration: none;
        border-bottom: 1px solid ${defaultTheme.color.link};
        padding: 0 0 2px;
        -webkit-transition: 0.1s ease-in background;
        transition: 0.1s ease-in background;
      }

      figcaption {
        margin: 0 auto;
        padding: 8px 0;
        text-align: center;
        color: ${defaultTheme.color.gray};
        font-size: ${defaultTheme.fontSizes[1]};
      }
      .gatsby-resp-image-wrapper {
        border: 1px solid rgba(0, 0, 0, 0.05);
      }

      
      @media (hover: hover) {
        a:hover {
          background: var(--hover);
        }
      }

      
      @media (max-width: 1260px) {
        .wrapper .gatsby-image-wrapper {
          width: 40vw;
        }
      }

      @media (max-width: 850px) {
        .wrapper .gatsby-image-wrapper {
          width: 60vw;
        }
      }

      @media (max-width: 450px) {
        .wrapper .gatsby-image-wrapper {
          width: 80vw;
        }
      }

      /* Anchor link styles */
      .anchor.before {
        position: absolute;
        top: 0;
        left: 0;
        transform: translateX(-100%);
        padding-right: 4px;
        border-bottom: none;
      }
      
      .anchor.before svg {
        visibility: hidden;
      }
      
      h1:hover .anchor.before svg,
      h2:hover .anchor.before svg,
      h3:hover .anchor.before svg,
      h4:hover .anchor.before svg,
      h5:hover .anchor.before svg,
      h6:hover .anchor.before svg {
        visibility: visible;
      }
      
      h1, h2, h3, h4, h5, h6 {
        position: relative;
      }
    `}
  />
);
