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
    date?: { value: string };
    url?: { value: string };
    image?: { 
      value: {
        url?: string;
        caption?: string;
        type?: string;
      };
    };
    type?: { 
      value: {
        name?: string;
        color?: string;
      };
    };
    Date?: { value: string };
    URL?: { value: string };
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
  // For now, show all items until we figure out the schema
  const musicItems = data.music.edges;

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
            <CoverTitle>{node.title}</CoverTitle>
            <p>ID: {node.id}</p>
            <p>Updated: {node.updatedAt}</p>
            {/* Debug: Show what properties we have */}
            <p>Date: {node.properties.date?.value || node.properties.Date?.value || 'No date'}</p>
            <p>URL: {node.properties.url?.value || node.properties.URL?.value || 'No URL'}</p>
            <p>Image URL: {node.properties.image?.value?.url || node.properties.Image?.value?.url || 'No image'}</p>
            <p>Type: {node.properties.type?.value?.name || node.properties.Type?.value?.name || 'No type'}</p>
            {/* We'll add proper rendering once we know the property structure */}
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
            # Try common property names
            date {
              value
            }
            url {
              value
            }
            image {
              value {
                url
                caption
                type
              }
            }
            type {
              value {
                name
                color
              }
            }
            # Alternative property names
            Date {
              value
            }
            URL {
              value
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
