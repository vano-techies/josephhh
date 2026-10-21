const fs = require('fs');
const vm = require('vm');

console.log("Adding 'view full review here' next to the YouTube icon...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const targetStart = '/* YouTube Icon Button Only (No text as requested) */';
const targetEnd = '/* Viewing Arena with Image Chevron Controls & Thumbnail Scroll Buttons */';

const startIdx = js.indexOf(targetStart);
const endIdx = js.indexOf(targetEnd, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find targets:", startIdx, endIdx);
  process.exit(1);
}

const replacement = `/* YouTube Video Review Button with Icon and 'view full review here' */
          T.jsx("div", {
            className: "max-w-4xl mx-auto px-4 mb-6 flex justify-center",
            children: T.jsxs("a", {
              href: youtubeUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#FF0000] hover:bg-[#CC0000] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group",
              style: {
                backgroundColor: "#FF0000",
                color: "#FFFFFF",
                boxShadow: "0 6px 22px rgba(255, 0, 0, 0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 22px",
                borderRadius: "9999px",
                textDecoration: "none"
              },
              children: [
                T.jsx("svg", {
                  viewBox: "0 0 24 24",
                  width: 24,
                  height: 24,
                  fill: "currentColor",
                  style: { flexShrink: 0, display: "block" },
                  children: T.jsx("path", {
                    d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  })
                }),
                T.jsx("span", {
                  style: {
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "0.02em",
                    textTransform: "none",
                    whiteSpace: "nowrap"
                  },
                  children: "view full review here"
                })
              ]
            })
          }),

          `;

js = js.substring(0, startIdx) + replacement + js.substring(endIdx);
console.log("Successfully added 'view full review here' next to YouTube icon!");

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
