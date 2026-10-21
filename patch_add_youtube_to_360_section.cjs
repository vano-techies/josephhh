const fs = require('fs');
const vm = require('vm');

console.log("Adding YouTube full review button to 360 DEGREE CAR VIEW section...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const targetStr = `              T.jsx("p", {
                className: "text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed",
                children: "Experience our 360-degree view feature and get a closer look at every aspect of your dream car"
              })
            ]
          }),`;

const replacement = `              T.jsx("p", {
                className: "text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed",
                children: "Experience our 360-degree view feature and get a closer look at every aspect of your dream car"
              }),
              /* YouTube Full Car Video Review Button directly in 360 section header */
              T.jsx("div", {
                className: "pt-3 flex justify-center",
                children: T.jsxs("a", {
                  href: youtubeUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-103 cursor-pointer",
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
              })
            ]
          }),`;

if (!js.includes(targetStr)) {
  console.error("Could not find targetStr!");
  process.exit(1);
}

js = js.replace(targetStr, replacement);
console.log("Successfully added YouTube review button to 360 section!");

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
