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
    title?: { value: string };
    created_time?: { value: string };
    last_edited_time?: { value: string };
    rich_text?: { value: string };
    number?: { value: number };
    select?: { value: string };
    multi_select?: { value: string[] };
    date?: { value: string };
    checkbox?: { value: boolean };
    url?: { value: string };
    email?: { value: string };
    phone_number?: { value: string };
    files?: { value: string };
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
            <p>Title: {node.properties.title?.value || 'No title'}</p>
            <p>Created: {node.properties.created_time?.value || 'No created time'}</p>
            <p>Last Edited: {node.properties.last_edited_time?.value || 'No last edited time'}</p>
            <p>Rich Text: {node.properties.rich_text?.value || 'No rich text'}</p>
            <p>Number: {node.properties.number?.value || 'No number'}</p>
            <p>Select: {node.properties.select?.value || 'No select'}</p>
            <p>Multi Select: {node.properties.multi_select?.value || 'No multi select'}</p>
            <p>Date: {node.properties.date?.value || 'No date'}</p>
            <p>Checkbox: {node.properties.checkbox?.value || 'No checkbox'}</p>
            <p>URL: {node.properties.url?.value || 'No URL'}</p>
            <p>Email: {node.properties.email?.value || 'No email'}</p>
            <p>Phone: {node.properties.phone_number?.value || 'No phone'}</p>
            <p>Files: {node.properties.files?.value || 'No files'}</p>
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
            # Try some common Notion property types
            title {
              value
            }
            created_time {
              value
            }
            last_edited_time {
              value
            }
            # Try some other common property types
            rich_text {
              value
            }
            number {
              value
            }
            select {
              value
            }
            multi_select {
              value
            }
            date {
              value
            }
            checkbox {
              value
            }
            url {
              value
            }
            email {
              value
            }
            phone_number {
              value
            }
            files {
              value
            }
          }
          updatedAt
        }
      }
    }
  }
`;
