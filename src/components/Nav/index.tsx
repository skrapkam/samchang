/** @jsx jsx */ 
import { Link } from "gatsby";
import styled from "@emotion/styled";
import { Component } from "react";
import { jsx } from "@emotion/react";

const NavStyled = styled.div`
  font-weight: 400;
  width: 70%;
  display: inline-block;
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
            <>
              {" / "}
              <Link to={parentSlug}>{parentTitle}</Link>
            </>
          )}
          {title && (
            <>
              {" / "}
              {title}
            </>
          )}
        </p>{" "}
        <p />
      </NavStyled>
    );
  }
}

export default Nav;
