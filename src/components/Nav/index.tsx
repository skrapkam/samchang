/** @jsx jsx */ import Link from "gatsby-link";
import styled from "@emotion/styled";
import { Component } from "react";
import { jsx } from "@emotion/core";

const NavStyled = styled.div`
  font-weight: 400;
  width: 70%;
  display: inline-block;
`;

class Nav extends Component {
  render() {
    return (
      <NavStyled>
        <p>
          <Link to="/">Sam Chang</Link>
          {this.props.title ? " / " + this.props.title : null}
        </p>{" "}
        <p />
      </NavStyled>
    );
  }
}

export default Nav;
