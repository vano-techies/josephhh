const fs = require('fs');
const vm = require('vm');

console.log("Patching featured vehicle hero section to unzoom image...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const targetStart = '/* SECTION 1: HERO SECTION';
const targetEnd = '/* Vehicle Title Bar */';

const startIdx = js.indexOf(targetStart);
const endIdx = js.indexOf(targetEnd, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find hero section slice:", startIdx, endIdx);
  process.exit(1);
}

const replacement = `/* SECTION 1: HERO SECTION - CRISP UNZOOMED VEHICLE DISPLAY */      T.jsxs("section", {        className: "featured-hero-container relative w-full overflow-hidden flex items-center justify-center bg-[#0A0A0F]",        style: { cursor: "pointer", height: "58vh", minHeight: "420px", maxHeight: "640px", width: "100%", backgroundColor: "#0A0A0F" },        onClick: () => setLightboxImg(heroImage),        children: [          T.jsx("div", {            className: "absolute inset-0 w-full h-full pointer-events-none opacity-15 filter blur-3xl scale-110",            style: { backgroundImage: "url(" + heroImage + ")", backgroundPosition: "center", backgroundSize: "cover" }          }),          T.jsx("img", {            src: heroImage,            alt: fullName,            className: "featured-hero-clean-img relative z-10 w-full h-full object-contain p-2 sm:p-4 select-none",            style: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain", objectPosition: "center" }          })        ]      }),      `;

js = js.substring(0, startIdx) + replacement + js.substring(endIdx);

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
