import styled from "@emotion/styled";
import "./variables.css";
import "./base.css";

export const breakpoints = [425, 1260];

export const mq = breakpoints.map(bp => `@media (max-width: ${bp}px)`);

export const SectionWrapper = styled.div`
  max-width: 100%;
  margin: 120px auto 0;

  ${mq[1]} {
    max-width: 100%;
  }

  ${mq[0]} {
    position: relative;
    padding-top: 112px;
    margin: 0px auto;
  }
`;

export const MediumSectionWrapper = styled.div`
  padding-left: 40px;
  margin-top: 120px;
  max-width: 750px;
  padding-bottom: 24px;

  ${mq[1]} {
    padding: 0 var(--baseline) 24px;
  }

  ${mq[0]} {
    position: relative;
    padding-top: 112px;
    margin-top: 0px;
  }

  li {
    margin: 0 0 0 16px;
  }

  details li {
    margin-right: 0px;
  }

  summary {
    cursor: pointer;
  }

  details summary::-webkit-details-marker {
    display: none;
  }

  details li:first-of-type {
    margin-top: 8px;
  }
`;

export const Grid = styled("div")`
  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
  column-gap: 40px;
  row-gap: 40px;
  margin: 0 auto;
  padding: 32px 40px 40px 40px;
  img {
    border: none;
  }

  ${mq[1]} {
    padding: 0 var(--baseline);
    row-gap: 24px;
  }
`;

export const CoverTitle = styled("div")`
  margin-top: 16px;
`;
