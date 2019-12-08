require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  siteMetadata: {
    title: "Sam Chang, Designer"
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-emotion`,
    `gatsby-plugin-catch-links`,
    "gatsby-plugin-netlify-cache",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `index`,
        path: `${__dirname}/src/projects/`
      }
    },

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `index`,
        path: `${__dirname}/src/images/`
      }
    },

    {
      resolve: `gatsby-remark-images`,
      options: {
        maxWidth: 480
      }
    },

    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-copy-linked-files`]
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 950,
              showCaptions: true,
              linkImagesToOriginal: false,
              wrapperStyle: `
                margin-top: 32px;
                margin-bottom: 32px;
                `,
              quality: 100
            }
          }
        ]
      }
    },

    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`inconsolata`, `monospace`]
      }
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/favicon.png",
        injectHTML: true,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          twitter: false,
          yandex: false,
          windows: false
        }
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-78963509-1",
        head: true
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Sam Chang, Product Designer`,
        short_name: `samchang.design`,
        start_url: `/`,
        background_color: `#fefefe`,
        theme_color: `#fefefe`
      }
    }
  ]
};
