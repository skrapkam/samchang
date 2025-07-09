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
    Release_Date?: {
      value: {
        start?: string;
        end?: string;
        timeZone?: string;
      };
    };
    URL?: { value: string };
    Image?: {
      value: Array<{
        url?: string;
        name?: string;
        type?: string;
      }>;
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
  const musicItems = data.music.edges.filter(({ node }) =>
    node.properties.Type?.value?.name === "Music"
  );

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
            <a href={node.properties.URL?.value} target="_blank" rel="noopener noreferrer">
              {node.properties.Image?.value?.[0]?.url && (
                <img
                  css={CoverStyle}
                  src={node.properties.Image.value[0].url}
                  alt={node.title}
                  style={{ width: "100%", height: "auto" }}
                />
              )}
              <CoverTitle>{node.title}</CoverTitle>
            </a>
            <p>{node.properties.Release_Date?.value?.start}</p>
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
            Release_Date: Release_Date {
              value {
                start
                end
                timeZone
              }
            }
            URL {
              value
            }
            Image {
              value {
                url
                name
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
