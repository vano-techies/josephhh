const fs = require('fs');
const vm = require('vm');

console.log("Transforming FLPage to match the exact design from the screenshots...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const startTarget = "function FLPage({ carId: sId, onBack: backFn }) {";
const nextFuncTarget = "function uk(){";

const startIdx = js.indexOf(startTarget);
const endIdx = js.indexOf(nextFuncTarget, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find FLPage boundaries:", startIdx, endIdx);
  process.exit(1);
}

const newFLPageComponent = `function FLPage({ carId: sId, onBack: backFn }) {
  const allCars = c7();
  const featuredList = useFeaturedCars();

  // Active featured car list
  const activeList = Fe.useMemo(() => {
    return (featuredList && featuredList.length > 0) ? featuredList : resolveActiveFeaturedCars();
  }, [featuredList]);

  // Track active car index within activeList
  const initialIndex = Fe.useMemo(() => {
    const foundIdx = activeList.findIndex(c => c.id === sId);
    return foundIdx !== -1 ? foundIdx : 0;
  }, [sId, activeList]);

  const [activeCarIdx, setActiveCarIdx] = Fe.useState(initialIndex);
  const [angleIdx, setAngleIdx] = Fe.useState(0);
  const [is360Dragging, setIs360Dragging] = Fe.useState(false);
  const [dragStartX, setDragStartX] = Fe.useState(0);
  const [lightboxImg, setLightboxImg] = Fe.useState(null);

  // Sync index if sId changes from URL
  Fe.useEffect(() => {
    const idx = activeList.findIndex(c => c.id === sId);
    if (idx !== -1) {
      setActiveCarIdx(idx);
    }
    setAngleIdx(0);
    window.scrollTo(0, 0);
  }, [sId, activeList]);

  const currentCar = activeList[activeCarIdx] || activeList[0] || null;

  if (!currentCar) {
    return T.jsxs("div", {
      className: "min-h-screen bg-[#162330] text-white flex flex-col items-center justify-center p-6 text-center font-sans",
      children: [
        T.jsx("h2", { className: "text-2xl font-bold mb-4", children: "Featured Vehicle Not Found" }),
        T.jsx("button", {
          onClick: backFn,
          className: "px-6 py-3 bg-[#C59B51] text-black rounded-full font-bold text-xs uppercase tracking-widest cursor-pointer shadow-md",
          children: "Back to Showroom"
        })
      ]
    });
  }

  const rawImages = (currentCar.images && currentCar.images.length)
    ? currentCar.images
    : (currentCar.image ? [currentCar.image] : ["/images/hero_showroom.jpg"]);

  const fullName = ((currentCar.year ? currentCar.year + " " : "") + (currentCar.make || "") + " " + (currentCar.model || "")).trim();
  const formattedPrice = currentCar.price ? "KSh " + Number(currentCar.price).toLocaleString() : "Price on Application";
  const bodyType = currentCar.type || "Prestige Vehicle";
  const torqueVal = (currentCar.specifications && currentCar.specifications.torque) || (currentCar.fuel === "Diesel" ? "600 nm" : "520 nm");
  const accelVal = (currentCar.specifications && currentCar.specifications.acceleration) || (currentCar.year >= 2021 ? "4.4s" : "5.6s");
  const maxSpeedVal = (currentCar.specifications && currentCar.specifications.topSpeed) || "260km/h";

  const whatsappCarUrl = "https://wa.me/254713583829?text=" + encodeURIComponent(
    "Hello Mr. Joseph, I am inquiring about the featured " + fullName + " (" + formattedPrice + "). Please share availability, private viewing, and acquisition options."
  );

  const ytSearchQuery = encodeURIComponent(currentCar.year + " " + currentCar.make + " " + currentCar.model + " review walkaround");
  const youtubeUrl = currentCar.videoUrl || ("https://www.youtube.com/results?search_query=" + ytSearchQuery);

  // Switch car helper
  const handlePrevCar = () => {
    const nextIdx = (activeCarIdx - 1 + activeList.length) % activeList.length;
    setActiveCarIdx(nextIdx);
    setAngleIdx(0);
    const nextCar = activeList[nextIdx];
    if (nextCar && nextCar.id) {
      try { window.history.pushState({}, "", "/?featured=" + nextCar.id); } catch (_) {}
    }
  };

  const handleNextCar = () => {
    const nextIdx = (activeCarIdx + 1) % activeList.length;
    setActiveCarIdx(nextIdx);
    setAngleIdx(0);
    const nextCar = activeList[nextIdx];
    if (nextCar && nextCar.id) {
      try { window.history.pushState({}, "", "/?featured=" + nextCar.id); } catch (_) {}
    }
  };

  // 360 Drag Interaction
  const handleMouseDown = (e) => {
    setIs360Dragging(true);
    setDragStartX(e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0));
  };

  const handleMouseMove = (e) => {
    if (!is360Dragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const diff = clientX - dragStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setAngleIdx(prev => (prev - 1 + rawImages.length) % rawImages.length);
      } else {
        setAngleIdx(prev => (prev + 1) % rawImages.length);
      }
      setDragStartX(clientX);
    }
  };

  const handleMouseUp = () => {
    setIs360Dragging(false);
  };

  const scrollToSection = (secId) => {
    const el = document.getElementById(secId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return T.jsxs("div", {
    className: "min-h-screen bg-white text-gray-900 font-sans selection:bg-[#C59B51] selection:text-black relative",
    style: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
    children: [
      /* ========================================================================= */
      /* 1. TOP NAVBAR (DARK SLATE NAVY MATCHING SCREENSHOT) */
      /* ========================================================================= */
      T.jsx("header", {
        className: "w-full bg-[#162330] border-b border-white/10 sticky top-0 z-50 text-white shadow-md",
        children: T.jsxs("div", {
          className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between",
          children: [
            /* Brand Logo */
            T.jsxs("div", {
              className: "flex items-center gap-3 cursor-pointer",
              onClick: backFn,
              children: [
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
              ]
            }),

            /* Center Navigation Menu Links */
            T.jsxs("nav", {
              className: "hidden md:flex items-center gap-7 text-sm font-medium text-white/90",
              children: [
                T.jsx("button", {
                  type: "button",
                  onClick: backFn,
                  className: "hover:text-[#C59B51] transition-colors cursor-pointer",
                  children: "Home"
                }),
                T.jsx("button", {
                  type: "button",
                  onClick: () => scrollToSection("design-aerodynamics"),
                  className: "text-[#C59B51] font-bold border-b-2 border-[#C59B51] pb-1 cursor-pointer",
                  children: "Featured Models"
                }),
                T.jsx("button", {
                  type: "button",
                  onClick: () => scrollToSection("performance-section"),
                  className: "hover:text-[#C59B51] transition-colors cursor-pointer",
                  children: "Performance"
                }),
                T.jsx("button", {
                  type: "button",
                  onClick: () => scrollToSection("360-view-section"),
                  className: "hover:text-[#C59B51] transition-colors cursor-pointer",
                  children: "360° View"
                }),
                T.jsx("button", {
                  type: "button",
                  onClick: () => scrollToSection("specifications-section"),
                  className: "hover:text-[#C59B51] transition-colors cursor-pointer",
                  children: "Specifications"
                })
              ]
            }),

            /* Right Action Controls: Buy Now & Test Drive Buttons */
            T.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                T.jsx("a", {
                  href: whatsappCarUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "hidden sm:inline-flex items-center px-4 py-1.5 rounded-full border border-white/30 hover:border-white text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-all",
                  children: "Buy Now"
                }),
                T.jsx("a", {
                  href: whatsappCarUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "px-5 py-2 rounded-full border-2 border-white hover:bg-white hover:text-[#162330] text-xs font-bold uppercase tracking-wider text-white transition-all shadow-sm flex items-center gap-1.5",
                  children: "Test Drive"
                }),
                T.jsx("button", {
                  type: "button",
                  onClick: backFn,
                  className: "p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors ml-1",
                  title: "Back to Showroom",
                  children: "✕"
                })
              ]
            })
          ]
        })
      }),

      /* ========================================================================= */
      /* 2. HERO SHOWCASE SECTION (SCREENSHOT 532) */
      /* ========================================================================= */
      T.jsxs("section", {
        className: "relative w-full bg-[#162330] text-white overflow-hidden pt-10 pb-16 sm:pb-24 select-none",
        children: [
          /* Top Description & 'Know More' pill button */
          T.jsxs("div", {
            className: "max-w-4xl mx-auto px-4 text-center space-y-5 mb-10 sm:mb-14",
            children: [
              T.jsx("p", {
                className: "text-sm sm:text-base text-white/80 leading-relaxed font-normal max-w-2xl mx-auto",
                children: (currentCar.description || "Experience supreme prestige, handcrafted luxury, and commanding engineering. Handpicked exclusively for our flagship showroom in Nairobi, Kenya.")
              }),
              T.jsx("div", {
                className: "flex justify-center",
                children: T.jsx("button", {
                  type: "button",
                  onClick: () => scrollToSection("design-aerodynamics"),
                  className: "px-8 py-2.5 rounded-full border border-white/40 hover:border-white text-white text-xs sm:text-sm font-semibold tracking-wider hover:bg-white hover:text-[#162330] transition-all duration-300 shadow-sm cursor-pointer",
                  children: "Know More"
                })
              })
            ]
          }),

          /* Main Car Display Stage with Asymmetrical Left Podium Card */
          T.jsx("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative",
            children: T.jsxs("div", {
              className: "relative flex flex-col lg:flex-row items-center justify-between min-h-[380px] sm:min-h-[440px]",
              children: [
                /* Left Podium Card with Asymmetric Curve */
                T.jsxs("div", {
                  className: "w-full lg:w-[480px] bg-[#202E3F]/90 backdrop-blur-md p-6 sm:p-8 rounded-tl-[70px] sm:rounded-tl-[90px] rounded-bl-3xl rounded-tr-3xl lg:rounded-tr-none rounded-br-3xl lg:rounded-br-none border-t border-l border-white/10 shadow-2xl space-y-6 z-10",
                  children: [
                    /* Car Model Title */
                    T.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        T.jsx("h2", {
                          className: "text-2xl sm:text-3xl font-extrabold text-white tracking-tight",
                          children: fullName
                        }),
                        T.jsx("p", {
                          className: "text-xs font-mono font-bold text-[#C59B51] uppercase tracking-wider",
                          children: formattedPrice
                        })
                      ]
                    }),

                    /* 3 Specs Separated by Vertical Divider Lines */
                    T.jsxs("div", {
                      className: "grid grid-cols-3 gap-3 pt-4 border-t border-white/15",
                      children: [
                        /* Stat 1: Torque / Power */
                        T.jsxs("div", {
                          className: "pr-2 border-r border-white/20",
                          children: [
                            T.jsx("h3", { className: "text-lg sm:text-2xl font-black text-white leading-tight", children: torqueVal }),
                            T.jsx("p", { className: "text-[11px] sm:text-xs text-white/60 font-medium uppercase mt-0.5", children: "Torque" })
                          ]
                        }),
                        /* Stat 2: 0-100 km/h */
                        T.jsxs("div", {
                          className: "px-2 border-r border-white/20",
                          children: [
                            T.jsx("h3", { className: "text-lg sm:text-2xl font-black text-white leading-tight", children: accelVal }),
                            T.jsx("p", { className: "text-[11px] sm:text-xs text-white/60 font-medium uppercase mt-0.5", children: "0-100 km/h" })
                          ]
                        }),
                        /* Stat 3: Max Speed */
                        T.jsxs("div", {
                          className: "pl-2",
                          children: [
                            T.jsx("h3", { className: "text-lg sm:text-2xl font-black text-white leading-tight", children: maxSpeedVal }),
                            T.jsx("p", { className: "text-[11px] sm:text-xs text-white/60 font-medium uppercase mt-0.5", children: "Max Speed" })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                /* The Vehicle Foreground Image */
                T.jsx("div", {
                  className: "w-full lg:w-[720px] xl:w-[820px] flex items-center justify-center -mt-6 lg:-mt-0 lg:-ml-14 z-20 cursor-pointer",
                  onClick: () => setLightboxImg(rawImages[0]),
                  title: "Click to Enlarge " + fullName,
                  children: T.jsx("img", {
                    src: rawImages[0],
                    alt: fullName,
                    className: "max-h-[320px] sm:max-h-[420px] lg:max-h-[480px] w-auto object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] transition-all duration-500",
                    style: { transform: "none" }
                  })
                })
              ]
            })
          }),

          /* Left Semi-Circle Carousel Arrow */
          T.jsx("button", {
            type: "button",
            onClick: handlePrevCar,
            style: {
              position: "absolute",
              left: 0,
              top: "60%",
              transform: "translateY(-50%)",
              width: "46px",
              height: "92px",
              borderTopRightRadius: "46px",
              borderBottomRightRadius: "46px",
              backgroundColor: "rgba(255, 255, 255, 0.22)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              cursor: "pointer",
              zIndex: 30,
              border: "none"
            },
            className: "hover:bg-white/35 transition-colors text-2xl font-bold select-none",
            "aria-label": "Previous featured car",
            children: "‹"
          }),

          /* Right Semi-Circle Carousel Arrow */
          T.jsx("button", {
            type: "button",
            onClick: handleNextCar,
            style: {
              position: "absolute",
              right: 0,
              top: "60%",
              transform: "translateY(-50%)",
              width: "46px",
              height: "92px",
              borderTopLeftRadius: "46px",
              borderBottomLeftRadius: "46px",
              backgroundColor: "rgba(255, 255, 255, 0.22)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              cursor: "pointer",
              zIndex: 30,
              border: "none"
            },
            className: "hover:bg-white/35 transition-colors text-2xl font-bold select-none",
            "aria-label": "Next featured car",
            children: "›"
          }),

          /* Bottom Slider Progress Indicator Line */
          T.jsx("div", {
            className: "w-full flex items-center justify-center mt-8 gap-2",
            children: activeList.map((_, dotIdx) => {
              const isCur = dotIdx === activeCarIdx;
              return T.jsx("button", {
                key: dotIdx,
                type: "button",
                onClick: () => {
                  setActiveCarIdx(dotIdx);
                  const carItem = activeList[dotIdx];
                  if (carItem && carItem.id) {
                    try { window.history.pushState({}, "", "/?featured=" + carItem.id); } catch (_) {}
                  }
                },
                className: "h-1.5 rounded-full transition-all duration-300 cursor-pointer " + (
                  isCur ? "w-12 bg-white" : "w-6 bg-white/30 hover:bg-white/60"
                ),
                "aria-label": "Select car " + (dotIdx + 1)
              });
            })
          })
        ]
      }),

      /* ========================================================================= */
      /* 3. SECTION 2: DESIGN AND AERODYNAMICS (SCREENSHOT 533) */
      /* ========================================================================= */
      T.jsx("section", {
        id: "design-aerodynamics",
        className: "py-20 sm:py-24 bg-white overflow-hidden",
        children: T.jsx("div", {
          className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          children: T.jsxs("div", {
            className: "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center",
            children: [
              /* Left Column: Slanted Exterior Car Image */
              T.jsx("div", {
                className: "lg:col-span-7 relative cursor-pointer group",
                onClick: () => setLightboxImg(rawImages[1] || rawImages[0]),
                children: T.jsx("div", {
                  className: "overflow-hidden shadow-2xl relative",
                  style: {
                    clipPath: "polygon(0 0, 92% 0, 100% 100%, 0 100%)",
                    minHeight: "360px",
                    height: "420px"
                  },
                  children: T.jsx("img", {
                    src: rawImages[1] || rawImages[0],
                    alt: fullName + " Design",
                    className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                  })
                })
              }),

              /* Right Column: Design and Aerodynamics Copy */
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
              })
            ]
          })
        })
      }),

      /* ========================================================================= */
      /* 4. SECTION 3: PERFORMANCE (SCREENSHOT 534) */
      /* ========================================================================= */
      T.jsx("section", {
        id: "performance-section",
        className: "py-20 sm:py-24 bg-white overflow-hidden border-t border-gray-100",
        children: T.jsx("div", {
          className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          children: T.jsxs("div", {
            className: "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center",
            children: [
              /* Left Column: Performance Copy */
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
              }),

              /* Right Column: Slanted Interior / Cockpit Car Image */
              T.jsx("div", {
                className: "lg:col-span-7 relative cursor-pointer group order-1 lg:order-2",
                onClick: () => setLightboxImg(rawImages[2] || rawImages[0]),
                children: T.jsx("div", {
                  className: "overflow-hidden shadow-2xl relative",
                  style: {
                    clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0 100%)",
                    minHeight: "360px",
                    height: "420px"
                  },
                  children: T.jsx("img", {
                    src: rawImages[2] || rawImages[0],
                    alt: fullName + " Interior Cockpit",
                    className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                  })
                })
              })
            ]
          })
        })
      }),

      /* ========================================================================= */
      /* 5. SECTION 4: 360 DEGREE CAR VIEW (SCREENSHOT 535) */
      /* ========================================================================= */
      T.jsxs("section", {
        id: "360-view-section",
        className: "py-20 sm:py-24 bg-white border-t border-gray-100",
        children: [
          /* Centered Header */
          T.jsxs("div", {
            className: "max-w-4xl mx-auto px-4 text-center space-y-3 mb-10",
            children: [
              T.jsxs("div", {
                className: "flex flex-col items-center justify-center space-y-1.5 mb-2",
                children: [
                  T.jsx("span", {
                    className: "text-xs font-bold tracking-[0.2em] text-gray-800 uppercase block",
                    children: "360 DEGREE CAR VIEW"
                  }),
                  T.jsx("div", { className: "w-9 h-[2.5px] bg-black" })
                ]
              }),
              T.jsx("h2", {
                className: "text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight",
                children: "Explore Every Angle"
              }),
              T.jsx("p", {
                className: "text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed",
                children: "Experience our 360-degree view feature and get a closer look at every aspect of your dream car"
              })
            ]
          }),

          /* Interactive 360 Viewing Arena */
          T.jsx("div", {
            className: "max-w-5xl mx-auto px-4 sm:px-6",
            children: T.jsxs("div", {
              className: "bg-[#F7F8FA] rounded-3xl p-6 sm:p-10 relative border border-gray-200/60 shadow-inner flex flex-col items-center justify-center min-h-[460px] sm:min-h-[520px] select-none cursor-grab active:cursor-grabbing",
              onMouseDown: handleMouseDown,
              onMouseMove: handleMouseMove,
              onMouseUp: handleMouseUp,
              onTouchStart: handleMouseDown,
              onTouchMove: handleMouseMove,
              onTouchEnd: handleMouseUp,
              children: [
                /* Active 360 Perspective Image */
                T.jsx("img", {
                  src: rawImages[angleIdx % rawImages.length],
                  alt: fullName + " Angle " + ((angleIdx % rawImages.length) + 1),
                  className: "max-h-[360px] sm:max-h-[420px] w-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-opacity duration-200",
                  style: { transform: "none" }
                }),

                /* 360 Degree Rotator Floating Badge */
                T.jsxs("div", {
                  className: "absolute top-6 right-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-gray-200 text-xs font-mono font-bold text-gray-800",
                  children: [
                    T.jsx("span", { className: "animate-spin text-sm", children: "↻" }),
                    T.jsxs("span", { children: ["Angle ", (angleIdx % rawImages.length) + 1, " / ", rawImages.length] })
                  ]
                }),

                /* Bottom Interactive Controls */
                T.jsxs("div", {
                  className: "absolute bottom-6 inset-x-0 flex flex-col items-center justify-center gap-3",
                  children: [
                    T.jsx("span", {
                      className: "text-xs font-mono uppercase tracking-wider text-gray-500 font-bold",
                      children: "← Drag or Click to Spin 360° →"
                    }),
                    /* Angle Selector Pills */
                    T.jsx("div", {
                      className: "flex items-center gap-2",
                      children: rawImages.map((_, aIdx) => {
                        const isCurAngle = aIdx === (angleIdx % rawImages.length);
                        return T.jsx("button", {
                          key: aIdx,
                          type: "button",
                          onClick: (e) => {
                            e.stopPropagation();
                            setAngleIdx(aIdx);
                          },
                          className: "h-2 transition-all duration-300 rounded-full cursor-pointer " + (
                            isCurAngle ? "w-8 bg-black" : "w-2.5 bg-gray-300 hover:bg-gray-500"
                          ),
                          "aria-label": "Angle " + (aIdx + 1)
                        });
                      })
                    })
                  ]
                })
              ]
            })
          })
        ]
      }),

      /* ========================================================================= */
      /* 6. TECHNICAL DOSSIER & PROVENANCE SPECIFICATIONS SECTION */
      /* ========================================================================= */
      T.jsx("section", {
        id: "specifications-section",
        className: "py-20 sm:py-24 bg-[#F8F9FA] border-t border-gray-200/80",
        children: T.jsxs("div", {
          className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12",
          children: [
            /* Section Header */
            T.jsxs("div", {
              className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6",
              children: [
                T.jsxs("div", {
                  className: "space-y-1",
                  children: [
                    T.jsx("span", { className: "text-xs font-bold tracking-[0.2em] text-[#C59B51] uppercase", children: "CERTIFIED PROVENANCE" }),
                    T.jsx("h2", { className: "text-2xl sm:text-4xl font-extrabold text-gray-900 uppercase", children: "Technical Dossier & Provenance" })
                  ]
                }),
                T.jsx("a", {
                  href: whatsappCarUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md self-start sm:self-auto",
                  children: "Inquire via WhatsApp"
                })
              ]
            }),

            /* 2-Column Grid: Specifications (Left) & Executive Provenance Highlights (Right) */
            T.jsxs("div", {
              className: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start",
              children: [
                /* Left Column: 9 Specifications */
                T.jsx("div", {
                  className: "lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5",
                  children: [
                    { label: "Make & Model", val: fullName },
                    { label: "Production Year", val: currentCar.year || "2021" },
                    { label: "Body Classification", val: bodyType },
                    { label: "Fuel Type", val: currentCar.fuel || "Diesel" },
                    { label: "Transmission", val: currentCar.transmission || "Automatic" },
                    { label: "Drivetrain", val: (currentCar.specifications && currentCar.specifications.drivetrain) || "All-Wheel Drive (AWD)" },
                    { label: "Exterior Paint", val: (currentCar.specifications && currentCar.specifications.exteriorPaint) || "Metallic Factory Finish" },
                    { label: "Interior Trim", val: (currentCar.specifications && currentCar.specifications.interiorTrim) || "Full Premium Nappa Leather" },
                    { label: "Import Status", val: (currentCar.specifications && currentCar.specifications.importStatus) || "Duty & Clearance Settled" }
                  ].map((item, idx) => T.jsxs("div", {
                    key: idx,
                    className: "bg-white p-4.5 rounded-2xl border border-gray-200/70 flex flex-col justify-between shadow-xs " + (idx === 8 ? "sm:col-span-2" : ""),
                    children: [
                      T.jsx("span", { className: "text-xs font-mono uppercase font-bold text-gray-400 mb-1", children: item.label }),
                      T.jsx("span", { className: "text-sm sm:text-base font-extrabold text-gray-900 leading-snug", children: item.val })
                    ]
                  }))
                }),

                /* Right Column: Executive Provenance Card */
                T.jsxs("div", {
                  className: "lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-amber-200/70 shadow-sm space-y-4",
                  children: [
                    T.jsxs("div", {
                      className: "flex items-center justify-between border-b border-gray-100 pb-3",
                      children: [
                        T.jsx("span", { className: "text-xs font-mono font-bold uppercase text-[#C59B51]", children: "Executive Provenance" }),
                        T.jsx("span", { className: "px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold rounded-full", children: "Verified" })
                      ]
                    }),
                    T.jsx("p", {
                      className: "text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-line",
                      children: (currentCar.specifications && currentCar.specifications.extraInfo) || currentCar.extraInfo || currentCar.description || "Certified handpicked prestige import. Full official documentation, pristine mechanical inspection, and executive provenance verified."
                    }),
                    T.jsxs("div", {
                      className: "pt-2 border-t border-gray-100 space-y-2",
                      children: [
                        "✓ Direct Executive Import — Handpicked Quality",
                        "✓ Complete Kenya Customs Duty & Taxes Settled",
                        "✓ Verified Official Service Records & Physical Inspection"
                      ].map((t, idx) => T.jsx("p", { key: idx, className: "text-xs font-semibold text-gray-600", children: t }))
                    }),
                    T.jsx("a", {
                      href: youtubeUrl,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "block text-center py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm mt-3",
                      children: "▶ Watch Video Walkaround"
                    })
                  ]
                })
              ]
            })
          ]
        })
      }),

      /* ========================================================================= */
      /* 7. FLOATING SCROLL TO TOP BUTTON (BLUE SQUARE WITH DOUBLE CHEVRON) */
      /* ========================================================================= */
      T.jsx("button", {
        type: "button",
        onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        style: {
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "44px",
          height: "44px",
          backgroundColor: "#2563EB",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          zIndex: 90,
          cursor: "pointer",
          boxShadow: "0 6px 16px rgba(37, 99, 235, 0.45)",
          border: "none"
        },
        className: "hover:bg-blue-700 transition-all hover:scale-105 select-none",
        "aria-label": "Scroll to top",
        children: T.jsx("svg", {
          viewBox: "0 0 24 24",
          width: 22,
          height: 22,
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2.5,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: T.jsxs("g", {
            children: [
              T.jsx("polyline", { points: "18 15 12 9 6 15" }),
              T.jsx("polyline", { points: "18 9 12 3 6 9" })
            ]
          })
        })
      }),

      /* Lightbox Modal */
      lightboxImg && T.jsxs("div", {
        className: "fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4",
        onClick: () => setLightboxImg(null),
        children: [
          T.jsx("button", {
            type: "button",
            onClick: () => setLightboxImg(null),
            className: "absolute top-6 right-6 text-white text-3xl font-light hover:text-gray-300 cursor-pointer z-10",
            children: "✕"
          }),
          T.jsx("img", {
            src: lightboxImg,
            alt: fullName,
            className: "max-h-[90vh] max-w-[95vw] object-contain select-none"
          })
        ]
      })
    ]
  });
}
`;

js = js.substring(0, startIdx) + newFLPageComponent + js.substring(endIdx);
console.log("Replaced FLPage with new screenshot-matching layout!");

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
