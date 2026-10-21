const fs = require('fs');
const vm = require('vm');

console.log("Reducing logo in FLPage navbar to normal size...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const targetStr = `children: [
                T.jsx("img", {
                  src: "/logo.png",
                  alt: "Mr Joseph",
                  className: "h-11 sm:h-13 object-contain brightness-0 invert"
                }),
                T.jsxs("div", {
                  className: "flex flex-col",
                  children: [
                    T.jsx("span", {
                      className: "text-lg sm:text-xl font-extrabold tracking-wider text-white uppercase leading-tight font-serif",
                      children: "Mr Joseph"
                    }),
                    T.jsx("span", {
                      className: "text-[10px] font-mono tracking-[0.2em] text-[#C59B51] uppercase font-bold",
                      children: "PREMIUM CARS"
                    })
                  ]
                })
              ]`;

const replacement = `children: [
                T.jsx("img", {
                  src: "/logo.png",
                  alt: "Mr Joseph",
                  className: "h-8 sm:h-9 w-auto object-contain brightness-0 invert"
                }),
                T.jsxs("div", {
                  className: "flex flex-col",
                  children: [
                    T.jsx("span", {
                      className: "text-sm sm:text-base font-extrabold tracking-wider text-white uppercase leading-tight font-serif",
                      children: "Mr Joseph"
                    }),
                    T.jsx("span", {
                      className: "text-[9px] font-mono tracking-[0.18em] text-[#C59B51] uppercase font-bold",
                      children: "PREMIUM CARS"
                    })
                  ]
                })
              ]`;

if (!js.includes(targetStr)) {
  console.error("Could not find targetStr!");
  process.exit(1);
}

js = js.replace(targetStr, replacement);
console.log("Replaced logo size successfully!");

// Also update navbar height from h-20 to h-16 sm:h-18 for normal proportions
const h20Target = 'px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between';
const h16Replacement = 'px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between';
if (js.includes(h20Target)) {
  js = js.replace(h20Target, h16Replacement);
  console.log("Updated navbar height to h-16 sm:h-18!");
}

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
