// prefer default export if available
const preferDefault = m => (m && m.default) || m;

exports.components = {
  "component---src-templates-blog-post-js": () =>
    import(
      "/Users/sam.chang/Desktop/samchang/src/templates/blog-post.js" /* webpackChunkName: "component---src-templates-blog-post-js" */
    ),
  "component---cache-dev-404-page-js": () =>
    import(
      "/Users/sam.chang/Desktop/samchang/.cache/dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */
    ),
  "component---src-pages-404-js": () =>
    import(
      "/Users/sam.chang/Desktop/samchang/src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */
    ),
  "component---src-pages-index-js": () =>
    import(
      "/Users/sam.chang/Desktop/samchang/src/pages/index.js" /* webpackChunkName: "component---src-pages-index-js" */
    ),
  "component---src-pages-info-index-js": () =>
    import(
      "/Users/sam.chang/Desktop/samchang/src/pages/info/index.js" /* webpackChunkName: "component---src-pages-info-index-js" */
    ),
  "component---src-pages-music-index-js": () =>
    import(
      "/Users/sam.chang/Desktop/samchang/src/pages/music/index.js" /* webpackChunkName: "component---src-pages-music-index-js" */
    ),
  "component---src-pages-reading-index-js": () =>
    import(
      "/Users/sam.chang/Desktop/samchang/src/pages/reading/index.js" /* webpackChunkName: "component---src-pages-reading-index-js" */
    )
};
