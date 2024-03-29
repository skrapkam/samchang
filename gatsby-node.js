const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({
      node,
      trailingSlash: false,
      getNode,
      basePath: `pages`
    });
    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
  }
};



exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
  type MarkdownRemarkFrontmatter {
    customField: CustomOrder
  }

  enum CustomOrder {
    VALUE_1
    VALUE_2
    VALUE_3
    VALUE_4
    VALUE_5
  }
`;
  createTypes(typeDefs)
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
    {
      allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              date
              title
            }
          }
        }
      }
    }
    `).then(result => {
      const posts = result.data.allMarkdownRemark.edges;

      posts.forEach(({ node }, index) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: {
            prev: index === 0 ? false : posts[index - 1].node,
            next: index === posts.length - 1 ? false : posts[index + 1].node,
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug
          }
        });
      });
      resolve();
    });
  });
};
