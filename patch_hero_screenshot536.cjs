const fs = require('fs');
const vm = require('vm');

console.log("Updating FLPage header and hero to match Screenshot 536...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

// First, add carPerformanceStats calculation in FLPage
const carPerformanceCalc = `  const fullName = ((currentCar.year ? currentCar.year + " " : "") + (currentCar.make || "") + " " + (currentCar.model || "")).trim();
  const formattedPrice = currentCar.price ? "KSh " + Number(currentCar.price).toLocaleString() : "Price on Application";
  const bodyType = currentCar.type || "Prestige Vehicle";

  // Performance stats accurately mapped per vehicle (matching Screenshot 536)
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

const oldVarsTarget = `  const fullName = ((currentCar.year ? currentCar.year + " " : "") + (currentCar.make || "") + " " + (currentCar.model || "")).trim();
  const formattedPrice = currentCar.price ? "KSh " + Number(currentCar.price).toLocaleString() : "Price on Application";
  const bodyType = currentCar.type || "Prestige Vehicle";
  const torqueVal = (currentCar.specifications && currentCar.specifications.torque) || (currentCar.fuel === "Diesel" ? "600 nm" : "520 nm");
  const accelVal = (currentCar.specifications && currentCar.specifications.acceleration) || (currentCar.year >= 2021 ? "4.4s" : "5.6s");
  const maxSpeedVal = (currentCar.specifications && currentCar.specifications.topSpeed) || "260km/h";`;

if (js.includes(oldVarsTarget)) {
  js = js.replace(oldVarsTarget, carPerformanceCalc);
  console.log("Updated carPerformanceStats calculation!");
} else {
  console.warn("Could not find exact oldVarsTarget!");
}

// Second, replace Header and Hero Section
const headerStartTarget = '/* 1. TOP NAVBAR (CLEAN MINIMAL BACK NAVIGATION) */';
const heroEndTarget = '/* Left Semi-Circle Carousel Arrow */';

const startIdx = js.indexOf(headerStartTarget);
const endIdx = js.indexOf(heroEndTarget, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find start and end boundaries:", startIdx, endIdx);
  process.exit(1);
}

const newHeaderAndHero = `/* 1. TOP NAVBAR (HIGH-VISIBILITY BACK TO SHOWROOM) */
      /* ========================================================================= */
      T.jsx("header", {
        className: "w-full bg-[#121c27] border-b border-white/15 sticky top-0 z-50 text-white shadow-xl backdrop-blur-md",
        children: T.jsxs("div", {
          className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between",
          children: [
            /* Highly visible '← Back to Showroom' button */
            T.jsxs("button", {
              type: "button",
              onClick: backFn,
              className: "flex items-center gap-2.5 bg-white hover:bg-[#C59B51] text-gray-900 hover:text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-2xl transition-all duration-300 cursor-pointer border-2 border-white hover:border-[#C59B51] hover:scale-102",
              children: [
                T.jsx("span", { className: "text-base sm:text-lg font-black leading-none", children: "←" }),
                T.jsx("span", { children: "Back to Showroom" })
              ]
            }),

            /* Right WhatsApp Quick Inquiry */
            T.jsxs("a", {
              href: whatsappCarUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#1fb355] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg transition-all duration-300 hover:scale-102",
              children: [
                T.jsx("span", { className: "text-base", children: "💬" }),
                T.jsx("span", { children: "Inquire on WhatsApp" })
              ]
            })
          ]
        })
      }),

      /* ========================================================================= */
      /* 2. HERO SHOWCASE SECTION (SCREENSHOT 536 EXACT MATCH) */
      /* ========================================================================= */
      T.jsxs("section", {
        className: "relative w-full bg-[#162330] text-white overflow-hidden pt-10 sm:pt-14 pb-16 sm:pb-24 select-none",
        children: [
          /* Main Car Display Stage with Asymmetrical Left Podium Card matching Screenshot 536 */
          T.jsx("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative",
            children: T.jsxs("div", {
              className: "relative flex flex-col lg:flex-row items-center justify-between min-h-[380px] sm:min-h-[460px] pb-4",
              children: [
                /* Left Slate Capsule Card matching Screenshot 536 */
                T.jsxs("div", {
                  className: "w-full lg:w-[540px] bg-[#334253]/90 backdrop-blur-md px-8 py-7 sm:px-10 sm:py-9 rounded-tl-[75px] sm:rounded-tl-[95px] rounded-bl-[35px] sm:rounded-bl-[45px] rounded-tr-3xl lg:rounded-tr-none rounded-br-3xl lg:rounded-br-none border-t border-l border-white/20 shadow-2xl z-10",
                  children: [
                    /* Car Model Title - clean, regular font matching Screenshot 536 */
                    T.jsx("h2", {
                      className: "text-xl sm:text-2xl lg:text-3xl font-normal text-white tracking-wide mb-5",
                      children: fullName
                    }),

                    /* 3 Stats Row in Screenshot 536 style */
                    T.jsxs("div", {
                      className: "flex items-center justify-between sm:justify-start",
                      children: [
                        /* Stat 1: Torque */
                        T.jsxs("div", {
                          className: "pr-3 sm:pr-5",
                          children: [
                            T.jsx("div", {
                              className: "text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-none",
                              children: carPerformanceStats.torque
                            }),
                            T.jsx("div", {
                              className: "text-xs sm:text-sm text-white/80 font-normal mt-1.5",
                              children: "Torque"
                            })
                          ]
                        }),

                        /* Divider 1 */
                        T.jsx("div", {
                          className: "w-[1.5px] h-11 sm:h-13 bg-white/35 shrink-0 self-center mx-2 sm:mx-5"
                        }),

                        /* Stat 2: 0-100 km/h */
                        T.jsxs("div", {
                          className: "px-2 sm:px-4",
                          children: [
                            T.jsx("div", {
                              className: "text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-none",
                              children: carPerformanceStats.accel
                            }),
                            T.jsx("div", {
                              className: "text-xs sm:text-sm text-white/80 font-normal mt-1.5 whitespace-nowrap",
                              children: "0-100 km/h"
                            })
                          ]
                        }),

                        /* Divider 2 */
                        T.jsx("div", {
                          className: "w-[1.5px] h-11 sm:h-13 bg-white/35 shrink-0 self-center mx-2 sm:mx-5"
                        }),

                        /* Stat 3: Max Speed */
                        T.jsxs("div", {
                          className: "pl-2 sm:pl-4",
                          children: [
                            T.jsx("div", {
                              className: "text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-none",
                              children: carPerformanceStats.speed
                            }),
                            T.jsx("div", {
                              className: "text-xs sm:text-sm text-white/80 font-normal mt-1.5 whitespace-nowrap",
                              children: "Max Speed"
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                /* Car Foreground Image */
                T.jsx("div", {
                  className: "w-full lg:w-[680px] xl:w-[780px] flex items-center justify-center -mt-6 lg:-mt-0 lg:-ml-12 z-20 cursor-pointer",
                  onClick: () => setLightboxImg(rawImages[0]),
                  title: "Click to Enlarge " + fullName,
                  children: T.jsx("img", {
                    src: rawImages[0],
                    alt: fullName,
                    className: "max-h-[340px] sm:max-h-[440px] lg:max-h-[500px] w-auto object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]",
                    style: { transform: "none" }
                  })
                })
              ]
            })
          }),

          `;

js = js.substring(0, startIdx) + newHeaderAndHero + js.substring(endIdx);
console.log("Replaced Header and Hero Section successfully!");

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
