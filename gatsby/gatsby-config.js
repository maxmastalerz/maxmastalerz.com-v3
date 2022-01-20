module.exports = {
  siteMetadata: {
    siteUrl: `${process.env.GATSBY_PROTOCOL}${process.env.GATSBY_BASE_URL}`,
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
        path: `${__dirname}/src/assets/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
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
        //DEPLOY_URL is only set when deploying on Netlify (https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata)
        apiURL: `${process.env.GATSBY_PROTOCOL}${process.env.STRAPI_SERVICE_HOSTNAME}`+
        (process.env.DEPLOY_URL ? `${process.env.STRAPI_SERVICE_PATHNAME}` : `:${process.env.STRAPI_INTERNAL_PORT}`),
        queryLimit: 1000, // Default to 100
        collectionTypes: [`blogs`, `projects`, `services`,`testimonials`],
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
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {
          "/api/*": [
            "Host: maxmastalerz.com",
          ]
        }, // option to add more headers. `Link` headers are transformed by the below criteria
        allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
        mergeSecurityHeaders: true, // boolean to turn off the default security headers
        mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers
        mergeCachingHeaders: true, // boolean to turn off the default caching headers
        transformHeaders: (headers, path) => headers, // optional transform for manipulating headers under each path (e.g.sorting), etc.
        generateMatchPathRewrites: true, // boolean to turn off automatic creation of redirect rules for client only paths
      },
    },
  ]
}
