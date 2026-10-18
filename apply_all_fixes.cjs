const fs = require('fs');
const vm = require('vm');

console.log("Applying all fixes for Featured Vehicles, Hero Alternating Cars, Unzoom, Clean Slate & Cross-Device Sync...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

// =========================================================================
// 1. REVISE HERO SECTION (nk component)
// - Cars alternate animatedly (every 4.5s)
// - Includes all featured cars and inventory cars (including 2019 Mercedes-Benz G350d)
// - UNZOOMED: objectFit: contain, transform: none (no scale zoom!)
// - Full vehicle is completely visible, sharp, clear, and uncropped
// - Spotlight badge updates per vehicle with direct click-through
// - Previous/Next controls, Slide counter, and dot indicators
// =========================================================================
const nkStart = js.indexOf("function nk({ setView: s, setSelectedCar: e }) {");
const nkEnd = js.indexOf(`T.jsxs("section",{id:"featured-vehicles"`, nkStart);

if (nkStart === -1 || nkEnd === -1) {
  console.error("Could not find nk boundaries:", nkStart, nkEnd);
  process.exit(1);
}

const newNkComponent = `function nk({ setView: s, setSelectedCar: e }) {
  const [t, n] = Fe.useState(0);
  const [isPaused, setIsPaused] = Fe.useState(false);
  const i = c7();
  const o = useFeaturedCars();

  // Combine featured vehicles & showroom inventory (including 2019 Mercedes-Benz G350d)
  const heroCars = Fe.useMemo(() => {
    const list = [];
    const seen = new Set();
    // 1. Featured vehicles from bottom section
    (o || []).forEach(c => {
      if (c && c.id && !seen.has(c.id)) {
        seen.add(c.id);
        list.push(c);
      }
    });
    // 2. Showroom inventory vehicles (including 2019 Mercedes-Benz G-Wagon G350d)
    (i || []).forEach(c => {
      if (c && c.id && !seen.has(c.id)) {
        seen.add(c.id);
        list.push(c);
      }
    });
    return list.length > 0 ? list : (typeof DEFAULT_PREVIOUS_CARS !== "undefined" ? DEFAULT_PREVIOUS_CARS : []);
  }, [o, i]);

  // Animated auto-advance timer: smoothly alternates cars every 4.5 seconds
  Fe.useEffect(() => {
    if (heroCars.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      n(prev => (prev + 1) % heroCars.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [heroCars.length, isPaused]);

  const currentIdx = heroCars.length > 0 ? (t % heroCars.length) : 0;
  const currentCar = heroCars[currentIdx] || null;
  const carTitle = currentCar ? (((currentCar.year ? currentCar.year + " " : "") + (currentCar.make || "") + " " + (currentCar.model || "")).trim()) : "PREMIUM LUXURY MOTORCAR";
  const carPrice = (currentCar && currentCar.price) ? ("KSh " + Number(currentCar.price).toLocaleString()) : "Price on Application";

  const handleCarClick = (targetCar) => {
    const carToView = targetCar || currentCar;
    if (!carToView) return;
    try {
      window.history.pushState({}, "", "/?featured=" + carToView.id);
    } catch (_) {}
    window.location.hash = "featured-" + carToView.id;
    window.dispatchEvent(new Event("popstate"));
    window.dispatchEvent(new Event("hashchange"));
    window.scrollTo(0, 0);
  };

  return T.jsxs("div", {
    style: { backgroundColor: "#ffffff", width: "100%" },
    children: [
      T.jsxs("section", {
        className: "hero-section-box relative overflow-hidden select-none",
        onMouseEnter: () => setIsPaused(true),
        onMouseLeave: () => setIsPaused(false),
        children: [
          /* Luxury Dark Atmosphere Background */
          T.jsx("div", {
            style: {
              position: "absolute",
              inset: 0,
              backgroundColor: "#0A0A0E",
              backgroundImage: "radial-gradient(ellipse at 75% 50%, rgba(35, 38, 52, 0.95) 0%, rgba(12, 13, 18, 0.98) 60%, #050508 100%)",
              zIndex: 1
            }
          }),

          /* Ambient Soft Lighting per active vehicle */
          heroCars.map((carItem, cIdx) => {
            const isActive = cIdx === currentIdx;
            const bgImg = (carItem.images && carItem.images[0]) || carItem.image || "/images/hero_showroom.jpg";
            return T.jsx("div", {
              key: "glow-" + (carItem.id || cIdx),
              style: {
                position: "absolute",
                inset: 0,
                backgroundImage: "url(" + bgImg + ")",
                backgroundPosition: "center right",
                backgroundSize: "cover",
                opacity: isActive ? 0.16 : 0,
                filter: "blur(60px)",
                transform: "none",
                transition: "opacity 0.8s ease-in-out",
                zIndex: 2,
                pointerEvents: "none"
              }
            });
          }),

          /* Dark Vignette Overlay for Crisp Contrast */
          T.jsx("div", {
            className: "hero-dark-vignette",
            style: { zIndex: 3 }
          }),

          /* FOREGROUND CRISP UNZOOMED CAR DISPLAY STAGE */
          T.jsx("div", {
            className: "hero-car-stage-container absolute inset-0 w-full h-full flex items-center justify-end select-none pointer-events-none",
            style: { zIndex: 6 },
            children: heroCars.map((carItem, cIdx) => {
              const isActive = cIdx === currentIdx;
              const carImg = (carItem.images && carItem.images[0]) || carItem.image || "/images/hero_showroom.jpg";
              const cName = ((carItem.make || "") + " " + (carItem.model || "")).trim();
              return T.jsx("div", {
                key: "stage-car-" + (carItem.id || cIdx),
                className: "hero-car-stage-item",
                style: {
                  position: "absolute",
                  right: "3%",
                  top: 0,
                  bottom: 0,
                  width: "58%",
                  maxWidth: "920px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: isActive ? 1 : 0,
                  transform: "none",
                  transition: "opacity 0.75s ease-in-out",
                  pointerEvents: isActive ? "auto" : "none",
                  cursor: "pointer"
                },
                onClick: () => handleCarClick(carItem),
                title: "View " + cName + " Details",
                children: T.jsx("img", {
                  src: carImg,
                  alt: cName,
                  className: "hero-clean-unzoomed-img",
                  style: {
                    maxHeight: "86%",
                    maxWidth: "100%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    objectPosition: "center",
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.75))",
                    transform: "none"
                  }
                })
              });
            })
          }),

          /* Top Brand Slogan */
          T.jsxs("div", {
            style: { position: "absolute", top: 16, left: 32, zIndex: 15, display: "flex", alignItems: "center", gap: 8 },
            className: "hidden sm:flex",
            children: [
              T.jsx("span", { style: { height: 1.5, width: 18, backgroundColor: "#C59B51" } }),
              T.jsx("span", {
                style: {
                  color: "rgba(255,255,255,0.92)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase"
                },
                children: "home of luxury and class"
              }),
              T.jsx("span", { style: { height: 1.5, width: 18, backgroundColor: "#C59B51" } })
            ]
          }),

          /* Main Hero Content with Animated Spotlight Badge */
          T.jsx("div", {
            className: "hero-inner-content relative z-10",
            children: T.jsxs("div", {
              className: "hero-text-wrapper",
              children: [
                /* Animated Vehicle Spotlight Badge that alternates with each car */
                currentCar && T.jsxs("div", {
                  onClick: () => handleCarClick(currentCar),
                  className: "mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#C59B51]/50 shadow-md cursor-pointer hover:border-[#C59B51] transition-all duration-300",
                  children: [
                    T.jsx("span", { className: "w-2 h-2 rounded-full bg-[#C59B51] animate-ping shrink-0" }),
                    T.jsx("span", {
                      className: "text-[10px] sm:text-xs font-mono font-bold text-white uppercase tracking-wider truncate max-w-[240px] sm:max-w-none",
                      children: carTitle
                    }),
                    T.jsx("span", {
                      className: "text-[10px] sm:text-xs font-bold text-[#C59B51] pl-1.5 border-l border-white/20",
                      children: carPrice
                    })
                  ]
                }),

                T.jsx("p", { className: "hero-welcome-badge", children: "WELCOME TO" }),
                T.jsx("h1", { className: "hero-h1-white", children: "MR JOSEPH" }),
                T.jsx("h2", { className: "hero-h2-gold", children: "PREMIUM CARS" }),
                T.jsxs("p", {
                  className: "hero-p-sub",
                  children: [
                    "Luxury Vehicles. Exceptional Service.",
                    T.jsx("br", {}),
                    "Your Next Drive Starts Here."
                  ]
                }),

                /* Buttons: Explore Current Vehicle & Browse Showroom */
                T.jsxs("div", {
                  className: "flex items-center gap-3 flex-wrap",
                  children: [
                    T.jsxs("button", {
                      type: "button",
                      onClick: () => handleCarClick(currentCar),
                      className: "hero-btn-cta cursor-pointer shadow-lg hover:scale-102 transition-transform",
                      children: [
                        "EXPLORE THIS CAR",
                        T.jsx("span", { style: { fontSize: 13, fontWeight: "bold" }, children: "→" })
                      ]
                    }),
                    T.jsx("button", {
                      type: "button",
                      onClick: () => {
                        const h = document.getElementById("featured-vehicles") || document.getElementById("our-cars-section");
                        h ? h.scrollIntoView({ behavior: "smooth" }) : s("inventory");
                      },
                      className: "px-4 py-2.5 bg-black/40 hover:bg-black/60 text-white border border-white/25 rounded-[3px] text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm cursor-pointer transition-all hover:border-white/50",
                      children: "VIEW ALL INVENTORY"
                    })
                  ]
                })
              ]
            })
          }),

          /* Interactive Carousel Navigation Controls: Slide Dots + Prev/Next */
          T.jsxs("div", {
            className: "hero-arrow-controls flex items-center gap-2",
            style: { zIndex: 20 },
            children: [
              /* Slide Index Counter */
              T.jsxs("span", {
                className: "hidden sm:inline-block px-2 py-1 bg-black/60 backdrop-blur-sm text-white/70 font-mono text-[10px] font-bold rounded border border-white/10 mr-1",
                children: [
                  String(currentIdx + 1).padStart(2, "0"),
                  " / ",
                  String(heroCars.length).padStart(2, "0")
                ]
              }),
              /* Previous Button */
              T.jsx("button", {
                type: "button",
                onClick: () => n(prev => (prev - 1 + heroCars.length) % heroCars.length),
                className: "hero-arrow-btn cursor-pointer",
                "aria-label": "Previous vehicle",
                children: T.jsx("span", { children: "‹" })
              }),
              /* Next Button */
              T.jsx("button", {
                type: "button",
                onClick: () => n(prev => (prev + 1) % heroCars.length),
                className: "hero-arrow-btn cursor-pointer",
                "aria-label": "Next vehicle",
                children: T.jsx("span", { children: "›" })
              })
            ]
          })
        ]
      }),
      `;

js = js.substring(0, nkStart) + newNkComponent + js.substring(nkEnd);
console.log("Updated nk component with unzoomed alternating hero cars successfully!");

// =========================================================================
// 2. ADD "ARCHIVE ALL / CLEAN SLATE" BUTTON IN FeaturedCarsAdminStudio
// =========================================================================
const blankBtnTarget = 'children: ["+ Blank"]                      })';
const blankPos = js.indexOf(blankBtnTarget);
if (blankPos !== -1) {
  const insertPos = blankPos + blankBtnTarget.length;
  const cleanSlateButton = `,
                      T.jsxs("button", {
                        type: "button",
                        onClick: () => {
                          if (window.confirm("Archive all featured cars and start with a clean slate? You can add fresh cars from your showroom inventory anytime.")) {
                            setCustomCars([]);
                            setActiveCarId(null);
                            persistChanges([], "All featured vehicles archived. Clean slate active!");
                          }
                        },
                        className: "text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors ml-1 px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20",
                        title: "Archive all cars and start with a clean slate",
                        children: ["🗑 Archive All / Clean Slate"]
                      })`;
  js = js.substring(0, insertPos) + cleanSlateButton + js.substring(insertPos);
  console.log("Added Archive All / Clean Slate button to FeaturedCarsAdminStudio!");
} else {
  console.warn("Could not find + Blank button target for Clean Slate button!");
}

// =========================================================================
// 3. REMOVE HOVER/ZOOM SCALE IN FLPage and ik
// Replace group-hover:scale-105, group-hover:scale-108, group-hover:scale-102
// =========================================================================
js = js.replace(/group-hover:scale-105/g, 'transition-opacity duration-300');
js = js.replace(/group-hover:scale-108/g, 'transition-opacity duration-300');
js = js.replace(/group-hover:scale-102/g, 'transition-opacity duration-300');

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
