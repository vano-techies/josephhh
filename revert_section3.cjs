const fs = require('fs');
const vm = require('vm');

console.log("Reverting Section 3 back to exactly how it was...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

// 1. Revert Section 3
const startTarget = "/* SECTION 3: SPECIFICATIONS";
const endTarget = "/* SECTION 4: FEATURES & EQUIPMENT";

const startIdx = js.indexOf(startTarget);
const endIdx = js.indexOf(endTarget, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find Section 3 coordinates:", startIdx, endIdx);
  process.exit(1);
}

const originalSection3 = `/* SECTION 3: SPECIFICATIONS & VERIFIED PROVENANCE */      T.jsx("section", {        id: "specifications-dossier",        className: "bg-[#F8F9FA] py-14 sm:py-16 border-0",        children: T.jsx("div", {          className: "max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8",          children: T.jsxs("div", {            className: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch",            children: [              /* Left Column: Another High-Resolution Image of the Car */              T.jsxs("div", {                onClick: () => setLightboxImg(rawImages[2] || rawImages[0]),                className: "lg:col-span-5 group relative rounded-3xl overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all cursor-pointer bg-gray-100 flex flex-col min-h-[380px] sm:min-h-[440px] lg:h-full",                children: [                  T.jsx("img", {                    src: rawImages[2] || rawImages[0],                    alt: fullName + " Technical Profile",                    className: "w-full h-full object-cover transition-transform duration-700 transition-opacity duration-300"                  }),                  T.jsx("div", {                    className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5",                    children: T.jsxs("div", {                      className: "flex items-center justify-between w-full text-white text-xs font-bold",                      children: [                        T.jsx("span", { children: fullName + " Technical Profile" }),                        T.jsx("span", { className: "px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] uppercase font-mono", children: "Zoom" })                      ]                    })                  })                ]              }),              /* Right Column: Technical Dossier & Provenance Heading + Specifications */              T.jsxs("div", {                className: "lg:col-span-7 flex flex-col justify-start space-y-4",                children: [                  /* Header */                  T.jsxs("div", {                    className: "flex items-center gap-3",                    children: [                      T.jsx("div", { className: "w-1.5 h-6 bg-[#C59B51] rounded-xs" }),                      T.jsx("h2", {                        className: "text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight uppercase",                        children: "Technical Dossier & Provenance"                      })                    ]                  }),                  /* Specifications Grid */                  T.jsx("div", {                    className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5",                    children: [                      { label: "Make & Model", val: fullName },                      { label: "Production Year", val: car.year || "2021" },                      { label: "Body Classification", val: bodyType },                      { label: "Fuel Type", val: car.fuel || "Diesel" },                      { label: "Transmission", val: car.transmission || "Automatic" },                      { label: "Drivetrain", val: (car.specifications && car.specifications.drivetrain) || "All-Wheel Drive (AWD / 4WD)" },                      { label: "Exterior Paint", val: (car.specifications && car.specifications.exteriorPaint) || "Metallic Factory Finish" },                      { label: "Interior Trim", val: (car.specifications && car.specifications.interiorTrim) || "Full Premium Nappa Leather" },                      { label: "Import Status", val: (car.specifications && car.specifications.importStatus) || "Duty & Clearance Settled" }                    ].map((item, idx) => T.jsxs("div", {                      key: idx,                      className: "bg-white p-4.5 rounded-2xl border-0 flex flex-col justify-between shadow-xs " + (idx === 8 ? "sm:col-span-2" : ""),                      children: [                        T.jsx("span", { className: "text-xs font-mono uppercase font-bold text-gray-400 mb-1", children: item.label }),                        T.jsx("span", { className: "text-sm sm:text-base font-extrabold text-gray-900 leading-snug", children: item.val })                      ]                    }))                  }),                  /* Extra Provenance Information Note if provided */                  ((car.specifications && car.specifications.extraInfo) || car.extraInfo || car.description) && T.jsxs("div", {                    className: "p-4.5 bg-white rounded-2xl border-0 shadow-xs space-y-1",                    children: [                      T.jsx("span", { className: "text-xs font-mono uppercase font-bold text-[#C59B51] block", children: "Executive Provenance & Special Highlights" }),                      T.jsx("p", { className: "text-xs sm:text-sm text-gray-700 font-medium leading-relaxed", children: (car.specifications && car.specifications.extraInfo) || car.extraInfo || car.description })                    ]                  })                ]              })            ]          })        })      }),      `;

js = js.substring(0, startIdx) + originalSection3 + js.substring(endIdx);
console.log("Successfully reverted Section 3 to original!");

// 2. Revert Admin Studio hint
const modifiedHint = "Renders on the right-hand side of the Featured Vehicle page";
const originalHint = "Renders in Section 3 Technical Dossier";
if (js.includes(modifiedHint)) {
  js = js.replace(modifiedHint, originalHint);
  console.log("Successfully reverted admin studio hint!");
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
console.log("Successfully wrote reverted assets/index-BIZlWqQ7.js!");
