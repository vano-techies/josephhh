const fs = require('fs');
const vm = require('vm');

console.log("Completely removing logo from FLPage navbar...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const startTarget = "/* Brand Logo */";
const endTarget = "/* Center Navigation Menu Lin";

const startIdx = js.indexOf(startTarget);
const endIdx = js.indexOf(endTarget, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find brand logo boundaries:", startIdx, endIdx);
  process.exit(1);
}

const replacement = `/* Back Navigation Button (Logo completely removed as requested) */
            T.jsxs("button", {
              type: "button",
              onClick: backFn,
              className: "flex items-center gap-2 text-white/90 hover:text-white text-sm font-semibold tracking-wide transition-colors cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/15",
              children: [
                T.jsx("span", { className: "text-base leading-none", children: "←" }),
                T.jsx("span", { children: "Back to Showroom" })
              ]
            }),

            `;

js = js.substring(0, startIdx) + replacement + js.substring(endIdx);
console.log("Successfully replaced logo block with Back to Showroom button!");

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
