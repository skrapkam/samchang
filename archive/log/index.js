// import React from 'react'
// import { graphql } from 'gatsby'
// import Nav from '../../components/Nav'
// import Menu from '../../components/Menu'
// import { Helmet } from 'react-helmet'
// import { HeaderWrapper } from '../../styles/styles.js'
// import Gallery from '../../components/Gallery'

// export default ({ data }) => {
//   return (
//     <div>
//       <Helmet>
//         <meta charSet="utf-8" />
//         <title>Log | Sam Chang</title>
//         <meta http-equiv="x-ua-compatible" content="ie=edge; chrome=1" />
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
//         />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//       </Helmet>
//       <HeaderWrapper>
//         <Nav title="Log" />
//         <Menu />
//       </HeaderWrapper>
//       <Gallery posts={data.allInstagramContent} />
//     </div>
//   )
// }

// export const query = graphql`
//   query InstagramPosts {
//     allInstagramContent {
//       edges {
//         node {
//           link
//           localImage {
//             childImageSharp {
//               fluid(maxHeight: 500, maxWidth: 500, quality: 100) {
//                 ...GatsbyImageSharpFluid_withWebp_tracedSVG
//               }
//             }
//           }
//           images {
//             standard_resolution {
//               width
//               height
//               url
//             }
//             low_resolution {
//               url
//             }
//           }
//         }
//       }
//     }
//   }
// `
