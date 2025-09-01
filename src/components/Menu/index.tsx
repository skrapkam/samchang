/** @jsx jsx */

import { Link } from "gatsby";
import { Component } from "react";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { mq } from "../../styles/styles";
import defaultTheme from "../Theme"

const DropdownStyle = styled.div`
  width: 220px;
  text-align: left;
  position: absolute;
  z-index: 10;
  right: 40px;
  top: calc(100% - 24px);
  background: white;
  border-radius: 5px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  a,
  a:active,
  a:focus,
  a:link,
  a:visited {
    position: static;
    padding: ${defaultTheme.space[1]} ${defaultTheme.space[1]} ${defaultTheme.space[1]} ${defaultTheme.space[2]};
    display: block;
  }

  li {
    list-style: none;
    padding: 0;
  }

  li a:active {
    opacity: 0.3;
  }

  ${mq[2]} {
    right: 24px;
  } 

  ${mq[0]} {
    top: calc(100% - 18px);
  } 

  @media (hover: hover) {
    ul li a:hover {
      background: ${defaultTheme.color.hover});
      color: ${defaultTheme.color.link};
    }

    li a:active {
      opacity: 1;
    }
  }
`;

const NoDropdownStyle = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
`;

const MenuStyled = styled.div`
  display: inline-block;
  width: 30%;
  text-align: right;
  vertical-align: top;
  white-space: nowrap;
  a,
  a:active,
  a:focus,
  a:hover,
  a:link,
  a:visited {
    width: 100%;
    -webkit-transition: auto;
    transition: auto;
    cursor: pointer;
    position: static;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    user-select: none;
    display: inline-block;
    text-decoration: none;
    border-bottom: none;
    back
  }

  ul li {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }


  ul {
    padding: 0;
  }

  ul li:last-child {
    border-bottom: none;
  }
`;

const MenuButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  color: ${defaultTheme.color.link};

  &:focus {
    outline: none;
  } 

  &:focus-visible {
    outline: 2px solid #275FC5;
  }

`;

class Menu extends Component {
  // init state
  constructor() {
    super();
    this.state = { isOpen: false };
    this.state = { currentKey: "" };
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  // open state
  openMenu = e => {
    this.setState({ isOpen: true });
  };

  // close state
  closeMenu = e => {
    this.setState({ isOpen: false });
  };

  // press esc key to close menu
  handleKeyPress(e) {
    this.setState({ currentKey: e.keyCode });
    if (e.keyCode === 27) {
      this.setState({ isOpen: false });
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  render() {
    let dropdown;
    let noDropdown;

    if (this.state.isOpen) {
      dropdown = (
        <DropdownStyle>
          <ul>
            <li>
              <Link to="/info">Info</Link>
            </li>

            <li>
              <Link to="/music">Music</Link>
            </li>
          </ul>
        </DropdownStyle>
      );
      noDropdown = <NoDropdownStyle onClick={this.closeMenu} />;
    }
    return (
      <MenuStyled>
        <MenuButton
          onClick={this.openMenu}
          onKeyPress={this.currentKey}
          css={this.state.isOpen ? { opacity: ".2" } : { opacity: "1" }}
        >
          ☰ Menu
        </MenuButton>
        {dropdown}
        {noDropdown}
      </MenuStyled>
    );
  }
}

export default Menu;
