module.exports = [
  {
    plugin: require("/Users/sam.chang/Desktop/samchang/node_modules/gatsby-plugin-catch-links/gatsby-browser.js"),
    options: { plugins: [] }
  },
  {
    plugin: require("/Users/sam.chang/Desktop/samchang/node_modules/gatsby-remark-images/gatsby-browser.js"),
    options: { plugins: [], maxWidth: 480 }
  },
  {
    plugin: require("/Users/sam.chang/Desktop/samchang/node_modules/gatsby-remark-images/gatsby-browser.js"),
    options: {
      plugins: [],
      maxWidth: 950,
      showCaptions: true,
      linkImagesToOriginal: false,
      wrapperStyle:
        "\n                margin-top: 32px;\n                margin-bottom: 32px;\n                ",
      quality: 100
    }
  },
  {
    plugin: require("/Users/sam.chang/Desktop/samchang/node_modules/gatsby-remark-images-medium-zoom/gatsby-browser.js"),
    options: { plugins: [], background: "#fff" }
  },
  {
    plugin: require("/Users/sam.chang/Desktop/samchang/node_modules/gatsby-plugin-google-analytics/gatsby-browser.js"),
    options: { plugins: [], trackingId: "UA-78963509-1", head: true }
  }
];
