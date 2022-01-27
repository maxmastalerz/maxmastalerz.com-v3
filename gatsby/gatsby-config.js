let strapiUrl = process.env.GATSBY_PROTOCOL;
if(process.env.DEPLOY_URL) { //If netlify deploy
  strapiUrl += `api.${process.env.GATSBY_BASE_URL}`;
} else {
  strapiUrl += `${process.env.STRAPI_SERVICE_HOSTNAME}:${process.env.STRAPI_INTERNAL_PORT}`;
}

module.exports = {
  siteMetadata: {
    siteUrl: `${process.env.GATSBY_PROTOCOL}${process.env.GATSBY_BASE_URL}`,
    title: `Max Mastalerz - Developer for hire in Burlington`,
    description: `Looking to hire a software developer or interested in software development? Checkout my portfolio, blog, and more.`,
    author: `Max Mastalerz`,
  },
  // plugins
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `maxmastalerz.com`,
        short_name: `maxmastalerz.com`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/assets/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-source-strapi`,
      options: {
        apiURL: strapiUrl,
        queryLimit: 1000, // Default to 100
        collectionTypes: [`blogs`, `projects`, `services`,`testimonials`],
        singleTypes: [`banner`, `award`, `experience`, `about-me`, `logo`, 'skill']
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          "UA-82332830-1", // Google Analytics / GA
        ],
        gtagConfig: {
          cookie_expires: 0,
        },
        pluginConfig: {
          head: false,
        },
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        sassOptions: {
          includePaths: ["src/assets/styles/component-scope"],
          sourceMap: "true",
          precision: 6
        }
      }
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true,
        develop: true,
        purgeOnly: ['src/assets/styles/global-scope/_bootstrap-overrides.scss']
      }
    },
    `gatsby-plugin-split-css`,
    `gatsby-plugin-preact`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `${process.env.GATSBY_PROTOCOL}${process.env.GATSBY_BASE_URL}`,
      },
    },
  ]
}
