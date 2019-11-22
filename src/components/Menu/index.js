/** @jsx jsx */

import Link from "gatsby-link";
import { Component } from "react";
import { css, jsx } from "@emotion/core";

const dropdown__Style = css`
  width: 200px;
  text-align: left;
  position: absolute;
  z-index: 10;
  right: 40px;
  top: 72px;
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
    padding: 8px 8px 8px 16px;
    display: block;
  }

  li {
    list-style: none;
    padding: 0;
  }

  li a:active {
    opacity: 0.3;
  }

  @media (max-width: 950px) {
    right: 24px;
    top: 60px;
  }

  @media (hover: hover) {
    ul li a:hover {
      background: var(--link-color);
      color: white;
    }

    li a:active {
      opacity: 1;
    }
  }
`;

const noDropdown__Style = css`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
`;

const menu = css`
  display: inline-block;
  width: 30%;
  text-align: right;
  a,
  a:active,
  a:focus,
  a:hover,
  a:link,
  a:visited {
    width: 100%;
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
        <div css={dropdown__Style}>
          <ul>
            <li>
              <Link to="/info">Info</Link>
            </li>

            <li>
              <Link to="/music">Music</Link>
            </li>

            <li>
              <Link to="/reading">Reading</Link>
            </li>
          </ul>
        </div>
      );
      noDropdown = <div onClick={this.closeMenu} css={noDropdown__Style} />;
    }
    return (
      <div css={menu}>
        <button
          role="button"
          onClick={this.openMenu}
          onKeyPress={this.currentKey}
          css={this.state.isOpen ? { opacity: ".2" } : { opacity: "1" }}
        >
          ☰ Menu
        </button>
        {dropdown}
        {noDropdown}
      </div>
    );
  }
}

export default Menu;
