/** @jsx jsx */

import { css, jsx } from "@emotion/react";
import Nav from "../../components/Nav";
import Menu from "../../components/Menu";
import {
  MediumSectionWrapper,
  Grid,
  CoverTitle
} from "../../styles/styles";
import Page from "../../components/Page";
import Header from "../../components/Header";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";

const CoverStyle = css`
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

interface MusicNode {
  id: string;
  title: string;
  properties: {
    Date?: { 
      value: {
        start?: string;
        end?: string;
        timeZone?: string;
      };
    };
    URL?: { 
      value: {
        url?: string;
        caption?: string;
      };
    };
    Image?: { 
      value: {
        url?: string;
        caption?: string;
        type?: string;
      };
    };
    Type?: { 
      value: {
        name?: string;
        color?: string;
      };
    };
  };
  updatedAt: string;
}

interface MusicProps {
  data: {
    music: {
      edges: Array<{
        node: MusicNode;
      }>;
    };
  };
}

const MusicPage: React.FC<MusicProps> = ({ data }) => {
  // Filter for music items in JavaScript since GraphQL filtering is complex
  const musicItems = data.music.edges.filter(({ node }) => {
    return node.properties.Type && node.properties.Type.value?.name === "Music";
  });

  return (
    <Page>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Music | Sam Chang</title>
        <meta http-equiv="x-ua-compatible" content="ie=edge; chrome=1" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>
      <Header>
        <Nav title="Music" />
        <Menu />
      </Header>
      <MediumSectionWrapper>
        <p>
          <p>
            Written and produced by{" "}
            <a href="http://groveralleyway.com">Grover Alleyway</a>.
            All tunes created on a laptop computer using Ableton Live software
            to control and mix VST plugins as well as manipulations of audio
            recordings.
          </p>
        </p>
      </MediumSectionWrapper>
      <Grid>
        {musicItems.map(({ node }) => (
          <div key={node.id}>
            <a href={node.properties.URL?.value?.url} target="_blank" rel="noopener noreferrer">
              {/* If you want to use Gatsby image, you need to process the image URLs with gatsby-plugin-image or gatsby-image. For now, use a simple img tag. */}
              <img
                css={CoverStyle}
                src={node.properties.Image?.value?.url}
                alt={node.title}
                style={{ width: "100%", height: "auto" }}
              />
              <CoverTitle>{node.title}</CoverTitle>
            </a>
            <p>{node.properties.Date?.value?.start}</p>
          </div>
        ))}
      </Grid>
    </Page>
  );
};

export default MusicPage;

export const MusicQuery = graphql`
  query {
    music: allNotion(
      sort: { updatedAt: DESC }
    ) {
      edges {
        node {
          id
          title
          properties {
            Date {
              value {
                start
                end
                timeZone
              }
            }
            URL {
              value {
                url
                caption
              }
            }
            Image {
              value {
                url
                caption
                type
              }
            }
            Type {
              value {
                name
                color
              }
            }
          }
          updatedAt
        }
      }
    }
  }
`;
