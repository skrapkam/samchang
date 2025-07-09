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
    Name?: { value: string };
    Description?: { value: string };
    Status?: { value: string };
    Category?: { value: string };
    Link?: { value: string };
    Cover?: { value: string };
    name?: { value: string };
    description?: { value: string };
    status?: { value: string };
    category?: { value: string };
    link?: { value: string };
    cover?: { value: string };
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
            <p>Name: {node.properties.Name?.value || node.properties.name?.value || 'No name'}</p>
            <p>Description: {node.properties.Description?.value || node.properties.description?.value || 'No description'}</p>
            <p>Status: {node.properties.Status?.value || node.properties.status?.value || 'No status'}</p>
            <p>Category: {node.properties.Category?.value || node.properties.category?.value || 'No category'}</p>
            <p>Link: {node.properties.Link?.value || node.properties.link?.value || 'No link'}</p>
            <p>Cover: {node.properties.Cover?.value || node.properties.cover?.value || 'No cover'}</p>
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
            # Try different property names that might exist
            Name {
              value
            }
            Description {
              value
            }
            Status {
              value
            }
            Category {
              value
            }
            Link {
              value
            }
            Cover {
              value
            }
            # Try some other common names
            name {
              value
            }
            description {
              value
            }
            status {
              value
            }
            category {
              value
            }
            link {
              value
            }
            cover {
              value
            }
          }
          updatedAt
        }
      }
    }
  }
`;
