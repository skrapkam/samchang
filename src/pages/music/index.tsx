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
    Date: { value: string };
    URL: { value: string };
    Image: { value: string };
    Type: { value: string };
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
        {data.music.edges.map(({ node }) => (
          <div key={node.id}>
            <a href={node.properties.URL.value} target="_blank" rel="noopener noreferrer">
              {/* If you want to use Gatsby image, you need to process the image URLs with gatsby-plugin-image or gatsby-image. For now, use a simple img tag. */}
              <img
                css={CoverStyle}
                src={node.properties.Image.value}
                alt={node.title}
                style={{ width: "100%", height: "auto" }}
              />
              <CoverTitle>{node.title}</CoverTitle>
            </a>
            <p>{node.properties.Date.value}</p>
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
      filter: { properties: { Type: { value: { eq: "Music" } } } }
      sort: { updatedAt: DESC }
    ) {
      edges {
        node {
          id
          title
          properties {
            Date {
              value
            }
            URL {
              value
            }
            Image {
              value
            }
            Type {
              value
            }
          }
          updatedAt
        }
      }
    }
  }
`;
