require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: "Sam Chang, Designer",
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-emotion`,
    `gatsby-plugin-catch-links`,
    `gatsby-transformer-json`,
  
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/data/music/music.json`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `index`,
        path: `${__dirname}/src/projects/`,
      },
    },

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `index`,
        path: `${__dirname}/src/images/`,
      },
    },

    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-copy-linked-files`,
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              maintainCase: false,
              removeAccents: true,
              elements: [`h1`, `h2`, `h3`, `h4`, `h5`, `h6`],
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              quality: 100,
              maxWidth: 1500,
              withWebp: true,
              showCaptions: true,
              linkImagesToOriginal: false,
              wrapperStyle: `
                margin-top: 32px;
                margin-bottom: 32px;
                `,
            },
          },
          `gatsby-remark-images-medium-zoom`,
        ],
      },
    },

    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`inconsolata`, `monospace`],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-78963509-1",
        head: true,
      },
    },
    {
      resolve: `gatsby-plugin-vercel`,
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Sam Chang, Product Designer`,
        short_name: `samchang.design`,
        start_url: `/`,
        background_color: `#fefefe`,
        theme_color: `#fefefe`,
        icon: `src/favicon.png`,
      },
    },
  ],
};
