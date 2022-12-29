/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/react";
import Page from "../components/Page";
import Nav from "../components/Nav";
import Menu from "../components/Menu";
import { MediumSectionWrapper } from "../styles/styles";
import { Helmet } from "react-helmet";
import Header from "../components/Header";
import { Link } from "gatsby";

class info extends Component {
  render() {
    return (
      <Page>
        <Helmet>
          <meta charSet="utf-8" />
          <title>404 Page Not Found | Sam Chang</title>
          <meta http-equiv="x-ua-compatible" content="ie=edge; chrome=1" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
        </Helmet>
        <Header>
          <Nav title="404" />
          <Menu />
        </Header>
        <MediumSectionWrapper>
          <p>
            The page you tried to access cannot be found. Maybe try going{" "}
            <Link to="/">home</Link> or listening to some of my{" "}
            <Link to="/music">music</Link>. Thanks!
          </p>
        </MediumSectionWrapper>
      </Page>
    );
  }
}

export default info;
