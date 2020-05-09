/** @jsx jsx */

import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import Nav from "../../components/Nav";
import Menu from "../../components/Menu";
import Page from "../../components/Page";
import { SectionWrapper } from "../../styles/styles";
import Header from "../../components/Header";
import { Helmet } from "react-helmet";
import defaultTheme from "../../components/Theme";


const ChangeLog = styled.div`
max-width: ${defaultTheme.width[0]};

ul {
  padding-top: 0;
}

margin: auto;

li {
  border-bottom: 1px solid ${defaultTheme.color.lightGray};
}

& li:not(:first-child) {
  padding-top: ${defaultTheme.space[4]};
}
& li:last-child {
  border-bottom: none;
}
  li {
    list-style: none;
    margin-left: 0;
  }

  @media (max-width: 1065px) {
    padding: ${defaultTheme.space[0]} ${defaultTheme.space[3]} ${defaultTheme.space[3]};
  }

`

const ChangeLogContent = styled.article`
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding-bottom: ${defaultTheme.space[4]};

  @media (max-width: 1065px) {
    display: block;
  }

`

const date = css`
  color: ${defaultTheme.color.gray};
`;

const content = css` 
`

const changelog = ({ }) => {
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
      <SectionWrapper>
        <ChangeLog>
          <ul>
          <li>
              <ChangeLogContent>
                <time css={date}><h4>May 08, 2020</h4></time>
                <div css={content}>
                  <p>Updated changelog styling.</p>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>May 03, 2020</h4></time>
                <div css={content}>
                  <p>Removed Yodel Kid.</p>
                  <p>Edited URL for Grover Alleyway.</p>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>April 26, 2020</h4></time>
                <div css={content}>
                  <p>Added art section.</p>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>April 25, 2020</h4></time>
                <div css={content}>
                  <p>Added OG image.</p>
                  <p>Updated ZEIT to Vercel.</p>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>April 11, 2020</h4></time>
                <div css={content}>
                  <p>Added The Making of a Manager to library.</p>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>April 07, 2020</h4></time>
                <div css={content}>
                  <p>Fixed dark mode.</p>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>March 29, 2020</h4></time>
                <div css={content}>
                  <p>Added book notes.</p>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>March 21, 2020</h4></time>
                <div css={content}>
                  <p>Added dark mode.</p>
                  <p>Added Whole Christ to library.</p>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>March 14, 2020</h4></time>
                <div css={content}>
                  <p>Added Creative Selection to library.</p>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>March 02, 2020</h4></time>
                <div css={content}>
                  <p>Updated job description.</p>
                  <p>Added new book.</p>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>January 21, 2020</h4></time>
                <div css={content}>
                  <p>Added Nothing Was Gained Under the Sun.</p>
                  <p>Added a changelog.</p>
                  <p>Updated library to only include 2020 books.</p>
                </div>
              </ChangeLogContent>
            </li>
          </ul>
        </ChangeLog>
      </SectionWrapper>
    </Page>
  );
};

export default changelog;
