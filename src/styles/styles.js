import styled from "@emotion/styled";
import defaultTheme from "../components/Theme";

export const breakpoints = [425, 1260];

export const mq = breakpoints.map(bp => `@media (max-width: ${bp}px)`);

export const SectionWrapper = styled.div`
  max-width: ${defaultTheme.width[2]};
  margin: ${defaultTheme.space[11]} auto 0;

  ${mq[1]} {
    max-width: ${defaultTheme.width[2]};
  }

  ${mq[0]} {
    position: relative;
    padding-top: ${defaultTheme.space[11]};
    margin: 0 auto;
  }
`;

export const MediumSectionWrapper = styled.div`
  padding-left: ${defaultTheme.space[5]};
  margin-top: ${defaultTheme.space[11]};
  max-width: 750px;
  padding-bottom: ${defaultTheme.space[3]};

  ${mq[1]} {
    padding: 0 ${defaultTheme.space[3]} ${defaultTheme.space[3]};
  }

  ${mq[0]} {
    position: relative;
    padding-top: ${defaultTheme.space[11]};
    margin-top: 0;
  }

  li {
    margin: 0 0 0 ${defaultTheme.space[2]};
  }

  details li {
    margin-right: 0;
  }

  summary {
    cursor: pointer;
  }

  details summary::-webkit-details-marker {
    display: none;
  }

  details li:first-of-type {
    margin-top: ${defaultTheme.space[1]};
  }
`;

export const Grid = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
  column-gap: 40px;
  row-gap: 40px;
  margin: 0 auto;
  padding: ${defaultTheme.space[4]} ${defaultTheme.space[5]}
    ${defaultTheme.space[5]} ${defaultTheme.space[5]};
  img {
    border: none;
  }

  ${mq[1]} {
    padding: 0 ${defaultTheme.space[3]};
    row-gap: 24px;
  }
`;

export const CoverTitle = styled("div")`
  margin-top: ${defaultTheme.space[2]};
`;
