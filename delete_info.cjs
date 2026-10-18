const fs = require('fs');
const vm = require('vm');

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const targetStart = `T.jsx("h3", { className: "text-2xl font-serif text-white tracking-wide", children: "Featured Vehicles Studio" }),`;
const targetEnd = `/* Top Action Buttons */`;

const startIdx = js.indexOf(targetStart);
if (startIdx === -1) {
  console.error("Could not find targetStart");
  process.exit(1);
}

const endIdx = js.indexOf(targetEnd, startIdx);
if (endIdx === -1) {
  console.error("Could not find targetEnd");
  process.exit(1);
}

const oldBlock = js.substring(startIdx, endIdx);
console.log("Found old block:", oldBlock);

const newBlock = `T.jsx("h3", { className: "text-2xl font-serif text-white tracking-wide", children: "Featured Vehicles Studio" }),
                  hasUnsavedChanges && T.jsx("span", {
                    className: "px-2.5 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-mono font-extrabold uppercase rounded-full border border-amber-500/40 animate-pulse",
                    children: "● Unsaved Changes"
                  })
                ]
              })
            ]
          }),
          `;

js = js.substring(0, startIdx) + newBlock + js.substring(endIdx);

// Validate JS syntax
try {
  new vm.Script(js);
  console.log("Syntax validation PASSED!");
} catch (e) {
  console.error("Syntax validation FAILED:", e);
  process.exit(1);
}

fs.writeFileSync('assets/index-BIZlWqQ7.js', js);
console.log("Successfully updated assets/index-BIZlWqQ7.js!");
