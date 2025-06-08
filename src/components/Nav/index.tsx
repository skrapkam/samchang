/** @jsx jsx */ 
import { Link } from "gatsby";
import styled from "@emotion/styled";
import { Component } from "react";
import { jsx } from "@emotion/react";
import { mq } from "../../styles/styles";

const NavStyled = styled.div`
  font-weight: 400;
  width: 70%;
  display: inline-block;
  vertical-align: top;

  p {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ${mq[0]} {
    width: 70%;
  }
`;

interface NavProps {
  title?: string;
  parentTitle?: string;
  parentSlug?: string;
}

class Nav extends Component<NavProps> {
  render() {
    const { title, parentTitle, parentSlug } = this.props as NavProps;

    return (
      <NavStyled>
        <p>
          <Link to="/">Sam Chang</Link>
          {parentTitle && parentSlug && (
            <span>
              {" / "}
              <Link to={parentSlug}>{parentTitle}</Link>
            </span>
          )}
          {title && (
            <span>
              {" / "}
              {title}
            </span>
          )}
        </p>{" "}
        <p />
      </NavStyled>
    );
  }
}

export default Nav;
