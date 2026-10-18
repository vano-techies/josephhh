const fs = require('fs');
const vm = require('vm');

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

console.log("Patching nk hero section with animated alternating cars...");

const targetStart = "function nk({setView:s,setSelectedCar:e}){";
const targetEnd = `T.jsxs("section",{id:"featured-vehicles"`;

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

const newNkHero = `function nk({ setView: s, setSelectedCar: e }) {
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
          /* Animated Background Slides with smooth fade and subtle zoom transition */
          heroCars.map((carItem, cIdx) => {
            const isActive = cIdx === currentIdx;
            const bgImg = (carItem.images && carItem.images[0]) || carItem.image || "/images/hero_showroom.jpg";
            return T.jsx("img", {
              key: carItem.id || cIdx,
              src: bgImg,
              alt: ((carItem.make || "") + " " + (carItem.model || "")),
              className: "hero-slide-item",
              style: {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "scale(1.02)" : "scale(1.06)",
                transition: "opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1), transform 5s ease-out",
                zIndex: isActive ? 1 : 0,
                filter: "brightness(0.92)"
              }
            });
          }),

          /* Dark Luxury Vignette */
          T.jsx("div", {
            className: "hero-dark-vignette",
            style: { zIndex: 2 }
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

          /* Main Hero Content with Animated Spotlight */
          T.jsx("div", {
            className: "hero-inner-content relative z-10",
            children: T.jsxs("div", {
              className: "hero-text-wrapper",
              children: [
                /* Animated Vehicle Spotlight Badge that alternates with each car */
                currentCar && T.jsxs("div", {
                  onClick: () => handleCarClick(currentCar),
                  className: "mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-[#C59B51]/40 shadow-sm cursor-pointer hover:border-[#C59B51] transition-all duration-300",
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

js = js.substring(0, startIdx) + newNkHero + js.substring(endIdx);

// Validate JS syntax
try {
  new vm.Script(js);
  console.log("Syntax validation PASSED!");
} catch (e) {
  console.error("Syntax validation FAILED:", e);
  process.exit(1);
}

fs.writeFileSync('assets/index-BIZlWqQ7.js', js);
console.log("Successfully updated nk hero section in assets/index-BIZlWqQ7.js!");
