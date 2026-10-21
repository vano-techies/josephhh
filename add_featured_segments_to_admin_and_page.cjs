const fs = require('fs');
const vm = require('vm');

console.log("Adding segments for Torque, 0-100 km/h, Max Speed, DESIGN, and PERFORMANCE to Admin Dashboard...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

// =========================================================================
// 1. UPDATE FLPage to dynamically render the custom segments
// =========================================================================

// A. Car Performance Stats in FLPage
const oldCarPerfCalc = `  // Performance stats accurately mapped per vehicle (matching Screenshot 536)
  const carPerformanceStats = Fe.useMemo(() => {
    const name = (((currentCar.make || "") + " " + (currentCar.model || "")).toLowerCase());
    if (name.includes("g350") || name.includes("g-wagon") || name.includes("g 350") || name.includes("g350d")) {
      return { torque: "600 nm", accel: "7.4s", speed: "199km/h" };
    }
    if (name.includes("cayenne") || name.includes("porsche")) {
      return { torque: "450 nm", accel: "5.9s", speed: "245km/h" };
    }
    if (name.includes("prado") || name.includes("j250") || name.includes("land cruiser")) {
      return { torque: "500 nm", accel: "8.2s", speed: "185km/h" };
    }
    if (name.includes("glc")) {
      return { torque: "370 nm", accel: "6.2s", speed: "240km/h" };
    }
    if (name.includes("lx600") || name.includes("lx 600")) {
      return { torque: "650 nm", accel: "6.9s", speed: "210km/h" };
    }
    if (name.includes("s 500") || name.includes("s500")) {
      return { torque: "520 nm", accel: "4.9s", speed: "250km/h" };
    }
    if (name.includes("gle")) {
      return { torque: "500 nm", accel: "5.7s", speed: "250km/h" };
    }
    if (name.includes("x6")) {
      return { torque: "650 nm", accel: "5.8s", speed: "240km/h" };
    }
    return { torque: "520 nm", accel: "4.4s", speed: "290km/h" };
  }, [currentCar]);`;

const newCarPerfCalc = `  // Performance stats: prioritize admin dashboard custom segments, fallback to vehicle defaults
  const carPerformanceStats = Fe.useMemo(() => {
    if (currentCar) {
      const t = currentCar.torque || (currentCar.specifications && currentCar.specifications.torque);
      const a = currentCar.acceleration || (currentCar.specifications && currentCar.specifications.acceleration);
      const s = currentCar.topSpeed || (currentCar.specifications && currentCar.specifications.topSpeed);
      if (t || a || s) {
        return {
          torque: t || "600 nm",
          accel: a || "7.4s",
          speed: s || "199km/h"
        };
      }
    }
    const name = (((currentCar.make || "") + " " + (currentCar.model || "")).toLowerCase());
    if (name.includes("g350") || name.includes("g-wagon") || name.includes("g 350") || name.includes("g350d")) {
      return { torque: "600 nm", accel: "7.4s", speed: "199km/h" };
    }
    if (name.includes("cayenne") || name.includes("porsche")) {
      return { torque: "450 nm", accel: "5.9s", speed: "245km/h" };
    }
    if (name.includes("prado") || name.includes("j250") || name.includes("land cruiser")) {
      return { torque: "500 nm", accel: "8.2s", speed: "185km/h" };
    }
    if (name.includes("glc")) {
      return { torque: "370 nm", accel: "6.2s", speed: "240km/h" };
    }
    if (name.includes("lx600") || name.includes("lx 600")) {
      return { torque: "650 nm", accel: "6.9s", speed: "210km/h" };
    }
    if (name.includes("s 500") || name.includes("s500")) {
      return { torque: "520 nm", accel: "4.9s", speed: "250km/h" };
    }
    if (name.includes("gle")) {
      return { torque: "500 nm", accel: "5.7s", speed: "250km/h" };
    }
    if (name.includes("x6")) {
      return { torque: "650 nm", accel: "5.8s", speed: "240km/h" };
    }
    return { torque: "520 nm", accel: "4.4s", speed: "290km/h" };
  }, [currentCar]);

  // Dynamic Design and Performance segment copy from Admin Dashboard
  const designLabel = (currentCar && currentCar.designLabel) || "DESIGN";
  const designTitle = (currentCar && currentCar.designTitle) || "Design and Aerodynamics";
  const designDesc = (currentCar && currentCar.designDescription) || ("Every surface of the " + fullName + " has been sculpted to harmonize aesthetic grandeur with aerodynamic discipline. From its athletic stance and signature grille to the precision-engineered air channels, the design reduces drag while elevating road presence to its highest expression.");

  const perfLabel = (currentCar && currentCar.performanceLabel) || "PERFORMANCE";
  const perfTitle = (currentCar && currentCar.performanceTitle) || "More Powerful, Lighter, Faster";
  const perfDesc = (currentCar && currentCar.performanceDescription) || ("Underneath its bespoke exterior lies an uncompromised performance powertrain. Responsive transmission calibration pairs with intelligent all-wheel-drive traction to unleash effortless power delivery, pinpoint cornering poise, and high-speed stability across Kenyan highways and rugged escapes.");`;

if (js.includes(oldCarPerfCalc)) {
  js = js.replace(oldCarPerfCalc, newCarPerfCalc);
  console.log("Updated FLPage carPerformanceStats and segment variables!");
} else {
  console.warn("Could not find exact oldCarPerfCalc in JS!");
}

// B. Wire Design & Aerodynamics section in FLPage
const oldDesignRightCol = `              /* Right Column: Design and Aerodynamics Copy */
              T.jsxs("div", {
                className: "lg:col-span-5 space-y-4",
                children: [
                  T.jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      T.jsx("span", {
                        className: "text-xs font-bold tracking-[0.2em] text-gray-800 uppercase block",
                        children: "DESIGN"
                      }),
                      T.jsx("div", { className: "w-9 h-[2.5px] bg-black" })
                    ]
                  }),
                  T.jsx("h2", {
                    className: "text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight",
                    children: "Design and Aerodynamics"
                  }),
                  T.jsx("p", {
                    className: "text-sm sm:text-base text-gray-600 leading-relaxed font-normal pt-2",
                    children: "Every surface of the " + fullName + " has been sculpted to harmonize aesthetic grandeur with aerodynamic discipline. From its athletic stance and signature grille to the precision-engineered air channels, the design reduces drag while elevating road presence to its highest expression."
                  })
                ]
              })`;

const newDesignRightCol = `              /* Right Column: Dynamic Design and Aerodynamics Copy */
              T.jsxs("div", {
                className: "lg:col-span-5 space-y-4",
                children: [
                  T.jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      T.jsx("span", {
                        className: "text-xs font-bold tracking-[0.2em] text-gray-800 uppercase block",
                        children: designLabel
                      }),
                      T.jsx("div", { className: "w-9 h-[2.5px] bg-black" })
                    ]
                  }),
                  T.jsx("h2", {
                    className: "text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight",
                    children: designTitle
                  }),
                  T.jsx("p", {
                    className: "text-sm sm:text-base text-gray-600 leading-relaxed font-normal pt-2 whitespace-pre-line",
                    children: designDesc
                  })
                ]
              })`;

if (js.includes(oldDesignRightCol)) {
  js = js.replace(oldDesignRightCol, newDesignRightCol);
  console.log("Updated Design section to use dynamic admin segment!");
}

// C. Wire Performance section in FLPage
const oldPerfLeftCol = `              /* Left Column: Performance Copy */
              T.jsxs("div", {
                className: "lg:col-span-5 space-y-4 order-2 lg:order-1",
                children: [
                  T.jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      T.jsx("span", {
                        className: "text-xs font-bold tracking-[0.2em] text-gray-800 uppercase block",
                        children: "PERFORMANCE"
                      }),
                      T.jsx("div", { className: "w-9 h-[2.5px] bg-black" })
                    ]
                  }),
                  T.jsx("h2", {
                    className: "text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight",
                    children: "More Powerful, Lighter, Faster"
                  }),
                  T.jsx("p", {
                    className: "text-sm sm:text-base text-gray-600 leading-relaxed font-normal pt-2",
                    children: "Underneath its bespoke exterior lies an uncompromised performance powertrain. Responsive transmission calibration pairs with intelligent all-wheel-drive traction to unleash effortless power delivery, pinpoint cornering poise, and high-speed stability across Kenyan highways and rugged escapes."
                  })
                ]
              })`;

const newPerfLeftCol = `              /* Left Column: Dynamic Performance Copy */
              T.jsxs("div", {
                className: "lg:col-span-5 space-y-4 order-2 lg:order-1",
                children: [
                  T.jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      T.jsx("span", {
                        className: "text-xs font-bold tracking-[0.2em] text-gray-800 uppercase block",
                        children: perfLabel
                      }),
                      T.jsx("div", { className: "w-9 h-[2.5px] bg-black" })
                    ]
                  }),
                  T.jsx("h2", {
                    className: "text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight",
                    children: perfTitle
                  }),
                  T.jsx("p", {
                    className: "text-sm sm:text-base text-gray-600 leading-relaxed font-normal pt-2 whitespace-pre-line",
                    children: perfDesc
                  })
                ]
              })`;

if (js.includes(oldPerfLeftCol)) {
  js = js.replace(oldPerfLeftCol, newPerfLeftCol);
  console.log("Updated Performance section to use dynamic admin segment!");
}

// =========================================================================
// 2. UPDATE cleanList & Firestore synchronization in FeaturedCarsAdminStudio
// =========================================================================

const oldCleanListStart = 'const cleanList = updatedList.map((car, idx) => ({';
const oldCleanListEnd = 'order: idx,        archived: !!car.archived,        updatedAt: new Date().toISOString()      }));';

const cleanListStartIdx = js.indexOf(oldCleanListStart);
const cleanListEndIdx = js.indexOf(oldCleanListEnd, cleanListStartIdx);

if (cleanListStartIdx !== -1 && cleanListEndIdx !== -1) {
  const newCleanList = `const cleanList = updatedList.map((car, idx) => ({
        id: String(car.id || ("featured-" + (Date.now() + idx))),
        make: String(car.make || "Prestige"),
        model: String(car.model || "Edition"),
        year: Number(car.year) || 2023,
        price: Number(car.price) || 0,
        mileage: String(car.mileage || "35,000 km"),
        fuel: String(car.fuel || "Diesel"),
        transmission: String(car.transmission || "Automatic"),
        type: String(car.type || "Prestige SUV"),
        location: String(car.location || "Kiambu Road, Ridgeways"),
        status: String(car.status || "Available"),
        description: String(car.description || ""),
        image: String(car.image || (car.images && car.images[0]) || "/images/hero_showroom.jpg"),
        images: (car.images && car.images.length) ? car.images.map(String) : [String(car.image || "/images/hero_showroom.jpg")],
        features: (car.features && car.features.length) ? car.features.map(String) : [...DEFAULT_FEATURE_EQUIPMENT_LIST],
        styles: car.styles || { featuresBg: "#000F1E", titleBarBg: "#000F1E", accentColor: "#C59B51" },
        // Custom Segments requested by User
        torque: String(car.torque || (car.specifications && car.specifications.torque) || "600 nm"),
        acceleration: String(car.acceleration || (car.specifications && car.specifications.acceleration) || "7.4s"),
        topSpeed: String(car.topSpeed || (car.specifications && car.specifications.topSpeed) || "199km/h"),
        designLabel: String(car.designLabel || "DESIGN"),
        designTitle: String(car.designTitle || "Design and Aerodynamics"),
        designDescription: String(car.designDescription || ""),
        performanceLabel: String(car.performanceLabel || "PERFORMANCE"),
        performanceTitle: String(car.performanceTitle || "More Powerful, Lighter, Faster"),
        performanceDescription: String(car.performanceDescription || ""),
        specifications: {
          drivetrain: String((car.specifications && car.specifications.drivetrain) || "Intelligent All-Wheel Drive (AWD)"),
          exteriorPaint: String((car.specifications && car.specifications.exteriorPaint) || "Metallic Factory Finish"),
          interiorTrim: String((car.specifications && car.specifications.interiorTrim) || "Full Premium Nappa Leather"),
          importStatus: String((car.specifications && car.specifications.importStatus) || "Duty & Clearance Settled"),
          extraInfo: String((car.specifications && car.specifications.extraInfo) || car.description || ""),
          torque: String(car.torque || (car.specifications && car.specifications.torque) || "600 nm"),
          acceleration: String(car.acceleration || (car.specifications && car.specifications.acceleration) || "7.4s"),
          topSpeed: String(car.topSpeed || (car.specifications && car.specifications.topSpeed) || "199km/h")
        },
        videoUrl: String(car.videoUrl || ""),
        order: idx,
        archived: !!car.archived,
        updatedAt: new Date().toISOString()
      }));`;

  js = js.substring(0, cleanListStartIdx) + newCleanList + js.substring(cleanListEndIdx + oldCleanListEnd.length);
  console.log("Updated cleanList mapping with all custom segments!");
}

// REST serialization in persistChanges
const oldRestFields = `          videoUrl: { stringValue: car.videoUrl },`;
const newRestFields = `          videoUrl: { stringValue: car.videoUrl },
          torque: { stringValue: String(car.torque || "600 nm") },
          acceleration: { stringValue: String(car.acceleration || "7.4s") },
          topSpeed: { stringValue: String(car.topSpeed || "199km/h") },
          designLabel: { stringValue: String(car.designLabel || "DESIGN") },
          designTitle: { stringValue: String(car.designTitle || "Design and Aerodynamics") },
          designDescription: { stringValue: String(car.designDescription || "") },
          performanceLabel: { stringValue: String(car.performanceLabel || "PERFORMANCE") },
          performanceTitle: { stringValue: String(car.performanceTitle || "More Powerful, Lighter, Faster") },
          performanceDescription: { stringValue: String(car.performanceDescription || "") },`;

if (js.includes(oldRestFields)) {
  js = js.replace(oldRestFields, newRestFields);
  console.log("Updated REST serialization with custom segments!");
}

// Parse in fast-path Firestore REST query at start of FeaturedCarsAdminStudio
const oldParseBlock = `              description: f.description?.stringValue || "",`;
const newParseBlock = `              description: f.description?.stringValue || "",
              torque: f.torque?.stringValue || "600 nm",
              acceleration: f.acceleration?.stringValue || "7.4s",
              topSpeed: f.topSpeed?.stringValue || "199km/h",
              designLabel: f.designLabel?.stringValue || "DESIGN",
              designTitle: f.designTitle?.stringValue || "Design and Aerodynamics",
              designDescription: f.designDescription?.stringValue || "",
              performanceLabel: f.performanceLabel?.stringValue || "PERFORMANCE",
              performanceTitle: f.performanceTitle?.stringValue || "More Powerful, Lighter, Faster",
              performanceDescription: f.performanceDescription?.stringValue || "",`;

if (js.includes(oldParseBlock)) {
  js = js.replace(oldParseBlock, newParseBlock);
  console.log("Updated Firestore document parsing with custom segments!");
}

// =========================================================================
// 3. ADD THE 3 SEGMENTS AND VEHICLE PICKER TO FeaturedCarsAdminStudio FORM UI
// =========================================================================

// Locate right before /* 4. HIGH-DEFINITION PHOTOS (SLOTS 1-6) */
const formInsertTarget = '/* 4. HIGH-DEFINITION PHOTOS (SLOTS 1-6) */';
const formInsertIdx = js.indexOf(formInsertTarget);

if (formInsertIdx === -1) {
  console.error("Could not find formInsertTarget:", formInsertTarget);
  process.exit(1);
}

const adminSegmentsUI = `/* CUSTOM FEATURED CAR SEGMENTS: HERO SPECS, DESIGN, AND PERFORMANCE */
              T.jsxs("div", {
                className: "bg-black/40 border border-white/5 p-6 rounded-3xl space-y-6",
                children: [
                  /* Header & Inventory Quick Picker */
                  T.jsxs("div", {
                    className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-white/10",
                    children: [
                      T.jsxs("div", {
                        children: [
                          T.jsx("h4", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
                            T.jsx("span", { className: "text-[#C59B51]", children: "★" }),
                            "Featured Car Segments & Specifications"
                          ] }),
                          T.jsx("p", { className: "text-xs text-white/50", children: "Configure the Torque, 0-100 km/h, Max Speed, DESIGN, and PERFORMANCE sections for this featured vehicle." })
                        ]
                      }),

                      /* Quick Pick from Dashboard Vehicles Dropdown */
                      T.jsxs("div", {
                        className: "flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-2 rounded-xl",
                        children: [
                          T.jsx("span", { className: "text-xs font-mono uppercase text-[#C59B51] font-bold whitespace-nowrap", children: "Pick Car from Dash:" }),
                          T.jsxs("select", {
                            className: "bg-transparent text-white text-xs outline-none cursor-pointer font-medium max-w-[200px] truncate",
                            value: activeCar.id || "",
                            onChange: (e) => {
                              const selId = e.target.value;
                              if (!selId) return;
                              // Check if already in customCars
                              const found = customCars.find(c => c.id === selId);
                              if (found) {
                                setActiveCarId(selId);
                              } else {
                                // Find in inventoryCars
                                const invCar = allInventoryList.find(c => c.id === selId);
                                if (invCar) {
                                  handleSelectFromInventory(invCar);
                                }
                              }
                            },
                            children: [
                              T.jsx("option", { value: activeCar.id || "", disabled: true, className: "bg-[#162330] text-white", children: "— Currently Editing: " + (activeCar.make + " " + activeCar.model) + " —" }),
                              allInventoryList.map(inv => T.jsx("option", {
                                key: inv.id,
                                value: inv.id,
                                className: "bg-[#162330] text-white",
                                children: (inv.year || "") + " " + inv.make + " " + inv.model + " (" + (inv.price ? "KSh " + Number(inv.price).toLocaleString() : "POA") + ")"
                              }))
                            ]
                          })
                        ]
                      })
                    ]
                  }),

                  /* SEGMENT 1: HERO PERFORMANCE SPECS (SCREENSHOT 536) */
                  T.jsxs("div", {
                    className: "bg-white/[0.02] border border-white/10 p-5 rounded-2xl space-y-3",
                    children: [
                      T.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          T.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              T.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-400" }),
                              T.jsx("h5", { className: "text-sm font-bold text-white uppercase tracking-wider", children: "1. Hero Performance Specs (Screenshot 536)" })
                            ]
                          }),
                          T.jsx("span", { className: "text-[11px] font-mono text-white/40", children: "Renders in Hero Podium Capsule" })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1",
                        children: [
                          /* 1. Torque */
                          T.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              T.jsx("label", { className: "text-xs font-mono uppercase text-[#C59B51] font-bold block", children: "Torque" }),
                              T.jsx("input", {
                                type: "text",
                                placeholder: "e.g. 600 nm or 520 nm",
                                value: activeCar.torque || (activeCar.specifications && activeCar.specifications.torque) || "",
                                onChange: (e) => updateActiveCar(c => ({
                                  ...c,
                                  torque: e.target.value,
                                  specifications: { ...(c.specifications || {}), torque: e.target.value }
                                })),
                                className: "w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-sm font-mono font-bold outline-none focus:border-[#C59B51]"
                              }),
                              T.jsx("span", { className: "text-[10px] text-white/40", children: "Displayed as first stat in hero" })
                            ]
                          }),

                          /* 2. 0-100 km/h */
                          T.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              T.jsx("label", { className: "text-xs font-mono uppercase text-[#C59B51] font-bold block", children: "0-100 km/h" }),
                              T.jsx("input", {
                                type: "text",
                                placeholder: "e.g. 7.4s or 4.4s",
                                value: activeCar.acceleration || (activeCar.specifications && activeCar.specifications.acceleration) || "",
                                onChange: (e) => updateActiveCar(c => ({
                                  ...c,
                                  acceleration: e.target.value,
                                  specifications: { ...(c.specifications || {}), acceleration: e.target.value }
                                })),
                                className: "w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-sm font-mono font-bold outline-none focus:border-[#C59B51]"
                              }),
                              T.jsx("span", { className: "text-[10px] text-white/40", children: "Displayed as second stat in hero" })
                            ]
                          }),

                          /* 3. Max Speed */
                          T.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              T.jsx("label", { className: "text-xs font-mono uppercase text-[#C59B51] font-bold block", children: "Max Speed" }),
                              T.jsx("input", {
                                type: "text",
                                placeholder: "e.g. 199km/h or 290km/h",
                                value: activeCar.topSpeed || (activeCar.specifications && activeCar.specifications.topSpeed) || "",
                                onChange: (e) => updateActiveCar(c => ({
                                  ...c,
                                  topSpeed: e.target.value,
                                  specifications: { ...(c.specifications || {}), topSpeed: e.target.value }
                                })),
                                className: "w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-white text-sm font-mono font-bold outline-none focus:border-[#C59B51]"
                              }),
                              T.jsx("span", { className: "text-[10px] text-white/40", children: "Displayed as third stat in hero" })
                            ]
                          })
                        ]
                      })
                    ]
                  }),

                  /* SEGMENT 2: DESIGN / DESIGN AND AERODYNAMICS (SECTION 2) */
                  T.jsxs("div", {
                    className: "bg-white/[0.02] border border-white/10 p-5 rounded-2xl space-y-4",
                    children: [
                      T.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          T.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              T.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-blue-400" }),
                              T.jsx("h5", { className: "text-sm font-bold text-white uppercase tracking-wider", children: "2. DESIGN / Design and Aerodynamics (Section 2)" })
                            ]
                          }),
                          T.jsx("span", { className: "text-[11px] font-mono text-white/40", children: "Alongside Slanted Exterior Shot" })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                          T.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              T.jsx("label", { className: "text-xs font-mono uppercase text-white/50 block", children: "Eyebrow Label" }),
                              T.jsx("input", {
                                type: "text",
                                placeholder: "DESIGN",
                                value: activeCar.designLabel || "DESIGN",
                                onChange: (e) => updateActiveCar(c => ({ ...c, designLabel: e.target.value })),
                                className: "w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-[#C59B51]"
                              })
                            ]
                          }),
                          T.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              T.jsx("label", { className: "text-xs font-mono uppercase text-white/50 block", children: "Section Heading / Title" }),
                              T.jsx("input", {
                                type: "text",
                                placeholder: "Design and Aerodynamics",
                                value: activeCar.designTitle || "Design and Aerodynamics",
                                onChange: (e) => updateActiveCar(c => ({ ...c, designTitle: e.target.value })),
                                className: "w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-[#C59B51]"
                              })
                            ]
                          })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50 block", children: "Design Description Paragraph" }),
                          T.jsx("textarea", {
                            rows: 3,
                            placeholder: "Describe the exterior craftsmanship, aerodynamic channels, body lines, and prestige presence of this car...",
                            value: activeCar.designDescription || "",
                            onChange: (e) => updateActiveCar(c => ({ ...c, designDescription: e.target.value })),
                            className: "w-full bg-white/5 border border-white/15 rounded-xl p-3.5 text-white text-xs leading-relaxed outline-none focus:border-[#C59B51]"
                          })
                        ]
                      })
                    ]
                  }),

                  /* SEGMENT 3: PERFORMANCE / MORE POWERFUL, LIGHTER, FASTER (SECTION 3) */
                  T.jsxs("div", {
                    className: "bg-white/[0.02] border border-white/10 p-5 rounded-2xl space-y-4",
                    children: [
                      T.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          T.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              T.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-400" }),
                              T.jsx("h5", { className: "text-sm font-bold text-white uppercase tracking-wider", children: "3. PERFORMANCE / More Powerful, Lighter, Faster (Section 3)" })
                            ]
                          }),
                          T.jsx("span", { className: "text-[11px] font-mono text-white/40", children: "Alongside Slanted Cockpit Shot" })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                          T.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              T.jsx("label", { className: "text-xs font-mono uppercase text-white/50 block", children: "Eyebrow Label" }),
                              T.jsx("input", {
                                type: "text",
                                placeholder: "PERFORMANCE",
                                value: activeCar.performanceLabel || "PERFORMANCE",
                                onChange: (e) => updateActiveCar(c => ({ ...c, performanceLabel: e.target.value })),
                                className: "w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-[#C59B51]"
                              })
                            ]
                          }),
                          T.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              T.jsx("label", { className: "text-xs font-mono uppercase text-white/50 block", children: "Section Heading / Title" }),
                              T.jsx("input", {
                                type: "text",
                                placeholder: "More Powerful, Lighter, Faster",
                                value: activeCar.performanceTitle || "More Powerful, Lighter, Faster",
                                onChange: (e) => updateActiveCar(c => ({ ...c, performanceTitle: e.target.value })),
                                className: "w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-[#C59B51]"
                              })
                            ]
                          })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50 block", children: "Performance Description Paragraph" }),
                          T.jsx("textarea", {
                            rows: 3,
                            placeholder: "Describe the engine output, acceleration dynamics, transmission response, and all-wheel-drive traction of this car...",
                            value: activeCar.performanceDescription || "",
                            onChange: (e) => updateActiveCar(c => ({ ...c, performanceDescription: e.target.value })),
                            className: "w-full bg-white/5 border border-white/15 rounded-xl p-3.5 text-white text-xs leading-relaxed outline-none focus:border-[#C59B51]"
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),

              `;

js = js.substring(0, formInsertIdx) + adminSegmentsUI + js.substring(formInsertIdx);
console.log("Added 3 segments and vehicle picker to FeaturedCarsAdminStudio UI!");

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
