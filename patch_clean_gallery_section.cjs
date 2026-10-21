const fs = require('fs');
const vm = require('vm');

console.log("Replacing 360 section with clean thumbnail scroll gallery and YouTube button...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const startTarget = 'id: "360-view-section",';
const endTarget = 'id: "specifications-section",';

const startIdx = js.indexOf(startTarget);
const endIdx = js.indexOf(endTarget, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find boundaries:", startIdx, endIdx);
  process.exit(1);
}

// Find the beginning of the section: T.jsxs("section", { id: "360-view-section"
const sectionTagStart = js.lastIndexOf('T.jsxs("section", {', startIdx);
const sectionTagEnd = js.lastIndexOf('T.jsx("section", {', endIdx);

const cleanSection = `T.jsxs("section", {
        id: "360-view-section",
        className: "py-12 sm:py-16 bg-white border-t border-gray-100",
        children: [
          /* YouTube Full Car Video Review Button (Info text deleted as requested) */
          T.jsx("div", {
            className: "max-w-4xl mx-auto px-4 mb-8 flex justify-center",
            children: T.jsxs("a", {
              href: youtubeUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-103 cursor-pointer",
              style: {
                backgroundColor: "#FF0000",
                color: "#FFFFFF",
                boxShadow: "0 6px 24px rgba(255, 0, 0, 0.4)",
                textDecoration: "none"
              },
              children: [
                T.jsx("svg", {
                  viewBox: "0 0 24 24",
                  width: 22,
                  height: 22,
                  fill: "currentColor",
                  style: { flexShrink: 0 },
                  children: T.jsx("path", {
                    d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  })
                }),
                T.jsx("span", { children: "Watch Full Video Review on YouTube" })
              ]
            })
          }),

          /* Viewing Arena with Image Chevron Controls & Thumbnail Scroll Buttons */
          T.jsx("div", {
            className: "max-w-5xl mx-auto px-4 sm:px-6",
            children: T.jsxs("div", {
              className: "bg-[#F7F8FA] rounded-3xl p-6 sm:p-10 relative border border-gray-200/80 shadow-inner flex flex-col items-center justify-center min-h-[440px] sm:min-h-[500px] select-none",
              children: [
                /* Left Scroll Button on Main Image */
                T.jsx("button", {
                  type: "button",
                  onClick: () => setAngleIdx(prev => (prev - 1 + rawImages.length) % rawImages.length),
                  className: "absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 hover:bg-white text-gray-900 shadow-xl flex items-center justify-center text-2xl sm:text-3xl font-bold cursor-pointer transition-all hover:scale-108 border border-gray-200 z-20",
                  style: { boxShadow: "0 6px 20px rgba(0,0,0,0.15)" },
                  "aria-label": "Previous image",
                  children: "‹"
                }),

                /* Main Active Image */
                T.jsx("div", {
                  className: "w-full flex items-center justify-center cursor-pointer mb-6",
                  onClick: () => setLightboxImg(rawImages[angleIdx % rawImages.length]),
                  title: "Click to Enlarge " + fullName,
                  children: T.jsx("img", {
                    src: rawImages[angleIdx % rawImages.length],
                    alt: fullName + " Angle " + ((angleIdx % rawImages.length) + 1),
                    className: "max-h-[340px] sm:max-h-[400px] w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-opacity duration-200",
                    style: { transform: "none" }
                  })
                }),

                /* Right Scroll Button on Main Image */
                T.jsx("button", {
                  type: "button",
                  onClick: () => setAngleIdx(prev => (prev + 1) % rawImages.length),
                  className: "absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 hover:bg-white text-gray-900 shadow-xl flex items-center justify-center text-2xl sm:text-3xl font-bold cursor-pointer transition-all hover:scale-108 border border-gray-200 z-20",
                  style: { boxShadow: "0 6px 20px rgba(0,0,0,0.15)" },
                  "aria-label": "Next image",
                  children: "›"
                }),

                /* Thumbnail Scroll Button Row */
                T.jsxs("div", {
                  className: "w-full max-w-2xl mx-auto mt-2 flex items-center justify-center gap-2 sm:gap-3 px-2 z-20",
                  children: [
                    /* Left thumbnail arrow */
                    T.jsx("button", {
                      type: "button",
                      onClick: () => setAngleIdx(prev => (prev - 1 + rawImages.length) % rawImages.length),
                      className: "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-gray-100 text-gray-800 shadow-md flex items-center justify-center text-lg font-bold border border-gray-200 cursor-pointer shrink-0 transition-transform active:scale-95",
                      "aria-label": "Previous thumbnail",
                      children: "‹"
                    }),

                    /* Horizontal scrollable thumbnails */
                    T.jsx("div", {
                      className: "flex items-center gap-2.5 sm:gap-3 overflow-x-auto py-2 px-1",
                      style: { scrollBehavior: "smooth" },
                      children: rawImages.map((imgUrl, tIdx) => {
                        const isActive = tIdx === (angleIdx % rawImages.length);
                        return T.jsx("button", {
                          key: tIdx,
                          type: "button",
                          onClick: () => setAngleIdx(tIdx),
                          className: "relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer shrink-0 " + (
                            isActive
                              ? "ring-3 ring-[#C59B51] shadow-lg scale-105 opacity-100 border-2 border-white"
                              : "opacity-60 hover:opacity-100 hover:scale-102 border border-gray-200"
                          ),
                          style: {
                            width: "72px",
                            height: "52px",
                            backgroundColor: "#FFFFFF"
                          },
                          "aria-label": "View angle " + (tIdx + 1),
                          children: T.jsx("img", {
                            src: imgUrl,
                            alt: fullName + " Thumb " + (tIdx + 1),
                            className: "w-full h-full object-cover"
                          })
                        });
                      })
                    }),

                    /* Right thumbnail arrow */
                    T.jsx("button", {
                      type: "button",
                      onClick: () => setAngleIdx(prev => (prev + 1) % rawImages.length),
                      className: "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-gray-100 text-gray-800 shadow-md flex items-center justify-center text-lg font-bold border border-gray-200 cursor-pointer shrink-0 transition-transform active:scale-95",
                      "aria-label": "Next thumbnail",
                      children: "›"
                    })
                  ]
                })
              ]
            })
          })
        ]
      }),

      /* ========================================================================= */
      /* 6. TECHNICAL DOSSIER & PROVENANCE SPECIFICATIONS SECTION */
      /* ========================================================================= */
      `;

js = js.substring(0, sectionTagStart) + cleanSection + js.substring(sectionTagEnd);

// Validate JS syntax
try {
  new vm.Script(js);
  console.log("Syntax validation PASSED!");
} catch (e) {
  console.error("Syntax validation FAILED:", e);
  process.exit(1);
}

fs.writeFileSync('assets/index-BIZlWqQ7.js', js);
console.log("Successfully wrote updated assets/index-BIZlWqQ7.js!");
