const fs = require('fs');
const vm = require('vm');

console.log("Deleting specified navigation items and hero description text from FLPage...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const startTarget = '/* 1. TOP NAVBAR (DARK SLATE NAVY MATCHING SCREENSHOT) */';
const endTarget = '/* Main Car Display Stage with Asymmetrical Left Podium Card */';

const startIdx = js.indexOf(startTarget);
const endIdx = js.indexOf(endTarget, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find targets:", startIdx, endIdx);
  process.exit(1);
}

const cleanHeaderAndHeroStart = `/* 1. TOP NAVBAR (CLEAN MINIMAL BACK NAVIGATION) */
      /* ========================================================================= */
      T.jsx("header", {
        className: "w-full bg-[#162330] border-b border-white/10 sticky top-0 z-50 text-white shadow-md",
        children: T.jsxs("div", {
          className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between",
          children: [
            T.jsxs("button", {
              type: "button",
              onClick: backFn,
              className: "flex items-center gap-2 text-white/90 hover:text-white text-sm font-semibold tracking-wide transition-colors cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/15",
              children: [
                T.jsx("span", { className: "text-base leading-none", children: "←" }),
                T.jsx("span", { children: "Back to Showroom" })
              ]
            }),
            T.jsx("a", {
              href: whatsappCarUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center px-5 py-2 rounded-full border border-white/30 hover:border-white text-xs font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-[#162330] transition-all",
              children: "Inquire / WhatsApp"
            })
          ]
        })
      }),

      /* ========================================================================= */
      /* 2. HERO SHOWCASE SECTION (SCREENSHOT 532) */
      /* ========================================================================= */
      T.jsxs("section", {
        className: "relative w-full bg-[#162330] text-white overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-24 select-none",
        children: [
          `;

js = js.substring(0, startIdx) + cleanHeaderAndHeroStart + js.substring(endIdx);
console.log("Replaced header and removed hero description paragraph!");

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
