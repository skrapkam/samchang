/** @jsx jsx */

import styled from "@emotion/styled";
import { graphql } from "gatsby";
import { css, jsx } from "@emotion/core";
import Nav from "../../components/Nav";
import Menu from "../../components/Menu";
import Page from "../../components/Page";
import { MediumSectionWrapper, Grid, CoverTitle } from "../../styles/styles";
import Header from "../../components/Header";
import { Helmet } from "react-helmet";
import Img from "gatsby-image";


const changelog = ({}) => {
  return (
    <Page>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Changelog | Sam Chang</title>
        <meta http-equiv="x-ua-compatible" content="ie=edge; chrome=1" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>
      <Header>
        <Nav title="Changelog" />
        <Menu />
      </Header>
      <MediumSectionWrapper>
        <ul>
        <li>
            <strong>March 14, 2020</strong>
            <p>Added Creative Selection to library.</p>
          </li>
        <li>
            <strong>March 02, 2020</strong>
            <p>Updated job description. Added new book.</p>
          </li>
          <li>
            <strong>January 21, 2020</strong>
            <p>Added Nothing Was Gained Under the Sun. Added a changelog. Updated library to only include 2020 books.</p>
          </li>
        </ul>
      </MediumSectionWrapper>
    </Page>
  );
};

export default changelog;
