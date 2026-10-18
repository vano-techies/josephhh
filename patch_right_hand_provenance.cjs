const fs = require('fs');
const vm = require('vm');

console.log("Patching featured vehicle to position Executive Provenance & Special Highlights on the right-hand side...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

// =========================================================================
// 1. REVISE SECTION 3 OF FLPage
// Left Side: Technical Dossier & Specifications Grid + Car Profile Image
// Right Side: Dedicated Executive Provenance & Special Highlights (Extra Information)
// =========================================================================
const startTarget = "/* SECTION 3: SPECIFICATIONS & VERIFIED PROVENANCE */";
const endTarget = "/* SECTION 4: FEATURES & EQUIPMENT";

const startIdx = js.indexOf(startTarget);
const endIdx = js.indexOf(endTarget, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find Section 3 coordinates:", startIdx, endIdx);
  process.exit(1);
}

const newSection3 = `/* SECTION 3: SPECIFICATIONS (LEFT) & EXECUTIVE PROVENANCE (RIGHT) */
      T.jsx("section", {
        id: "specifications-dossier",
        className: "bg-[#F8F9FA] py-14 sm:py-16 border-0",
        children: T.jsx("div", {
          className: "max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8",
          children: T.jsxs("div", {
            className: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start",
            children: [
              /* LEFT-HAND SIDE: TECHNICAL DOSSIER & SPECIFICATIONS GRID (7 Cols) */
              T.jsxs("div", {
                className: "lg:col-span-7 flex flex-col justify-start space-y-6",
                children: [
                  /* Section Header */
                  T.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      T.jsx("div", { className: "w-1.5 h-6 bg-[#C59B51] rounded-xs" }),
                      T.jsx("h2", {
                        className: "text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight uppercase",
                        children: "Technical Dossier & Specifications"
                      })
                    ]
                  }),

                  /* Specifications Grid (9 Cards) */
                  T.jsx("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-3.5",
                    children: [
                      { label: "Make & Model", val: fullName },
                      { label: "Production Year", val: car.year || "2021" },
                      { label: "Body Classification", val: bodyType },
                      { label: "Fuel Type", val: car.fuel || "Diesel" },
                      { label: "Transmission", val: car.transmission || "Automatic" },
                      { label: "Drivetrain", val: (car.specifications && car.specifications.drivetrain) || "All-Wheel Drive (AWD / 4WD)" },
                      { label: "Exterior Paint", val: (car.specifications && car.specifications.exteriorPaint) || "Metallic Factory Finish" },
                      { label: "Interior Trim", val: (car.specifications && car.specifications.interiorTrim) || "Full Premium Nappa Leather" },
                      { label: "Import Status", val: (car.specifications && car.specifications.importStatus) || "Duty & Clearance Settled" }
                    ].map((item, idx) => T.jsxs("div", {
                      key: idx,
                      className: "bg-white p-4.5 rounded-2xl border border-gray-100 flex flex-col justify-between shadow-xs " + (idx === 8 ? "sm:col-span-2" : ""),
                      children: [
                        T.jsx("span", { className: "text-xs font-mono uppercase font-bold text-gray-400 mb-1", children: item.label }),
                        T.jsx("span", { className: "text-sm sm:text-base font-extrabold text-gray-900 leading-snug", children: item.val })
                      ]
                    }))
                  }),

                  /* High-Resolution Vehicle Profile Card */
                  T.jsxs("div", {
                    onClick: () => setLightboxImg(rawImages[2] || rawImages[0]),
                    className: "group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer bg-gray-100 h-56 sm:h-64",
                    children: [
                      T.jsx("img", {
                        src: rawImages[2] || rawImages[0],
                        alt: fullName + " Profile Perspective",
                        className: "w-full h-full object-cover transition-opacity duration-300"
                      }),
                      T.jsx("div", {
                        className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4",
                        children: T.jsxs("div", {
                          className: "flex items-center justify-between w-full text-white text-xs font-bold",
                          children: [
                            T.jsx("span", { children: fullName + " Technical Profile" }),
                            T.jsx("span", { className: "px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] uppercase font-mono", children: "🔍 Click to Enlarge" })
                          ]
                        })
                      })
                    ]
                  })
                ]
              }),

              /* RIGHT-HAND SIDE: EXECUTIVE PROVENANCE & SPECIAL HIGHLIGHTS (EXTRA INFORMATION) (5 Cols) */
              T.jsxs("div", {
                className: "lg:col-span-5 flex flex-col justify-start space-y-6 lg:sticky lg:top-24",
                children: [
                  /* Header */
                  T.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      T.jsx("div", { className: "w-1.5 h-6 bg-[#C59B51] rounded-xs" }),
                      T.jsx("h2", {
                        className: "text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight uppercase",
                        children: "Executive Provenance"
                      })
                    ]
                  }),

                  /* Dedicated Executive Provenance & Highlights Card */
                  T.jsxs("div", {
                    className: "bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/60 shadow-sm space-y-5 relative overflow-hidden",
                    children: [
                      /* Top Verified Ribbon */
                      T.jsxs("div", {
                        className: "flex items-center justify-between border-b border-gray-100 pb-4",
                        children: [
                          T.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              T.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" }),
                              T.jsx("span", {
                                className: "text-xs font-mono uppercase font-bold tracking-wider text-gray-700",
                                children: "Verified Provenance"
                              })
                            ]
                          }),
                          T.jsx("span", {
                            className: "px-2.5 py-1 bg-amber-50 text-[#C59B51] text-[10px] font-mono font-extrabold uppercase rounded-full border border-amber-200",
                            children: "Special Highlights"
                          })
                        ]
                      }),

                      /* Heading Title */
                      T.jsxs("div", {
                        className: "space-y-1",
                        children: [
                          T.jsx("h3", {
                            className: "text-lg sm:text-xl font-serif text-gray-900 font-bold tracking-tight",
                            children: "Executive Provenance & Special Highlights"
                          }),
                          T.jsx("span", {
                            className: "text-[11px] font-mono text-[#C59B51] uppercase font-bold tracking-wider block",
                            children: "Official Handpicked Dealership Notes"
                          })
                        ]
                      }),

                      /* The Additional Information Body (From Admin Dash) */
                      T.jsxs("div", {
                        className: "p-4.5 bg-amber-50/40 rounded-2xl border-l-4 border-[#C59B51] space-y-2",
                        children: [
                          T.jsx("p", {
                            className: "text-sm sm:text-base text-gray-800 font-medium leading-relaxed whitespace-pre-line",
                            children: (car.specifications && car.specifications.extraInfo) || car.extraInfo || car.description || "Certified handpicked prestige import. Full official documentation, pristine mechanical inspection, and executive provenance verified."
                          })
                        ]
                      }),

                      /* Trust & Provenance Seals */
                      T.jsxs("div", {
                        className: "space-y-2.5 pt-2 border-t border-gray-100",
                        children: [
                          [
                            "Direct Executive Import — Handpicked Quality",
                            "Full Customs Duty & Kenya Registration Settled",
                            "Complete Official Maintenance History",
                            "Pristine Physical Inspection & Accident-Free"
                          ].map((sealText, sIdx) => T.jsxs("div", {
                            key: sIdx,
                            className: "flex items-center gap-2.5 text-xs font-semibold text-gray-700",
                            children: [
                              T.jsx("span", {
                                className: "w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0",
                                children: "✓"
                              }),
                              T.jsx("span", { children: sealText })
                            ]
                          }))
                        ]
                      }),

                      /* WhatsApp Concierge Action Button */
                      T.jsxs("a", {
                        href: whatsappCarUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "w-full py-3.5 px-4 bg-black hover:bg-[#C59B51] hover:text-black text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-center mt-2 group",
                        children: [
                          T.jsx("span", { children: "Inquire About This Provenance" }),
                          T.jsx("span", { className: "text-sm font-bold transition-transform group-hover:translate-x-1", children: "→" })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          })
        })
      }),
      `;

js = js.substring(0, startIdx) + newSection3 + js.substring(endIdx);
console.log("Successfully updated Section 3 with Executive Provenance on the right-hand side!");

// =========================================================================
// 2. ENSURE persistChanges ALSO PERSISTS extraInfo IN REST API FIELDS
// =========================================================================
const restFieldTarget = 'description: { stringValue: car.description },';
if (js.includes(restFieldTarget)) {
  const restFieldReplacement = 'description: { stringValue: car.description },          extraInfo: { stringValue: String((car.specifications && car.specifications.extraInfo) || car.description || "") },';
  js = js.replace(restFieldTarget, restFieldReplacement);
  console.log("Enhanced REST API fields in persistChanges to save extraInfo!");
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
