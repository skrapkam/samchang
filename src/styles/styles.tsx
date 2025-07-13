import styled from "@emotion/styled";
import defaultTheme from "../components/Theme";

export const breakpoints = [425, 768, 1260];

export const mq = breakpoints.map(bp => `@media (max-width: ${bp}px)`);

export const SectionWrapper = styled.div`
  max-width: ${defaultTheme.width[2]};
  margin: auto 0;
  padding-top: ${defaultTheme.space[11]} ;
  ${mq[2]} {
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
  padding-top: ${defaultTheme.space[11]};
  max-width: ${defaultTheme.width[0]};
  padding-bottom: ${defaultTheme.space[3]};

  ${mq[2]} {
    padding: ${defaultTheme.space[3]} ${defaultTheme.space[3]};
    padding-top:  ${defaultTheme.space[11]};
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  row-gap: 6rem;
  column-gap: 4rem;
  padding: ${defaultTheme.space[0]} ${defaultTheme.space[5]} ${defaultTheme.space[5]} ${defaultTheme.space[5]};
  max-width: 100%;
  box-sizing: border-box;
  justify-items: center;
  img {
    border: none;
  }

  ${mq[2]} {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    column-gap: 3rem;
    padding: ${defaultTheme.space[0]} ${defaultTheme.space[3]} ${defaultTheme.space[5]} ${defaultTheme.space[3]};
  }

  ${mq[1]} {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    column-gap: 2.5rem;
    padding: ${defaultTheme.space[0]} ${defaultTheme.space[3]} ${defaultTheme.space[5]} ${defaultTheme.space[3]};
  }

  ${mq[0]} {
    grid-template-columns: 1fr;
    column-gap: 0;
    padding: ${defaultTheme.space[0]} ${defaultTheme.space[3]} ${defaultTheme.space[5]} ${defaultTheme.space[3]};
  }
`;

export const CoverTitle = styled("div")`
  margin-top: ${defaultTheme.space[2]};
  font-size: ${defaultTheme.fontSizes[1]};
  font-weight: 400;
  color: ${defaultTheme.color.text};
  text-align: center;
  margin-bottom: 0.5rem;
  
  a {
    color: ${defaultTheme.color.link};
    text-decoration: none;
    border-bottom: 1px solid ${defaultTheme.color.link};
    padding: 0 0 2px;
    -webkit-transition: 0.1s ease-in background;
    transition: 0.1s ease-in background;
  }
 
`;

export const ReleaseDate = styled("p")`
  font-size: ${defaultTheme.fontSizes[1]};
  color: ${defaultTheme.color.gray};
  text-align: center;
  margin: 0;
  margin-top: 0.5rem;
  font-weight: 500;
 
`;
