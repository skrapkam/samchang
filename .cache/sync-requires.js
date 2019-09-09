const { hot } = require("react-hot-loader/root");

// prefer default export if available
const preferDefault = m => (m && m.default) || m;

exports.components = {
  "component---src-templates-blog-post-js": hot(
    preferDefault(
      require("/Users/sam.chang/Desktop/samchang/src/templates/blog-post.js")
    )
  ),
  "component---cache-dev-404-page-js": hot(
    preferDefault(
      require("/Users/sam.chang/Desktop/samchang/.cache/dev-404-page.js")
    )
  ),
  "component---src-pages-404-js": hot(
    preferDefault(require("/Users/sam.chang/Desktop/samchang/src/pages/404.js"))
  ),
  "component---src-pages-index-js": hot(
    preferDefault(
      require("/Users/sam.chang/Desktop/samchang/src/pages/index.js")
    )
  ),
  "component---src-pages-info-index-js": hot(
    preferDefault(
      require("/Users/sam.chang/Desktop/samchang/src/pages/info/index.js")
    )
  ),
  "component---src-pages-music-index-js": hot(
    preferDefault(
      require("/Users/sam.chang/Desktop/samchang/src/pages/music/index.js")
    )
  ),
  "component---src-pages-reading-index-js": hot(
    preferDefault(
      require("/Users/sam.chang/Desktop/samchang/src/pages/reading/index.js")
    )
  )
};
