(window.webpackJsonp = window.webpackJsonp || []).push([
  [6],
  {
    227: function(e, t, a) {
      "use strict";
      a.r(t),
        a.d(t, "fluidImage", function() {
          return m;
        }),
        a.d(t, "pageQuery", function() {
          return b;
        });
      var r = a(31),
        i = a(1),
        n = a(219),
        s = a(220),
        l = a(218),
        o = a(222),
        d = a(233),
        u = a.n(d),
        c = a(221),
        f = Object(r.a)("div", { target: "e8psyqw0" })({
          name: "uw2k83",
          styles:
            "display:grid;grid-template-columns:repeat(auto-fill,minmax(18rem,1fr));column-gap:40px;row-gap:40px;margin:0 auto;padding:32px 40px 40px 40px;img{border:none;}@media (max-width:950px){padding:0 var(--baseline) 24px;row-gap:24px;}"
        }),
        p = { name: "f5ickx", styles: "border:1px solid rgba(0,0,0,0.05);" },
        g = Object(r.a)("div", { target: "e8psyqw1" })({
          name: "1yuhvjn",
          styles: "margin-top:16px;"
        });
      t.default = function(e) {
        return Object(i.b)(
          l.a,
          null,
          Object(i.b)(
            o.a,
            null,
            Object(i.b)(
              c.Helmet,
              null,
              Object(i.b)("meta", { charSet: "utf-8" }),
              Object(i.b)("title", null, "Music | Sam Chang"),
              Object(i.b)("meta", {
                "http-equiv": "x-ua-compatible",
                content: "ie=edge; chrome=1"
              }),
              Object(i.b)("meta", {
                name: "viewport",
                content:
                  "width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
              }),
              Object(i.b)("meta", {
                name: "apple-mobile-web-app-capable",
                content: "yes"
              })
            ),
            Object(i.b)(
              l.b,
              null,
              Object(i.b)(n.a, { title: "Music" }),
              Object(i.b)(s.a, null)
            ),
            Object(i.b)(
              l.c,
              null,
              Object(i.b)(
                "p",
                null,
                "Written and produced by",
                " ",
                Object(i.b)(
                  "a",
                  { href: "http://groveralleyway.bandcamp.com" },
                  "Grover Alleyway"
                ),
                ". All tunes created on a laptop computer using Ableton Live software to control and mix VST plugins as well as manipulations of audio recordings."
              )
            ),
            Object(i.b)(
              f,
              null,
              Object(i.b)(
                "div",
                null,
                Object(i.b)(
                  "a",
                  { href: "https://song.link/i/1474641684" },
                  Object(i.b)(u.a, {
                    css: p,
                    fluid: e.data.imageTwo.childImageSharp.fluid
                  }),
                  Object(i.b)(g, null, "bl33din' luv")
                ),
                "Jul 2019"
              ),
              Object(i.b)(
                "div",
                null,
                Object(i.b)(
                  "a",
                  { href: "https://song.link/album/us/i/1469600060" },
                  Object(i.b)(u.a, {
                    css: p,
                    fluid: e.data.imageOne.childImageSharp.fluid
                  }),
                  Object(i.b)(g, null, "Barely Tolerable")
                ),
                "Feb 2019"
              )
            )
          )
        );
      };
      var m = "2409081020",
        b = "811296236";
    },
    233: function(e, t, a) {
      "use strict";
      a(15), a(16), a(3), a(68), a(113), a(234);
      var r = a(23);
      (t.__esModule = !0), (t.default = void 0);
      var i,
        n = r(a(55)),
        s = r(a(90)),
        l = r(a(152)),
        o = r(a(153)),
        d = r(a(0)),
        u = r(a(56)),
        c = function(e) {
          var t = (0, o.default)({}, e),
            a = t.resolutions,
            r = t.sizes,
            i = t.critical;
          return (
            a && ((t.fixed = a), delete t.resolutions),
            r && ((t.fluid = r), delete t.sizes),
            i && (t.loading = "eager"),
            t.fluid && (t.fluid = S([].concat(t.fluid))),
            t.fixed && (t.fixed = S([].concat(t.fixed))),
            t
          );
        },
        f = function(e) {
          var t = e.fluid,
            a = e.fixed;
          return ((t && t[0]) || (a && a[0])).src;
        },
        p = Object.create({}),
        g = function(e) {
          var t = c(e),
            a = f(t);
          return p[a] || !1;
        },
        m =
          "undefined" != typeof HTMLImageElement &&
          "loading" in HTMLImageElement.prototype,
        b = "undefined" != typeof window,
        h = b && window.IntersectionObserver,
        y = new WeakMap();
      function v(e) {
        return e.map(function(e) {
          var t = e.src,
            a = e.srcSet,
            r = e.srcSetWebp,
            i = e.media,
            n = e.sizes;
          return d.default.createElement(
            d.default.Fragment,
            { key: t },
            r &&
              d.default.createElement("source", {
                type: "image/webp",
                media: i,
                srcSet: r,
                sizes: n
              }),
            d.default.createElement("source", { media: i, srcSet: a, sizes: n })
          );
        });
      }
      function S(e) {
        var t = [],
          a = [];
        return (
          e.forEach(function(e) {
            return (e.media ? t : a).push(e);
          }),
          t.concat(a)
        );
      }
      function w(e) {
        return e.map(function(e) {
          var t = e.src,
            a = e.media,
            r = e.tracedSVG;
          return d.default.createElement("source", {
            key: t,
            media: a,
            srcSet: r
          });
        });
      }
      function O(e) {
        return e.map(function(e) {
          var t = e.src,
            a = e.media,
            r = e.base64;
          return d.default.createElement("source", {
            key: t,
            media: a,
            srcSet: r
          });
        });
      }
      function j(e, t) {
        var a = e.srcSet,
          r = e.srcSetWebp,
          i = e.media,
          n = e.sizes;
        return (
          "<source " +
          (t ? "type='image/webp' " : "") +
          (i ? 'media="' + i + '" ' : "") +
          'srcset="' +
          (t ? r : a) +
          '" ' +
          (n ? 'sizes="' + n + '" ' : "") +
          "/>"
        );
      }
      var E = function(e, t) {
          var a =
            (void 0 === i &&
              "undefined" != typeof window &&
              window.IntersectionObserver &&
              (i = new window.IntersectionObserver(
                function(e) {
                  e.forEach(function(e) {
                    if (y.has(e.target)) {
                      var t = y.get(e.target);
                      (e.isIntersecting || e.intersectionRatio > 0) &&
                        (i.unobserve(e.target), y.delete(e.target), t());
                    }
                  });
                },
                { rootMargin: "200px" }
              )),
            i);
          return (
            a && (a.observe(e), y.set(e, t)),
            function() {
              a.unobserve(e), y.delete(e);
            }
          );
        },
        L = function(e) {
          var t = e.src ? 'src="' + e.src + '" ' : 'src="" ',
            a = e.sizes ? 'sizes="' + e.sizes + '" ' : "",
            r = e.srcSet ? 'srcset="' + e.srcSet + '" ' : "",
            i = e.title ? 'title="' + e.title + '" ' : "",
            n = e.alt ? 'alt="' + e.alt + '" ' : 'alt="" ',
            s = e.width ? 'width="' + e.width + '" ' : "",
            l = e.height ? 'height="' + e.height + '" ' : "",
            o = e.crossOrigin ? 'crossorigin="' + e.crossOrigin + '" ' : "",
            d = e.loading ? 'loading="' + e.loading + '" ' : "",
            u = e.draggable ? 'draggable="' + e.draggable + '" ' : "";
          return (
            "<picture>" +
            e.imageVariants
              .map(function(e) {
                return (e.srcSetWebp ? j(e, !0) : "") + j(e);
              })
              .join("") +
            "<img " +
            d +
            s +
            l +
            a +
            r +
            t +
            n +
            i +
            o +
            u +
            'style="position:absolute;top:0;left:0;opacity:1;width:100%;height:100%;object-fit:cover;object-position:center"/></picture>'
          );
        },
        I = function(e) {
          var t = e.src,
            a = e.imageVariants,
            r = e.generateSources,
            i = e.spreadProps,
            n = d.default.createElement(x, (0, o.default)({ src: t }, i));
          return a.length > 1
            ? d.default.createElement("picture", null, r(a), n)
            : n;
        },
        x = d.default.forwardRef(function(e, t) {
          var a = e.sizes,
            r = e.srcSet,
            i = e.src,
            n = e.style,
            s = e.onLoad,
            u = e.onError,
            c = e.loading,
            f = e.draggable,
            p = (0, l.default)(e, [
              "sizes",
              "srcSet",
              "src",
              "style",
              "onLoad",
              "onError",
              "loading",
              "draggable"
            ]);
          return d.default.createElement(
            "img",
            (0, o.default)({ sizes: a, srcSet: r, src: i }, p, {
              onLoad: s,
              onError: u,
              ref: t,
              loading: c,
              draggable: f,
              style: (0, o.default)(
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center"
                },
                n
              )
            })
          );
        });
      x.propTypes = {
        style: u.default.object,
        onError: u.default.func,
        onLoad: u.default.func
      };
      var R = (function(e) {
        function t(t) {
          var a;
          ((a = e.call(this, t) || this).seenBefore = b && g(t)),
            (a.addNoScript = !(t.critical && !t.fadeIn)),
            (a.useIOSupport = !m && h && !t.critical && !a.seenBefore);
          var r = t.critical || (b && (m || !a.useIOSupport));
          return (
            (a.state = {
              isVisible: r,
              imgLoaded: !1,
              imgCached: !1,
              fadeIn: !a.seenBefore && t.fadeIn
            }),
            (a.imageRef = d.default.createRef()),
            (a.handleImageLoaded = a.handleImageLoaded.bind(
              (0, s.default)((0, s.default)(a))
            )),
            (a.handleRef = a.handleRef.bind((0, s.default)((0, s.default)(a)))),
            a
          );
        }
        (0, n.default)(t, e);
        var a = t.prototype;
        return (
          (a.componentDidMount = function() {
            if (
              (this.state.isVisible &&
                "function" == typeof this.props.onStartLoad &&
                this.props.onStartLoad({ wasCached: g(this.props) }),
              this.props.critical)
            ) {
              var e = this.imageRef.current;
              e && e.complete && this.handleImageLoaded();
            }
          }),
          (a.componentWillUnmount = function() {
            this.cleanUpListeners && this.cleanUpListeners();
          }),
          (a.handleRef = function(e) {
            var t = this;
            this.useIOSupport &&
              e &&
              (this.cleanUpListeners = E(e, function() {
                var e = g(t.props);
                t.state.isVisible ||
                  "function" != typeof t.props.onStartLoad ||
                  t.props.onStartLoad({ wasCached: e }),
                  t.setState({ isVisible: !0 }, function() {
                    return t.setState({
                      imgLoaded: e,
                      imgCached: !!t.imageRef.current.currentSrc
                    });
                  });
              }));
          }),
          (a.handleImageLoaded = function() {
            var e, t, a;
            (e = this.props),
              (t = c(e)),
              (a = f(t)),
              (p[a] = !0),
              this.setState({ imgLoaded: !0 }),
              this.props.onLoad && this.props.onLoad();
          }),
          (a.render = function() {
            var e = c(this.props),
              t = e.title,
              a = e.alt,
              r = e.className,
              i = e.style,
              n = void 0 === i ? {} : i,
              s = e.imgStyle,
              l = void 0 === s ? {} : s,
              u = e.placeholderStyle,
              f = void 0 === u ? {} : u,
              p = e.placeholderClassName,
              g = e.fluid,
              m = e.fixed,
              b = e.backgroundColor,
              h = e.durationFadeIn,
              y = e.Tag,
              S = e.itemProp,
              j = e.loading,
              E = e.draggable,
              R = !1 === this.state.fadeIn || this.state.imgLoaded,
              V = !0 === this.state.fadeIn && !this.state.imgCached,
              z = (0, o.default)(
                {
                  opacity: R ? 1 : 0,
                  transition: V ? "opacity " + h + "ms" : "none"
                },
                l
              ),
              k = "boolean" == typeof b ? "lightgray" : b,
              T = { transitionDelay: h + "ms" },
              C = (0, o.default)(
                { opacity: this.state.imgLoaded ? 0 : 1 },
                V && T,
                l,
                f
              ),
              q = {
                title: t,
                alt: this.state.isVisible ? "" : a,
                style: C,
                className: p
              };
            if (g) {
              var N = g,
                P = N[0];
              return d.default.createElement(
                y,
                {
                  className: (r || "") + " gatsby-image-wrapper",
                  style: (0, o.default)(
                    { position: "relative", overflow: "hidden" },
                    n
                  ),
                  ref: this.handleRef,
                  key: "fluid-" + JSON.stringify(P.srcSet)
                },
                d.default.createElement(y, {
                  style: {
                    width: "100%",
                    paddingBottom: 100 / P.aspectRatio + "%"
                  }
                }),
                k &&
                  d.default.createElement(y, {
                    title: t,
                    style: (0, o.default)(
                      {
                        backgroundColor: k,
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        opacity: this.state.imgLoaded ? 0 : 1,
                        right: 0,
                        left: 0
                      },
                      V && T
                    )
                  }),
                P.base64 &&
                  d.default.createElement(I, {
                    src: P.base64,
                    spreadProps: q,
                    imageVariants: N,
                    generateSources: O
                  }),
                P.tracedSVG &&
                  d.default.createElement(I, {
                    src: P.tracedSVG,
                    spreadProps: q,
                    imageVariants: N,
                    generateSources: w
                  }),
                this.state.isVisible &&
                  d.default.createElement(
                    "picture",
                    null,
                    v(N),
                    d.default.createElement(x, {
                      alt: a,
                      title: t,
                      sizes: P.sizes,
                      src: P.src,
                      crossOrigin: this.props.crossOrigin,
                      srcSet: P.srcSet,
                      style: z,
                      ref: this.imageRef,
                      onLoad: this.handleImageLoaded,
                      onError: this.props.onError,
                      itemProp: S,
                      loading: j,
                      draggable: E
                    })
                  ),
                this.addNoScript &&
                  d.default.createElement("noscript", {
                    dangerouslySetInnerHTML: {
                      __html: L(
                        (0, o.default)({ alt: a, title: t, loading: j }, P, {
                          imageVariants: N
                        })
                      )
                    }
                  })
              );
            }
            if (m) {
              var M = m,
                W = M[0],
                G = (0, o.default)(
                  {
                    position: "relative",
                    overflow: "hidden",
                    display: "inline-block",
                    width: W.width,
                    height: W.height
                  },
                  n
                );
              return (
                "inherit" === n.display && delete G.display,
                d.default.createElement(
                  y,
                  {
                    className: (r || "") + " gatsby-image-wrapper",
                    style: G,
                    ref: this.handleRef,
                    key: "fixed-" + JSON.stringify(W.srcSet)
                  },
                  k &&
                    d.default.createElement(y, {
                      title: t,
                      style: (0, o.default)(
                        {
                          backgroundColor: k,
                          width: W.width,
                          opacity: this.state.imgLoaded ? 0 : 1,
                          height: W.height
                        },
                        V && T
                      )
                    }),
                  W.base64 &&
                    d.default.createElement(I, {
                      src: W.base64,
                      spreadProps: q,
                      imageVariants: M,
                      generateSources: O
                    }),
                  W.tracedSVG &&
                    d.default.createElement(I, {
                      src: W.tracedSVG,
                      spreadProps: q,
                      imageVariants: M,
                      generateSources: w
                    }),
                  this.state.isVisible &&
                    d.default.createElement(
                      "picture",
                      null,
                      v(M),
                      d.default.createElement(x, {
                        alt: a,
                        title: t,
                        width: W.width,
                        height: W.height,
                        sizes: W.sizes,
                        src: W.src,
                        crossOrigin: this.props.crossOrigin,
                        srcSet: W.srcSet,
                        style: z,
                        ref: this.imageRef,
                        onLoad: this.handleImageLoaded,
                        onError: this.props.onError,
                        itemProp: S,
                        loading: j,
                        draggable: E
                      })
                    ),
                  this.addNoScript &&
                    d.default.createElement("noscript", {
                      dangerouslySetInnerHTML: {
                        __html: L(
                          (0, o.default)({ alt: a, title: t, loading: j }, W, {
                            imageVariants: M
                          })
                        )
                      }
                    })
                )
              );
            }
            return null;
          }),
          t
        );
      })(d.default.Component);
      R.defaultProps = {
        fadeIn: !0,
        durationFadeIn: 500,
        alt: "",
        Tag: "div",
        loading: "lazy"
      };
      var V = u.default.shape({
          width: u.default.number.isRequired,
          height: u.default.number.isRequired,
          src: u.default.string.isRequired,
          srcSet: u.default.string.isRequired,
          base64: u.default.string,
          tracedSVG: u.default.string,
          srcWebp: u.default.string,
          srcSetWebp: u.default.string,
          media: u.default.string
        }),
        z = u.default.shape({
          aspectRatio: u.default.number.isRequired,
          src: u.default.string.isRequired,
          srcSet: u.default.string.isRequired,
          sizes: u.default.string.isRequired,
          base64: u.default.string,
          tracedSVG: u.default.string,
          srcWebp: u.default.string,
          srcSetWebp: u.default.string,
          media: u.default.string
        });
      R.propTypes = {
        resolutions: V,
        sizes: z,
        fixed: u.default.oneOfType([V, u.default.arrayOf(V)]),
        fluid: u.default.oneOfType([z, u.default.arrayOf(z)]),
        fadeIn: u.default.bool,
        durationFadeIn: u.default.number,
        title: u.default.string,
        alt: u.default.string,
        className: u.default.oneOfType([u.default.string, u.default.object]),
        critical: u.default.bool,
        crossOrigin: u.default.oneOfType([u.default.string, u.default.bool]),
        style: u.default.object,
        imgStyle: u.default.object,
        placeholderStyle: u.default.object,
        placeholderClassName: u.default.string,
        backgroundColor: u.default.oneOfType([
          u.default.string,
          u.default.bool
        ]),
        onLoad: u.default.func,
        onError: u.default.func,
        onStartLoad: u.default.func,
        Tag: u.default.string,
        itemProp: u.default.string,
        loading: u.default.oneOf(["auto", "lazy", "eager"]),
        draggable: u.default.bool
      };
      var k = R;
      t.default = k;
    },
    234: function(e, t, a) {
      "use strict";
      a(235)("fixed", function(e) {
        return function() {
          return e(this, "tt", "", "");
        };
      });
    },
    235: function(e, t, a) {
      var r = a(2),
        i = a(14),
        n = a(47),
        s = /"/g,
        l = function(e, t, a, r) {
          var i = String(n(e)),
            l = "<" + t;
          return (
            "" !== a &&
              (l += " " + a + '="' + String(r).replace(s, "&quot;") + '"'),
            l + ">" + i + "</" + t + ">"
          );
        };
      e.exports = function(e, t) {
        var a = {};
        (a[e] = t(l)),
          r(
            r.P +
              r.F *
                i(function() {
                  var t = ""[e]('"');
                  return t !== t.toLowerCase() || t.split('"').length > 3;
                }),
            "String",
            a
          );
      };
    }
  }
]);
//# sourceMappingURL=component---src-pages-music-index-js-c2ced39537d2f0911a80.js.map
