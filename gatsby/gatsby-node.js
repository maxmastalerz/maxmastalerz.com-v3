/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path")

// create pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    {
      blogs: allStrapiBlogs {
        edges {
          previous {
            slug
          }
          node {
            slug
          }
          next {
            slug
          }
        }
      }
    }
  `)

  result.data.blogs.edges.forEach(({previous, node, next}) => {
    createPage({
      path: `/blogs/${node.slug}`,
      component: path.resolve(`src/templates/blog-template.js`),
      context: {
        previous: previous,
        slug: node.slug,
        next: next
      },
    })
  })
}