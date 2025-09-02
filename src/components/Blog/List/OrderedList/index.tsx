/** @jsx jsx */

import { Component } from "react";
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import defaultTheme from "../../../Theme"
import { mq } from "../../../../styles/styles"

const ListStyle = styled.ol`
  max-width: ${defaultTheme.width[0]} !important;
  margin: 0 auto ${defaultTheme.space[2]} !important;
  list-style-position: inside; /* prevent clipping by overflow wrappers */
  padding-left: 0 !important; /* marker is inside; no extra indent needed */

  /* Mobile responsive adjustments */
  ${mq[0]} {
    max-width: 100% !important;
    padding-left: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  ${mq[1]} {
    max-width: 100% !important;
    padding-left: 0 !important;
  }
  
  /* Ensure list items have proper spacing */
  li {
    padding: 4px 0 4px 1.6rem !important; /* restore visual indent */
    margin: 0 !important;
  }

  /* Nested lists maintain indent */
  ul, ol {
    padding-left: 1.6rem !important;
  }

  ${mq[0]} {
    li { padding-left: 1.2rem !important; }
    ul, ol { padding-left: 1.2rem !important; }
  }
`;

class OrderedList extends Component {
  render() {
    return <ListStyle>{this.props.children}</ListStyle>;
  }
}

export default OrderedList;
