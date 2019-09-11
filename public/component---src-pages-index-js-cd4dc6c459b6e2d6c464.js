(window.webpackJsonp = window.webpackJsonp || []).push([
  [4],
  {
    225: function(e, t, a) {
      "use strict";
      a.r(t),
        a.d(t, "query", function() {
          return x;
        });
      var r = a(31),
        i = a(1),
        n = a(233),
        o = a.n(n),
        s = a(7),
        l = a.n(s),
        d = a(222),
        c = a(219),
        u = a(220),
        f = a(232),
        p = a(218),
        g = a(221),
        m = {
          name: "18jae8v",
          styles:
            "display:none;@media (max-width:950px){visibility:hidden;width:2px;display:inline-block;}"
        },
        b = {
          name: "xmek7b",
          styles:
            "text-decoration:none;color:var(--link-color);font-size:0.8em;border:2px solid var(--link-color);border-radius:2px;text-transform:uppercase;box-sizing:border-box;padding:7px 10px;letter-spacing:0.5px;&:hover{background:#00f;color:#fff;}&:after{background:0 0;}"
        },
        h = {
          name: "m80nmz",
          styles:
            "line-height:24px;margin-top:8px;display:block;max-width:450px;"
        },
        v = {
          name: "ch57k9",
          styles:
            "display:none;@media (max-width:950px){background:white;display:block;position:relative;height:37px;width:100%;bottom:23px;}"
        },
        y = Object(r.a)("div", { target: "e12h3s7g0" })({
          name: "141g22y",
          styles:
            "margin-top:32px;@media (max-width:950px){padding-left:var(--baseline);padding-right:var(--baseline);margin-top:-26px;font-size:var(--tiny-text);}"
        }),
        w = Object(r.a)("div", { target: "e12h3s7g1" })({
          name: "1gtf161",
          styles: "margin:0 auto 80px;a{}@media (max-width:950px){}"
        }),
        S = Object(r.a)("div", { target: "e12h3s7g2" })({
          name: "ublho6",
          styles:
            "display:grid;grid-template-columns:410px 410px;grid-row:auto auto;grid-column-gap:32px;grid-row-gap:32px;img{border:1px solid rgba(0,0,0,0.1);}@media (max-width:950px){grid-template-columns:1fr 1fr 1fr 1fr 1fr;-webkit-overflow-scrolling:touch;padding-left:var(--baseline);grid-column-gap:24px;overflow:auto;padding-bottom:27px;}"
        });
      t.default = function(e) {
        var t = e.data;
        return Object(i.b)(
          d.a,
          null,
          Object(i.b)(
            "div",
            { className: "wrapper" },
            Object(i.b)(
              g.Helmet,
              null,
              Object(i.b)("meta", { charSet: "utf-8" }),
              Object(i.b)("title", null, "Sam Chang"),
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
              p.b,
              null,
              Object(i.b)(c.a, null),
              Object(i.b)(u.a, null)
            ),
            Object(i.b)(
              p.d,
              null,
              t.allMarkdownRemark.edges.map(function(e) {
                var t = e.node;
                return Object(
                  i.b
                )("div", { key: t.id }, Object(i.b)(w, null, Object(i.b)(S, null, Object(i.b)(o.a, { sizes: t.frontmatter.image1.childImageSharp.sizes }), Object(i.b)(o.a, { sizes: t.frontmatter.image2.childImageSharp.sizes }), Object(i.b)(o.a, { sizes: t.frontmatter.image3.childImageSharp.sizes }), Object(i.b)(o.a, { sizes: t.frontmatter.image4.childImageSharp.sizes }), Object(i.b)("div", { css: m })), Object(i.b)("div", { css: v }), Object(i.b)(y, null, Object(i.b)("p", null, Object(i.b)("strong", null, t.frontmatter.title), ",", " ", t.frontmatter.date), Object(i.b)("span", { css: h }, t.frontmatter.excerpt), Object(i.b)(f.a, null, Object(i.b)(l.a, { css: b, to: t.fields.slug }, "View")))));
              })
            )
          )
        );
      };
      var x = "157230678";
    },
    232: function(e, t, a) {
      "use strict";
      var r = a(1),
        i = a(0);
      var n = {
          name: "kudqja",
          styles:
            "margin-top:24px;font-weight:600;width:70px;height:30px;text-align:left;-webkit-user-select:none;a:visited{&:hover{background:white:color:var(--link-color);border-bottom:2px solid var(--link-color);}}a,a:active,a:focus,a:hover,a:link{font-weight:600;text-decoration:none;color:var(--link-color);font-size:0.8em;border:2px solid var(--link-color);border-radius:2px;text-transform:uppercase;box-sizing:border-box;padding:7px 10px;letter-spacing:0.5px;border-bottom:2px solid var(--link-color);&:hover{background:var(--link-color);color:#fff;}&:after{background:0 0;}}"
        },
        o = (function(e) {
          var t, a;
          function i() {
            return e.apply(this, arguments) || this;
          }
          return (
            (a = e),
            ((t = i).prototype = Object.create(a.prototype)),
            (t.prototype.constructor = t),
            (t.__proto__ = a),
            (i.prototype.render = function() {
              return Object(r.b)("div", { css: n }, this.props.children);
            }),
            i
          );
        })(i.Component);
      t.a = o;
    },
    233: function(e, t, a) {
      "use strict";
      a(15), a(16), a(3), a(68), a(113), a(234);
      var r = a(23);
      (t.__esModule = !0), (t.default = void 0);
      var i,
        n = r(a(55)),
        o = r(a(90)),
        s = r(a(152)),
        l = r(a(153)),
        d = r(a(0)),
        c = r(a(56)),
        u = function(e) {
          var t = (0, l.default)({}, e),
            a = t.resolutions,
            r = t.sizes,
            i = t.critical;
          return (
            a && ((t.fixed = a), delete t.resolutions),
            r && ((t.fluid = r), delete t.sizes),
            i && (t.loading = "eager"),
            t.fluid && (t.fluid = w([].concat(t.fluid))),
            t.fixed && (t.fixed = w([].concat(t.fixed))),
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
          var t = u(e),
            a = f(t);
          return p[a] || !1;
        },
        m =
          "undefined" != typeof HTMLImageElement &&
          "loading" in HTMLImageElement.prototype,
        b = "undefined" != typeof window,
        h = b && window.IntersectionObserver,
        v = new WeakMap();
      function y(e) {
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
      function w(e) {
        var t = [],
          a = [];
        return (
          e.forEach(function(e) {
            return (e.media ? t : a).push(e);
          }),
          t.concat(a)
        );
      }
      function S(e) {
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
      function x(e) {
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
      function O(e, t) {
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
      var j = function(e, t) {
          var a =
            (void 0 === i &&
              "undefined" != typeof window &&
              window.IntersectionObserver &&
              (i = new window.IntersectionObserver(
                function(e) {
                  e.forEach(function(e) {
                    if (v.has(e.target)) {
                      var t = v.get(e.target);
                      (e.isIntersecting || e.intersectionRatio > 0) &&
                        (i.unobserve(e.target), v.delete(e.target), t());
                    }
                  });
                },
                { rootMargin: "200px" }
              )),
            i);
          return (
            a && (a.observe(e), v.set(e, t)),
            function() {
              a.unobserve(e), v.delete(e);
            }
          );
        },
        k = function(e) {
          var t = e.src ? 'src="' + e.src + '" ' : 'src="" ',
            a = e.sizes ? 'sizes="' + e.sizes + '" ' : "",
            r = e.srcSet ? 'srcset="' + e.srcSet + '" ' : "",
            i = e.title ? 'title="' + e.title + '" ' : "",
            n = e.alt ? 'alt="' + e.alt + '" ' : 'alt="" ',
            o = e.width ? 'width="' + e.width + '" ' : "",
            s = e.height ? 'height="' + e.height + '" ' : "",
            l = e.crossOrigin ? 'crossorigin="' + e.crossOrigin + '" ' : "",
            d = e.loading ? 'loading="' + e.loading + '" ' : "",
            c = e.draggable ? 'draggable="' + e.draggable + '" ' : "";
          return (
            "<picture>" +
            e.imageVariants
              .map(function(e) {
                return (e.srcSetWebp ? O(e, !0) : "") + O(e);
              })
              .join("") +
            "<img " +
            d +
            o +
            s +
            a +
            r +
            t +
            n +
            i +
            l +
            c +
            'style="position:absolute;top:0;left:0;opacity:1;width:100%;height:100%;object-fit:cover;object-position:center"/></picture>'
          );
        },
        E = function(e) {
          var t = e.src,
            a = e.imageVariants,
            r = e.generateSources,
            i = e.spreadProps,
            n = d.default.createElement(z, (0, l.default)({ src: t }, i));
          return a.length > 1
            ? d.default.createElement("picture", null, r(a), n)
            : n;
        },
        z = d.default.forwardRef(function(e, t) {
          var a = e.sizes,
            r = e.srcSet,
            i = e.src,
            n = e.style,
            o = e.onLoad,
            c = e.onError,
            u = e.loading,
            f = e.draggable,
            p = (0, s.default)(e, [
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
            (0, l.default)({ sizes: a, srcSet: r, src: i }, p, {
              onLoad: o,
              onError: c,
              ref: t,
              loading: u,
              draggable: f,
              style: (0, l.default)(
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
      z.propTypes = {
        style: c.default.object,
        onError: c.default.func,
        onLoad: c.default.func
      };
      var L = (function(e) {
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
              (0, o.default)((0, o.default)(a))
            )),
            (a.handleRef = a.handleRef.bind((0, o.default)((0, o.default)(a)))),
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
              (this.cleanUpListeners = j(e, function() {
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
              (t = u(e)),
              (a = f(t)),
              (p[a] = !0),
              this.setState({ imgLoaded: !0 }),
              this.props.onLoad && this.props.onLoad();
          }),
          (a.render = function() {
            var e = u(this.props),
              t = e.title,
              a = e.alt,
              r = e.className,
              i = e.style,
              n = void 0 === i ? {} : i,
              o = e.imgStyle,
              s = void 0 === o ? {} : o,
              c = e.placeholderStyle,
              f = void 0 === c ? {} : c,
              p = e.placeholderClassName,
              g = e.fluid,
              m = e.fixed,
              b = e.backgroundColor,
              h = e.durationFadeIn,
              v = e.Tag,
              w = e.itemProp,
              O = e.loading,
              j = e.draggable,
              L = !1 === this.state.fadeIn || this.state.imgLoaded,
              I = !0 === this.state.fadeIn && !this.state.imgCached,
              R = (0, l.default)(
                {
                  opacity: L ? 1 : 0,
                  transition: I ? "opacity " + h + "ms" : "none"
                },
                s
              ),
              V = "boolean" == typeof b ? "lightgray" : b,
              C = { transitionDelay: h + "ms" },
              T = (0, l.default)(
                { opacity: this.state.imgLoaded ? 0 : 1 },
                I && C,
                s,
                f
              ),
              N = {
                title: t,
                alt: this.state.isVisible ? "" : a,
                style: T,
                className: p
              };
            if (g) {
              var q = g,
                P = q[0];
              return d.default.createElement(
                v,
                {
                  className: (r || "") + " gatsby-image-wrapper",
                  style: (0, l.default)(
                    { position: "relative", overflow: "hidden" },
                    n
                  ),
                  ref: this.handleRef,
                  key: "fluid-" + JSON.stringify(P.srcSet)
                },
                d.default.createElement(v, {
                  style: {
                    width: "100%",
                    paddingBottom: 100 / P.aspectRatio + "%"
                  }
                }),
                V &&
                  d.default.createElement(v, {
                    title: t,
                    style: (0, l.default)(
                      {
                        backgroundColor: V,
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        opacity: this.state.imgLoaded ? 0 : 1,
                        right: 0,
                        left: 0
                      },
                      I && C
                    )
                  }),
                P.base64 &&
                  d.default.createElement(E, {
                    src: P.base64,
                    spreadProps: N,
                    imageVariants: q,
                    generateSources: x
                  }),
                P.tracedSVG &&
                  d.default.createElement(E, {
                    src: P.tracedSVG,
                    spreadProps: N,
                    imageVariants: q,
                    generateSources: S
                  }),
                this.state.isVisible &&
                  d.default.createElement(
                    "picture",
                    null,
                    y(q),
                    d.default.createElement(z, {
                      alt: a,
                      title: t,
                      sizes: P.sizes,
                      src: P.src,
                      crossOrigin: this.props.crossOrigin,
                      srcSet: P.srcSet,
                      style: R,
                      ref: this.imageRef,
                      onLoad: this.handleImageLoaded,
                      onError: this.props.onError,
                      itemProp: w,
                      loading: O,
                      draggable: j
                    })
                  ),
                this.addNoScript &&
                  d.default.createElement("noscript", {
                    dangerouslySetInnerHTML: {
                      __html: k(
                        (0, l.default)({ alt: a, title: t, loading: O }, P, {
                          imageVariants: q
                        })
                      )
                    }
                  })
              );
            }
            if (m) {
              var _ = m,
                M = _[0],
                W = (0, l.default)(
                  {
                    position: "relative",
                    overflow: "hidden",
                    display: "inline-block",
                    width: M.width,
                    height: M.height
                  },
                  n
                );
              return (
                "inherit" === n.display && delete W.display,
                d.default.createElement(
                  v,
                  {
                    className: (r || "") + " gatsby-image-wrapper",
                    style: W,
                    ref: this.handleRef,
                    key: "fixed-" + JSON.stringify(M.srcSet)
                  },
                  V &&
                    d.default.createElement(v, {
                      title: t,
                      style: (0, l.default)(
                        {
                          backgroundColor: V,
                          width: M.width,
                          opacity: this.state.imgLoaded ? 0 : 1,
                          height: M.height
                        },
                        I && C
                      )
                    }),
                  M.base64 &&
                    d.default.createElement(E, {
                      src: M.base64,
                      spreadProps: N,
                      imageVariants: _,
                      generateSources: x
                    }),
                  M.tracedSVG &&
                    d.default.createElement(E, {
                      src: M.tracedSVG,
                      spreadProps: N,
                      imageVariants: _,
                      generateSources: S
                    }),
                  this.state.isVisible &&
                    d.default.createElement(
                      "picture",
                      null,
                      y(_),
                      d.default.createElement(z, {
                        alt: a,
                        title: t,
                        width: M.width,
                        height: M.height,
                        sizes: M.sizes,
                        src: M.src,
                        crossOrigin: this.props.crossOrigin,
                        srcSet: M.srcSet,
                        style: R,
                        ref: this.imageRef,
                        onLoad: this.handleImageLoaded,
                        onError: this.props.onError,
                        itemProp: w,
                        loading: O,
                        draggable: j
                      })
                    ),
                  this.addNoScript &&
                    d.default.createElement("noscript", {
                      dangerouslySetInnerHTML: {
                        __html: k(
                          (0, l.default)({ alt: a, title: t, loading: O }, M, {
                            imageVariants: _
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
      L.defaultProps = {
        fadeIn: !0,
        durationFadeIn: 500,
        alt: "",
        Tag: "div",
        loading: "lazy"
      };
      var I = c.default.shape({
          width: c.default.number.isRequired,
          height: c.default.number.isRequired,
          src: c.default.string.isRequired,
          srcSet: c.default.string.isRequired,
          base64: c.default.string,
          tracedSVG: c.default.string,
          srcWebp: c.default.string,
          srcSetWebp: c.default.string,
          media: c.default.string
        }),
        R = c.default.shape({
          aspectRatio: c.default.number.isRequired,
          src: c.default.string.isRequired,
          srcSet: c.default.string.isRequired,
          sizes: c.default.string.isRequired,
          base64: c.default.string,
          tracedSVG: c.default.string,
          srcWebp: c.default.string,
          srcSetWebp: c.default.string,
          media: c.default.string
        });
      L.propTypes = {
        resolutions: I,
        sizes: R,
        fixed: c.default.oneOfType([I, c.default.arrayOf(I)]),
        fluid: c.default.oneOfType([R, c.default.arrayOf(R)]),
        fadeIn: c.default.bool,
        durationFadeIn: c.default.number,
        title: c.default.string,
        alt: c.default.string,
        className: c.default.oneOfType([c.default.string, c.default.object]),
        critical: c.default.bool,
        crossOrigin: c.default.oneOfType([c.default.string, c.default.bool]),
        style: c.default.object,
        imgStyle: c.default.object,
        placeholderStyle: c.default.object,
        placeholderClassName: c.default.string,
        backgroundColor: c.default.oneOfType([
          c.default.string,
          c.default.bool
        ]),
        onLoad: c.default.func,
        onError: c.default.func,
        onStartLoad: c.default.func,
        Tag: c.default.string,
        itemProp: c.default.string,
        loading: c.default.oneOf(["auto", "lazy", "eager"]),
        draggable: c.default.bool
      };
      var V = L;
      t.default = V;
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
        o = /"/g,
        s = function(e, t, a, r) {
          var i = String(n(e)),
            s = "<" + t;
          return (
            "" !== a &&
              (s += " " + a + '="' + String(r).replace(o, "&quot;") + '"'),
            s + ">" + i + "</" + t + ">"
          );
        };
      e.exports = function(e, t) {
        var a = {};
        (a[e] = t(s)),
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
//# sourceMappingURL=component---src-pages-index-js-cd4dc6c459b6e2d6c464.js.map
