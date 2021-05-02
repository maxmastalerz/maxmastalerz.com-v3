/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path")
const { GraphQLJSONObject } = require(`graphql-type-json`);
const striptags = require(`striptags`);
const lunr = require(`lunr`);

const createIndex = async (blogNodes, type, cache) => {
  const cacheKey = `IndexLunr`
  const cached = await cache.get(cacheKey)
  if (cached) {
    return cached;
  }

  const documents = [];
  const store = {};
  // Iterate over all posts 
  for (const node of blogNodes) {
    const {id, slug, title, short_desc, date, image, long_desc} = node
    documents.push({
      slug: node.slug,
      title: node.title,
      short_desc: node.short_desc,
      content: long_desc,
    })
    store[slug] = {
      id,
      title,
      short_desc,
      date,
      image
    }
  }
  const index = lunr(function() {
    this.ref(`slug`)
    this.field(`title`)
    this.field(`short_desc`)
    this.field(`content`)
    for (const doc of documents) {
      this.add(doc)
    }
  })
  const json = { index: index.toJSON(), store };
  await cache.set(cacheKey, json);
  return json;
}

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

exports.createResolvers = ({ cache, createResolvers }) => {
  createResolvers({
    Query: {
      LunrIndex: {
        type: GraphQLJSONObject,
        resolve: (source, args, context, info) => {
          const blogNodes = context.nodeModel.getAllNodes({
            type: `StrapiBlogs`,
          })
          const type = info.schema.getType(`StrapiBlogs`);
          return createIndex(blogNodes, type, cache)
        },
      },
    },
  })
};
