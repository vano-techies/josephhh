const fs = require('fs');
const vm = require('vm');

console.log("Applying foolproof visible styling for Screenshot 536 and Back to Showroom...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

// Locate Header and Hero Section in FLPage
const headerStartTarget = '/* 1. TOP NAVBAR (HIGH-VISIBILITY BACK TO SHOWROOM) */';
let startIdx = js.indexOf(headerStartTarget);
if (startIdx === -1) {
  startIdx = js.indexOf('/* 1. TOP NAVBAR');
}

const heroEndTarget = '/* Left Semi-Circle Carousel Arrow */';
const endIdx = js.indexOf(heroEndTarget, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find start and end boundaries:", startIdx, endIdx);
  process.exit(1);
}

const visibleHeaderAndHero = `/* 1. TOP NAVBAR (HIGH-VISIBILITY BACK TO SHOWROOM) */
      /* ========================================================================= */
      T.jsx("header", {
        className: "w-full sticky top-0 z-50 text-white shadow-xl backdrop-blur-md",
        style: {
          backgroundColor: "#121c27",
          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 999
        },
        children: T.jsxs("div", {
          className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between",
          children: [
            /* Highly visible '← Back to Showroom' button */
            T.jsxs("button", {
              type: "button",
              onClick: backFn,
              className: "screenshot-back-btn",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#FFFFFF",
                color: "#111827",
                border: "2px solid #FFFFFF",
                padding: "10px 24px",
                borderRadius: "9999px",
                fontWeight: "800",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.35)",
                cursor: "pointer"
              },
              children: [
                T.jsx("span", { style: { fontSize: "16px", fontWeight: "900", lineHeight: 1 }, children: "←" }),
                T.jsx("span", { children: "Back to Showroom" })
              ]
            }),

            /* Right WhatsApp Quick Inquiry */
            T.jsxs("a", {
              href: whatsappCarUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "9999px",
                backgroundColor: "#25D366",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                boxShadow: "0 4px 15px rgba(37, 211, 102, 0.4)",
                textDecoration: "none"
              },
              children: [
                T.jsx("span", { style: { fontSize: "16px" }, children: "💬" }),
                T.jsx("span", { children: "Inquire on WhatsApp" })
              ]
            })
          ]
        })
      }),

      /* ========================================================================= */
      /* 2. HERO SHOWCASE SECTION (SCREENSHOT 536 EXACT MATCH) */
      /* ========================================================================= */
      T.jsxs("section", {
        className: "screenshot-hero-bg relative w-full overflow-hidden select-none",
        style: {
          backgroundColor: "#162330",
          color: "#FFFFFF",
          paddingTop: "48px",
          paddingBottom: "80px",
          width: "100%",
          position: "relative"
        },
        children: [
          /* Main Car Display Stage with Asymmetrical Left Podium Card matching Screenshot 536 */
          T.jsx("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative",
            children: T.jsxs("div", {
              className: "relative flex flex-col lg:flex-row items-center justify-between min-h-[380px] sm:min-h-[460px] pb-4",
              children: [
                /* Left Slate Capsule Card matching Screenshot 536 */
                T.jsxs("div", {
                  className: "screenshot-hero-podium w-full lg:w-[540px]",
                  style: {
                    backgroundColor: "rgba(51, 66, 83, 0.94)",
                    backdropFilter: "blur(12px)",
                    borderTopLeftRadius: "95px",
                    borderBottomLeftRadius: "45px",
                    borderTopRightRadius: "0px",
                    borderBottomRightRadius: "0px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.22)",
                    borderLeft: "1px solid rgba(255, 255, 255, 0.22)",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
                    padding: "36px 44px",
                    position: "relative",
                    zIndex: 10
                  },
                  children: [
                    /* Car Model Title - clean, regular font matching Screenshot 536 */
                    T.jsx("h2", {
                      style: {
                        fontSize: "26px",
                        fontWeight: "400",
                        color: "#FFFFFF",
                        letterSpacing: "0.02em",
                        marginBottom: "22px",
                        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
                      },
                      children: fullName
                    }),

                    /* 3 Stats Row in Screenshot 536 style */
                    T.jsxs("div", {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "6px"
                      },
                      children: [
                        /* Stat 1: Torque */
                        T.jsxs("div", {
                          style: { paddingRight: "16px" },
                          children: [
                            T.jsx("div", {
                              className: "screenshot-stat-num",
                              style: {
                                fontSize: "36px",
                                fontWeight: "800",
                                color: "#FFFFFF",
                                letterSpacing: "-0.02em",
                                lineHeight: 1
                              },
                              children: carPerformanceStats.torque
                            }),
                            T.jsx("div", {
                              className: "screenshot-stat-label",
                              style: {
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "rgba(255, 255, 255, 0.82)",
                                marginTop: "6px"
                              },
                              children: "Torque"
                            })
                          ]
                        }),

                        /* Divider 1 */
                        T.jsx("div", {
                          className: "screenshot-stat-divider",
                          style: {
                            width: "1.5px",
                            height: "52px",
                            backgroundColor: "rgba(255, 255, 255, 0.35)",
                            margin: "0 18px",
                            flexShrink: 0
                          }
                        }),

                        /* Stat 2: 0-100 km/h */
                        T.jsxs("div", {
                          style: { paddingLeft: "4px", paddingRight: "16px" },
                          children: [
                            T.jsx("div", {
                              className: "screenshot-stat-num",
                              style: {
                                fontSize: "36px",
                                fontWeight: "800",
                                color: "#FFFFFF",
                                letterSpacing: "-0.02em",
                                lineHeight: 1
                              },
                              children: carPerformanceStats.accel
                            }),
                            T.jsx("div", {
                              className: "screenshot-stat-label",
                              style: {
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "rgba(255, 255, 255, 0.82)",
                                marginTop: "6px",
                                whiteSpace: "nowrap"
                              },
                              children: "0-100 km/h"
                            })
                          ]
                        }),

                        /* Divider 2 */
                        T.jsx("div", {
                          className: "screenshot-stat-divider",
                          style: {
                            width: "1.5px",
                            height: "52px",
                            backgroundColor: "rgba(255, 255, 255, 0.35)",
                            margin: "0 18px",
                            flexShrink: 0
                          }
                        }),

                        /* Stat 3: Max Speed */
                        T.jsxs("div", {
                          style: { paddingLeft: "4px" },
                          children: [
                            T.jsx("div", {
                              className: "screenshot-stat-num",
                              style: {
                                fontSize: "36px",
                                fontWeight: "800",
                                color: "#FFFFFF",
                                letterSpacing: "-0.02em",
                                lineHeight: 1
                              },
                              children: carPerformanceStats.speed
                            }),
                            T.jsx("div", {
                              className: "screenshot-stat-label",
                              style: {
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "rgba(255, 255, 255, 0.82)",
                                marginTop: "6px",
                                whiteSpace: "nowrap"
                              },
                              children: "Max Speed"
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                /* Car Foreground Image */
                T.jsx("div", {
                  className: "w-full lg:w-[680px] xl:w-[780px] flex items-center justify-center -mt-6 lg:-mt-0 lg:-ml-12 z-20 cursor-pointer",
                  onClick: () => setLightboxImg(rawImages[0]),
                  title: "Click to Enlarge " + fullName,
                  children: T.jsx("img", {
                    src: rawImages[0],
                    alt: fullName,
                    className: "max-h-[340px] sm:max-h-[440px] lg:max-h-[500px] w-auto object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]",
                    style: { transform: "none" }
                  })
                })
              ]
            })
          }),

          `;

js = js.substring(0, startIdx) + visibleHeaderAndHero + js.substring(endIdx);

// Validate JS syntax
try {
  new vm.Script(js);
  console.log("Syntax validation PASSED!");
} catch (e) {
  console.error("Syntax validation FAILED:", e);
  process.exit(1);
}

fs.writeFileSync('assets/index-BIZlWqQ7.js', js);
console.log("Successfully updated assets/index-BIZlWqQ7.js with visible inline styles!");
