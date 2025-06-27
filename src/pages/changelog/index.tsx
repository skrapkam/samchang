/** @jsx jsx */

import { jsx, css } from "@emotion/react";
import styled from "@emotion/styled";
import Nav from "../../components/Nav";
import Menu from "../../components/Menu";
import Page from "../../components/Page";
import { SectionWrapper } from "../../styles/styles";
import Header from "../../components/Header";
import { Helmet } from "react-helmet";
import defaultTheme from "../../components/Theme";
import Fixed from "../../components/Changelog/Fixed";
import Updated from "../../components/Changelog/Updated";
import New from "../../components/Changelog/New";

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

  ul:not(:last-child) {
    margin-bottom: ${defaultTheme.space[2]};
  }

  li {
    border-bottom: none;
  }

  & li:not(:first-child) {
    padding-top: 0;
  }
  

  @media (max-width: 1065px) {
    display: block;

    h4 {
      margin-bottom: ${defaultTheme.space[1]};
    }
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
        <meta name="mobile-web-app-capable" content="yes" />
      </Helmet>
      <Header>
        <Nav title="Changelog" />
        <Menu />
      </Header>
      <SectionWrapper>
        <ChangeLog>
          <ul>
            <li>
            <li>
                <ChangeLogContent>
                  <time css={date}><h4>December 25, 2024</h4></time>
                  <div css={content}>
                    <ul>
                      <New />
                      <li><p>Added WHY SHOULD MY HEART BE SAD?.</p></li>
                      <li><p>Added new Ladder project for 2024.</p></li>
                    </ul>
                    <ul>
                      <Updated />
                      <li><p>Removed Library page.</p></li>
                      <li><p>Updated info page.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
            <li>
                <ChangeLogContent>
                  <time css={date}><h4>December 28, 2023</h4></time>
                  <div css={content}>
                    <ul>
                      <New />
                      <li><p>Added A Heart Like Mine Is Hard To Find.</p></li>
                      <li><p>Added new Ladder project for 2023.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
            <li>
                <ChangeLogContent>
                  <time css={date}><h4>December 29, 2022</h4></time>
                  <div css={content}>
                    <ul>
                      <New />
                      <li><p>Added MY LOVE WAS A FOOL.</p></li>
                      <li><p>Added new Ladder projects for 2022.</p></li>
                    </ul>
                    <ul>
                      <Updated />
                      <li><p>Updated dependencies.</p></li>
                      <li><p><a href="https://github.com/skrapkam/samchang/commit/8e0859d5a8ca03482b37e291823393c296b80459#diff-a6f3904c41211be170d9b0eb87e49ea8d02d0fd5a7224d6772174b425dacf90fR23">Updated GraphQL ordering schema</a>.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
            <li>
                <ChangeLogContent>
                  <time css={date}><h4>February 15, 2022</h4></time>
                  <div css={content}>
                    <ul>
                      <New />
                      <li><p>Added His Agony / Her Apathy.</p></li>
                    </ul>
                    <ul>
                      <Updated />
                      <li><p>Updated library.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
            <li>
                <ChangeLogContent>
                  <time css={date}><h4>December 28, 2021</h4></time>
                  <div css={content}>
                    <ul>
                      <New />
                      <li><p>Added new Ladder projects.</p></li>
                    </ul>
                    <ul>
                      <Updated />
                      <li><p>Removed glitches.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
            <li>
                <ChangeLogContent>
                  <time css={date}><h4>October 07, 2021</h4></time>
                  <div css={content}>
                    <ul>
                      <New />
                      <li><p>Added new books.</p></li>
                    </ul>
                    <ul>
                      <New />
                      <li><p>Added Rave Type Song.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
            <li>
                <ChangeLogContent>
                  <time css={date}><h4>March 03, 2021</h4></time>
                  <div css={content}>
                    <ul>
                      <New />
                      <li><p>Added new books for 2021.</p></li>
                    </ul>
                    <ul>
                      <New />
                      <li><p>Added An Amalgam of Waves.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
            <li>
                <ChangeLogContent>
                  <time css={date}><h4>December 22, 2020</h4></time>
                  <div css={content}>
                    <ul>
                      <Updated />
                      <li><p>Updated Ladder content.</p></li>
                    </ul>
                    <ul>
                      <New />
                      <li><p>Added Masculine Mandate and A Punchable Face to library.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
              <li>
                <ChangeLogContent>
                  <time css={date}><h4>December 17, 2020</h4></time>
                  <div css={content}>
                    <ul>
                      <Updated />
                      <li><p>Updated styling.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
              <li>
                <ChangeLogContent>
                  <time css={date}><h4>December 13, 2020</h4></time>
                  <div css={content}>
                    <ul>
                      <New />
                      <li><p>Added Glitch to info page.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
              <li>
                <ChangeLogContent>
                  <time css={date}><h4>November 27, 2020</h4></time>
                  <div css={content}>
                    <ul>
                      <New />
                      <li><p>Added Ladder page.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
              <li>
                <ChangeLogContent>
                  <time css={date}><h4>November 17, 2020</h4></time>
                  <div css={content}>
                    <ul>
                      <New />
                      <li><p>Added Inspired to the library.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
              <li>
                <ChangeLogContent>
                  <time css={date}><h4>November 07, 2020</h4></time>
                  <div css={content}>
                    <ul>
                      <New />
                      <li><p>Added A Quest for Godliness to the library.</p></li>
                    </ul>
                    <ul>
                      <Updated />
                      <li><p>Removed dumb websites section.</p></li>
                    </ul>
                  </div>
                </ChangeLogContent>
              </li>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>September 15, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added The Last Punisher to the library.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>September 08, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added Dither to music.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>July 20, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added The God Who Justifies to the library.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>

            <li>
              <ChangeLogContent>
                <time css={date}><h4>July 13, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added hover state for links.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>July 12, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added Elon Musk to the library.</p></li>
                    <li><p>Added Inverted Love Song to music.</p></li>
                    <li><p>Added music project to info.</p></li>
                  </ul>
                  <ul>
                    <Fixed />
                    <li><p>Removed Chloe Burbank.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>June 14, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added Why Are We Yelling? to the library.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>May 15, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <Updated />
                    <li><p>Added categorical pills for changelog.</p></li>
                  </ul>
                  <ul>
                    <New />
                    <li><p>Added User Friendly to library.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>May 08, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <Updated />
                    <li><p>Updated changelog styling.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>May 03, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <Fixed />
                    <li><p>Removed Yodel Kid.</p></li>
                    <li><p>Edited URL for Grover Alleyway.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>April 26, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added art section.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>April 25, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added OG image.</p></li>
                  </ul>
                  <ul>
                    <Fixed />
                    <li><p>Updated ZEIT to Vercel.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>April 11, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added The Making of a Manager to library.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>April 07, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <Fixed />
                    <li><p>Fixed dark mode.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>March 29, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added book notes.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>March 21, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added dark mode.</p></li>
                    <li><p>Added Whole Christ to library.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>March 14, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added Creative Selection to library.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>March 02, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <Updated />
                    <li><p>Updated job description.</p></li>
                  </ul>
                  <ul>
                    <New />
                    <li><p>Added new book.</p></li>
                  </ul>
                </div>
              </ChangeLogContent>
            </li>
            <li>
              <ChangeLogContent>
                <time css={date}><h4>January 21, 2020</h4></time>
                <div css={content}>
                  <ul>
                    <New />
                    <li><p>Added Nothing Was Gained Under the Sun.</p></li>
                    <li><p>Added a changelog.</p></li>
                  </ul>
                  <ul>
                    <Updated />
                    <li><p>Updated library to only include 2020 books.</p></li>
                  </ul>
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
