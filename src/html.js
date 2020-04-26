import React from "react";

export default class HTML extends React.Component {
  render() {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
          />
          <meta
            name="keywords"
            content="Design, User Experience, Product Design, UX, Interaction Design, Frontend Development, Portfolio, Graphic Design"
          />
          <meta
            name="description"
            property="og:description"
            content="Sam Chang's Design and Development Portfolio"
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://samchang.design/social.jpg"
          />
          <meta property="og:url" content="https://samchang.design/" />

          <meta name="author" content="Sam Chang" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@samchangsucks" />
          <meta name="twitter:title" content="Sam Chang" />
          <meta
            name="twitter:description"
            content="Sam Chang's Design and Development Portfolio"
          />

          {this.props.headComponents}
        </head>
        <body>
          <div
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    );
  }
}
