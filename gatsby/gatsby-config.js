module.exports = {
  siteMetadata: {
    siteUrl: `https://maxmastalerz.com`,
    title: `maxmastalerz.com`,
    description: `Looking to hire a software developer or interested in software development? Checkout my portfolio, blog, and more.`,
    author: `@envy_theme`,
  },
  // plugins
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-source-strapi`,
      options: {
        apiURL: `http://${process.env.STRAPI_SERVICE_HOSTNAME}:${process.env.STRAPI_PORT}`,
        queryLimit: 1000, // Default to 100
        contentTypes: [`blogs`, `projects`, `services`,`testimonials`],
        singleTypes: [`banner`, `award`, `experience`, `about-me`, `logo`, 'skill']
        // singleTypes: [`award`, `experience`, `about-me`,]
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
    }
  ],
}
