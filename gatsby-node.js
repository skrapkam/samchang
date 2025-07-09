const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    // Check if the node has a parent and the parent has the necessary properties
    const parent = getNode(node.parent);
    if (parent && parent.sourceInstanceName) {
      const slug = createFilePath({
        node,
        trailingSlash: false,
        getNode,
        // Remove the `src/projects` prefix so nested project
        // directories generate clean URLs like `/ladder/example`.
        basePath: `src/projects`
      });
      createNodeField({
        node,
        name: `slug`,
        value: slug
      });
    }
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
        let parentSlug = null;
        let parentTitle = null;
        const parts = node.fields.slug.split('/').filter(Boolean);
        if (parts.length > 1) {
          // Use the first path segment as the parent slug. Do not include a
          // trailing slash so it matches the slug created by `createFilePath`.
          parentSlug = `/${parts[0]}`;
          const parent = posts.find(p => p.node.fields.slug === parentSlug);
          if (parent) {
            parentTitle = parent.node.frontmatter.title;
          }
        }
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/blog-post.js`),
          context: {
            prev: index === 0 ? false : posts[index - 1].node,
            next: index === posts.length - 1 ? false : posts[index + 1].node,
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug,
            parentTitle,
            parentSlug
          }
        });
      });
      resolve();
    });
  });
};
