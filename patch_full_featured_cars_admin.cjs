const fs = require('fs');

const jsPath = 'assets/index-BIZlWqQ7.js';
let js = fs.readFileSync(jsPath, 'utf8');

// 1. Locate FeaturedCarsAdminStudio start and okStart
const studioStart = js.indexOf("function FeaturedCarsAdminStudio");
const okStart = js.indexOf("function ok(");

if (studioStart === -1 || okStart === -1) {
  console.error("Could not find boundaries:", { studioStart, okStart });
  process.exit(1);
}

const newStudioImplementation = `function FeaturedCarsAdminStudio({ onPreview, inventoryCars = [] }) {
  const [customCars, setCustomCars] = Fe.useState(() => getCustomFeaturedCars());
  const [activeCarId, setActiveCarId] = Fe.useState(() => {
    const initial = getCustomFeaturedCars();
    return (initial && initial.length > 0) ? initial[0].id : null;
  });
  const [newFeatureText, setNewFeatureText] = Fe.useState("");
  const [saveToast, setSaveToast] = Fe.useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = Fe.useState(null);
  const [showInventoryModal, setShowInventoryModal] = Fe.useState(false);
  const [inventorySearch, setInventorySearch] = Fe.useState("");
  const [showArchivedDefaults, setShowArchivedDefaults] = Fe.useState(false);
  const fileInputRef = Fe.useRef(null);
  const slotFileInputRef = Fe.useRef(null);
  const [targetUploadIndex, setTargetUploadIndex] = Fe.useState(0);

  const activeCar = customCars.find(c => c.id === activeCarId) || customCars[0] || null;

  const activeStyles = (activeCar && activeCar.styles) || {
    featuresBg: "#000F1E",
    titleBarBg: "#000F1E",
    accentColor: "#C59B51"
  };

  const activeFeatures = (activeCar && activeCar.features && activeCar.features.length)
    ? activeCar.features
    : DEFAULT_FEATURE_EQUIPMENT_LIST;

  const activeSpecs = (activeCar && activeCar.specifications) || {
    drivetrain: "Intelligent All-Wheel Drive (AWD)",
    exteriorPaint: "Metallic Factory Finish",
    interiorTrim: "Full Premium Nappa Leather",
    importStatus: "Duty & Clearance Settled",
    extraInfo: (activeCar && activeCar.description) || ""
  };

  const updateActiveCar = (updater) => {
    if (!activeCarId) return;
    setCustomCars(prev => prev.map(c => {
      if (c.id === activeCarId) {
        return updater(c);
      }
      return c;
    }));
  };

  const persistChanges = (updatedList, toastMsg = "Featured cars updated and applied to the live showroom!") => {
    try {
      localStorage.setItem("mrjoseph_custom_featured_cars", JSON.stringify(updatedList));
      if (typeof resolveActiveFeaturedCars === "function") {
        SIX_SCREENSHOT_CARS = resolveActiveFeaturedCars();
      }
      setSaveToast(toastMsg);
      setTimeout(() => setSaveToast(null), 4000);
    } catch (e) {
      alert("Error saving: " + e.message);
    }
  };

  const handleSave = () => {
    persistChanges(customCars, "All featured vehicle changes saved successfully!");
  };

  // 1. DELETE FEATURE (ZERO window.confirm to avoid iframe sandbox blocking!)
  const handleDeleteCar = (idToDelete) => {
    const carToDelete = customCars.find(c => c.id === idToDelete);
    const carName = carToDelete ? (carToDelete.make + " " + carToDelete.model) : "Featured vehicle";
    const updated = customCars.filter(c => c.id !== idToDelete);
    setCustomCars(updated);
    setActiveCarId(updated.length > 0 ? updated[0].id : null);
    setDeleteConfirmId(null);
    persistChanges(updated, carName + " deleted. Default vehicle restored to slot.");
  };

  // 2. ADD FROM INVENTORY / ADDED VEHICLES
  const allInventoryList = (inventoryCars && inventoryCars.length > 0)
    ? inventoryCars
    : (typeof DEFAULT_PREVIOUS_CARS !== "undefined" ? DEFAULT_PREVIOUS_CARS : []);

  const handleSelectFromInventory = (invCar) => {
    const newId = "featured-" + (invCar.id || Date.now());
    const existingImgs = (invCar.images && invCar.images.length > 0)
      ? invCar.images
      : (invCar.image ? [invCar.image] : ["/images/hero_showroom.jpg"]);
    
    // Ensure 6 studio images slots
    let filledImgs = [...existingImgs];
    while (filledImgs.length < 6) {
      filledImgs.push(existingImgs[0] || "/images/hero_showroom.jpg");
    }
    filledImgs = filledImgs.slice(0, 6);

    const newFeaturedCar = {
      id: newId,
      make: invCar.make || "Prestige",
      model: invCar.model || "Edition",
      year: invCar.year || 2023,
      price: invCar.price || 0,
      mileage: invCar.mileage || "35,000 km",
      fuel: invCar.fuel || "Diesel",
      transmission: invCar.transmission || "Automatic",
      type: invCar.type || "Prestige SUV",
      location: invCar.location || "Kiambu Road, Ridgeways",
      status: invCar.status || "Available",
      description: invCar.description || "",
      image: filledImgs[0],
      images: filledImgs,
      features: (invCar.features && invCar.features.length) ? invCar.features : [...DEFAULT_FEATURE_EQUIPMENT_LIST],
      styles: { featuresBg: "#000F1E", titleBarBg: "#000F1E", accentColor: "#C59B51" },
      specifications: {
        drivetrain: invCar.drivetrain || "Intelligent All-Wheel Drive (AWD)",
        exteriorPaint: invCar.exteriorPaint || "Metallic Factory Finish",
        interiorTrim: invCar.interiorTrim || "Full Premium Nappa Leather",
        importStatus: invCar.importStatus || "Duty & Clearance Settled",
        extraInfo: invCar.description || "Certified handpicked prestige import."
      },
      videoUrl: invCar.videoUrl || ""
    };

    const updated = [...customCars, newFeaturedCar];
    setCustomCars(updated);
    setActiveCarId(newId);
    setShowInventoryModal(false);
    persistChanges(updated, "Added " + invCar.make + " " + invCar.model + " to Featured Cars!");
  };

  // 3. ADD FROM SCRATCH / TEMPLATE
  const handleAddNewCar = () => {
    const newId = "featured-" + Date.now();
    const slotNum = customCars.length + 1;
    const templateCar = {
      id: newId,
      make: "Prestige",
      model: "Custom Edition " + slotNum,
      year: 2024,
      price: 14500000,
      mileage: "25,000 km",
      fuel: "Diesel",
      transmission: "Automatic",
      type: "Prestige SUV",
      location: "Kiambu Road, Ridgeways",
      status: "Available",
      description: "Elite prestige motorcar configured with bespoke craftsmanship.",
      image: "/images/2019-Mercedes-Benz-GLE-450-4MATIC-WITH-EQ-BOOST-DEAL-OF-THE-WEEK-EXECUTIVE-PERFORMANCE-SUV.jpg",
      images: [
        "/images/2019-Mercedes-Benz-GLE-450-4MATIC-WITH-EQ-BOOST-DEAL-OF-THE-WEEK-EXECUTIVE-PERFORMANCE-SUV.jpg",
        "/images/CLgKgL1M_2019-Mercedes-Benz-GLE-450-4MATIC-WITH-EQ-BOOST-DEAL-OF-THE-WEEK-EXECUTIVE-PERFORMANCE-SUV.jpg",
        "/images/CLsxLTBh_2019-Mercedes-Benz-GLE-450-4MATIC-WITH-EQ-BOOST-DEAL-OF-THE-WEEK-EXECUTIVE-PERFORMANCE-SUV.jpg",
        "/images/DyTzTyZv_2019-Mercedes-Benz-GLE-450-4MATIC-WITH-EQ-BOOST-DEAL-OF-THE-WEEK-EXECUTIVE-PERFORMANCE-SUV.jpg",
        "/images/xT2d2TCk_2019-Mercedes-Benz-GLE-450-4MATIC-WITH-EQ-BOOST-DEAL-OF-THE-WEEK-EXECUTIVE-PERFORMANCE-SUV.jpg",
        "/images/tCjgjCTJ_2019-Mercedes-Benz-GLE-450-4MATIC-WITH-EQ-BOOST-DEAL-OF-THE-WEEK-EXECUTIVE-PERFORMANCE-SUV.jpg"
      ],
      features: [...DEFAULT_FEATURE_EQUIPMENT_LIST],
      styles: { featuresBg: "#000F1E", titleBarBg: "#000F1E", accentColor: "#C59B51" },
      specifications: {
        drivetrain: "Intelligent All-Wheel Drive (AWD)",
        exteriorPaint: "Metallic Factory Finish",
        interiorTrim: "Full Premium Nappa Leather",
        importStatus: "Duty & Clearance Settled",
        extraInfo: "Certified handpicked prestige import."
      },
      videoUrl: ""
    };

    const updated = [...customCars, templateCar];
    setCustomCars(updated);
    setActiveCarId(newId);
    persistChanges(updated, "Created new featured car slot!");
  };

  // 4. LOCAL STORAGE / DEVICE IMAGE UPLOAD
  const handleLocalImageUpload = (e, slotIdx = null) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !activeCar) return;

    files.forEach((file, fIdx) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            }
          } else {
            if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL("image/webp", 0.8) || canvas.toDataURL("image/jpeg", 0.8);
            updateActiveCar(c => {
              const currentImgs = (c.images && c.images.length) ? [...c.images] : [];
              while (currentImgs.length < 6) {
                currentImgs.push(currentImgs[0] || dataUrl);
              }
              const targetSlot = (slotIdx !== null) ? slotIdx : Math.min(fIdx, 5);
              currentImgs[targetSlot] = dataUrl;
              return {
                ...c,
                images: currentImgs,
                image: currentImgs[0] || c.image || dataUrl
              };
            });
          }
        };
        img.src = loadEvent.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const addFeature = () => {
    const text = newFeatureText.trim();
    if (!text || !activeCar) return;
    updateActiveCar(c => ({
      ...c,
      features: [...activeFeatures, text]
    }));
    setNewFeatureText("");
  };

  const removeFeature = (idx) => {
    if (!activeCar) return;
    updateActiveCar(c => ({
      ...c,
      features: activeFeatures.filter((_, i) => i !== idx)
    }));
  };

  const presetColors = ["#000F1E", "#0D0D12", "#0A0A0F", "#0F1E36", "#161622", "#FFFFFF"];
  const presetAccents = ["#C59B51", "#2563EB", "#FF0000", "#25D366", "#D97706", "#9333EA"];

  const customCount = customCars.length;
  const defaultRemaining = Math.max(0, 5 - customCount);

  // Filtered inventory for modal
  const filteredInventory = allInventoryList.filter(c => {
    if (!inventorySearch) return true;
    const term = inventorySearch.toLowerCase();
    const fullName = ((c.make || "") + " " + (c.model || "")).toLowerCase();
    return fullName.includes(term) || (c.year && c.year.toString().includes(term));
  });

  return T.jsxs("div", {
    className: "animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8 relative",
    children: [
      /* Hidden File Input for Multiple Uploads */
      T.jsx("input", {
        ref: fileInputRef,
        type: "file",
        multiple: !0,
        accept: "image/*",
        style: { display: "none" },
        onChange: (e) => handleLocalImageUpload(e)
      }),
      /* Hidden File Input for Single Slot Upload */
      T.jsx("input", {
        ref: slotFileInputRef,
        type: "file",
        accept: "image/*",
        style: { display: "none" },
        onChange: (e) => handleLocalImageUpload(e, targetUploadIndex)
      }),

      /* MODAL: SELECT FROM ADDED VEHICLES (INVENTORY) */
      showInventoryModal && T.jsx("div", {
        className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4",
        onClick: () => setShowInventoryModal(false),
        children: T.jsxs("div", {
          className: "bg-[#161620] border border-white/15 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* Modal Header */
            T.jsxs("div", {
              className: "p-6 border-b border-white/10 flex items-center justify-between",
              children: [
                T.jsxs("div", {
                  children: [
                    T.jsx("h3", { className: "text-xl font-bold text-white", children: "Select from Added Vehicles" }),
                    T.jsx("p", { className: "text-xs text-white/50", children: "Choose an existing vehicle from your showroom inventory to feature." })
                  ]
                }),
                T.jsx("button", {
                  type: "button",
                  onClick: () => setShowInventoryModal(false),
                  className: "w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer",
                  children: "✕"
                })
              ]
            }),

            /* Search Bar */
            T.jsx("div", {
              className: "p-4 border-b border-white/10 bg-black/20",
              children: T.jsx("input", {
                type: "text",
                placeholder: "Search make, model, year in inventory...",
                value: inventorySearch,
                onChange: (e) => setInventorySearch(e.target.value),
                className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#C59B51]"
              })
            }),

            /* Cars Grid in Modal */
            T.jsx("div", {
              className: "p-6 overflow-y-auto space-y-3 flex-1",
              children: filteredInventory.length === 0 ? T.jsx("div", {
                className: "text-center py-12 text-white/40 text-sm",
                children: "No inventory vehicles found matching search."
              }) : T.jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5",
                children: filteredInventory.map(inv => {
                  const cover = (inv.images && inv.images[0]) || inv.image || "/images/hero_showroom.jpg";
                  const priceStr = inv.price ? "KSh " + Number(inv.price).toLocaleString() : "Price on App";
                  return T.jsxs("div", {
                    key: inv.id,
                    className: "bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col justify-between gap-3 hover:border-[#C59B51] hover:bg-white/10 transition-all",
                    children: [
                      T.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          T.jsx("div", {
                            className: "w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/40",
                            children: T.jsx("img", { src: cover, alt: inv.make, className: "w-full h-full object-cover" })
                          }),
                          T.jsxs("div", {
                            children: [
                              T.jsx("span", { className: "text-xs font-mono text-[#C59B51] font-bold block", children: inv.year || "2023" }),
                              T.jsx("h4", { className: "text-sm font-bold text-white line-clamp-1", children: inv.make + " " + inv.model }),
                              T.jsx("p", { className: "text-xs text-white/50 font-mono", children: priceStr })
                            ]
                          })
                        ]
                      }),
                      T.jsxs("button", {
                        type: "button",
                        onClick: () => handleSelectFromInventory(inv),
                        className: "w-full py-2 bg-[#C59B51] hover:bg-[#B38A40] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm",
                        children: ["Feature This Car", T.jsx("span", { children: "→" })]
                      })
                    ]
                  });
                })
              })
            })
          ]
        })
      }),

      /* Top Header & Slot Status Tracker */
      T.jsxs("div", {
        className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6",
        children: [
          T.jsxs("div", {
            children: [
              T.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  T.jsx("div", { className: "w-2.5 h-7 bg-[#C59B51] rounded-xs" }),
                  T.jsx("h3", {
                    className: "text-2xl sm:text-3xl font-serif text-white tracking-tight",
                    children: "Featured Cars Management"
                  })
                ]
              }),
              /* Slot Status Pill */
              T.jsxs("div", {
                className: "flex items-center gap-2 mt-2 flex-wrap",
                children: [
                  T.jsxs("span", {
                    className: "text-xs font-mono px-3 py-1 rounded-full font-bold " + (
                      customCount >= 5
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : customCount > 0
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    ),
                    children: [
                      customCount >= 5
                        ? "All 5 Custom Slots Active (Defaults Completely Replaced)"
                        : customCount > 0
                        ? customCount + " of 5 Custom Slots Active (" + defaultRemaining + " Default Fallback" + (defaultRemaining > 1 ? "s" : "") + " Visible)"
                        : "0 of 5 Custom Slots Active (5 Default Fallbacks Visible)"
                    ]
                  }),
                  T.jsx("span", {
                    className: "text-xs text-white/40",
                    children: "• Factory defaults archived from active list"
                  })
                ]
              })
            ]
          }),

          /* Action Buttons */
          T.jsxs("div", {
            className: "flex items-center gap-2.5 flex-wrap",
            children: [
              /* Button to select from added inventory vehicles */
              T.jsxs("button", {
                type: "button",
                onClick: () => setShowInventoryModal(true),
                className: "px-4 py-2.5 bg-[#C59B51] hover:bg-[#B38A40] text-black rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer",
                children: [
                  T.jsx("span", { className: "text-sm", children: "🚗" }),
                  "Select from Added Vehicles"
                ]
              }),
              /* Button to create blank template car */
              T.jsxs("button", {
                type: "button",
                onClick: handleAddNewCar,
                className: "px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-white/10",
                children: [
                  T.jsx("span", { className: "text-sm", children: "+" }),
                  "Add Blank Car"
                ]
              }),
              activeCar && T.jsx("button", {
                type: "button",
                onClick: () => {
                  try {
                    window.history.pushState({}, "", "/?featured=" + activeCarId);
                  } catch (_) {}
                  window.location.hash = "featured-" + activeCarId;
                  window.dispatchEvent(new Event("popstate"));
                  window.dispatchEvent(new Event("hashchange"));
                  window.scrollTo(0, 0);
                },
                className: "px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-white/10",
                children: ["Preview", T.jsx("span", { children: "↗" })]
              }),
              customCars.length > 0 && T.jsx("button", {
                type: "button",
                onClick: handleSave,
                className: "px-5 py-2.5 bg-white text-black hover:bg-gray-100 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all shadow-md cursor-pointer",
                children: "Save Changes"
              })
            ]
          })
        ]
      }),

      /* Save Toast Alert */
      saveToast && T.jsxs("div", {
        className: "p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-emerald-300 text-sm font-semibold animate-in fade-in",
        children: [
          T.jsxs("div", {
            className: "flex items-center gap-3",
            children: [
              T.jsx("span", { className: "text-lg", children: "✓" }),
              saveToast
            ]
          }),
          T.jsx("button", {
            onClick: () => setSaveToast(null),
            className: "text-emerald-300 hover:text-white text-xs font-bold uppercase",
            children: "Dismiss"
          })
        ]
      }),

      /* EMPTY STATE */
      customCars.length === 0 ? T.jsxs("div", {
        className: "bg-black/40 border border-white/10 p-10 sm:p-14 rounded-3xl text-center space-y-6 max-w-2xl mx-auto my-8",
        children: [
          T.jsx("div", {
            className: "w-20 h-20 rounded-full bg-[#C59B51]/15 text-[#C59B51] flex items-center justify-center mx-auto text-3xl",
            children: "★"
          }),
          T.jsxs("div", {
            className: "space-y-2",
            children: [
              T.jsx("h4", {
                className: "text-2xl font-serif text-white",
                children: "No Custom Featured Cars Added Yet"
              }),
              T.jsx("p", {
                className: "text-sm text-white/60 leading-relaxed max-w-lg mx-auto",
                children: "The 5 factory default prestige vehicles are currently active as fallbacks on the public showroom. The default cars are archived from this list."
              }),
              T.jsx("p", {
                className: "text-xs text-[#C59B51] font-mono font-semibold",
                children: "Select any vehicle from your added inventory or add a fresh one. Each added car replaces one default vehicle."
              })
            ]
          }),
          T.jsxs("div", {
            className: "flex items-center justify-center gap-3 flex-wrap pt-2",
            children: [
              T.jsxs("button", {
                type: "button",
                onClick: () => setShowInventoryModal(true),
                className: "inline-flex items-center gap-2 px-6 py-3.5 bg-[#C59B51] hover:bg-[#B38A40] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer",
                children: [
                  T.jsx("span", { className: "text-base", children: "🚗" }),
                  "Select from Added Vehicles"
                ]
              }),
              T.jsxs("button", {
                type: "button",
                onClick: handleAddNewCar,
                className: "inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all border border-white/10 cursor-pointer",
                children: [
                  T.jsx("span", { className: "text-base", children: "+" }),
                  "Add Blank Car"
                ]
              })
            ]
          })
        ]
      }) :

      /* CUSTOM CARS ACTIVE */
      T.jsxs("div", {
        className: "space-y-8",
        children: [
          /* Custom Cars Selector Strip */
          T.jsxs("div", {
            className: "space-y-3",
            children: [
              T.jsxs("div", {
                className: "flex items-center justify-between",
                children: [
                  T.jsxs("span", {
                    className: "text-xs font-mono uppercase tracking-widest text-white/50 font-bold",
                    children: ["Active Featured Cars (", customCars.length, ")"]
                  }),
                  T.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      T.jsxs("button", {
                        type: "button",
                        onClick: () => setShowInventoryModal(true),
                        className: "text-xs font-bold text-[#C59B51] hover:underline flex items-center gap-1 cursor-pointer",
                        children: ["🚗 Select from Added Vehicles (Slot ", customCars.length + 1, ")"]
                      }),
                      T.jsxs("button", {
                        type: "button",
                        onClick: handleAddNewCar,
                        className: "text-xs font-bold text-white/50 hover:text-white flex items-center gap-1 cursor-pointer",
                        children: ["+ Blank"]
                      })
                    ]
                  })
                ]
              }),

              /* Selector Tabs */
              T.jsxs("div", {
                className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3",
                children: [
                  customCars.map((c, idx) => {
                    const isSelected = c.id === activeCarId;
                    const imgCover = (c.images && c.images[0]) || c.image || "";
                    return T.jsxs("div", {
                      key: c.id,
                      onClick: () => setActiveCarId(c.id),
                      className: "group relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 " + (
                        isSelected
                          ? "bg-[#C59B51]/15 border-[#C59B51] text-white shadow-lg ring-1 ring-[#C59B51]"
                          : "bg-black/30 border-white/5 text-white/60 hover:text-white hover:bg-white/5"
                      ),
                      children: [
                        T.jsxs("div", {
                          className: "relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black/40",
                          children: [
                            T.jsx("img", {
                              src: imgCover,
                              alt: c.make,
                              className: "w-full h-full object-cover"
                            }),
                            T.jsxs("span", {
                              className: "absolute top-1.5 left-1.5 px-2 py-0.5 bg-black/75 backdrop-blur-md rounded-md text-[9px] font-mono text-[#C59B51] font-bold uppercase",
                              children: ["Slot ", idx + 1]
                            })
                          ]
                        }),
                        T.jsxs("div", {
                          className: "flex items-center justify-between gap-1",
                          children: [
                            T.jsxs("div", {
                              className: "truncate",
                              children: [
                                T.jsx("span", {
                                  className: "text-xs font-mono uppercase text-[#C59B51] font-bold block",
                                  children: c.year || "2024"
                                }),
                                T.jsx("span", {
                                  className: "text-xs font-bold text-white line-clamp-1 block truncate",
                                  children: c.make + " " + c.model
                                })
                              ]
                            }),
                            /* Reliable Direct Delete Button on Tab */
                            T.jsx("button", {
                              type: "button",
                              onClick: (e) => {
                                e.stopPropagation();
                                handleDeleteCar(c.id);
                              },
                              className: "p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors text-sm shrink-0",
                              title: "Delete this featured car",
                              children: "✕"
                            })
                          ]
                        })
                      ]
                    });
                  }),
                  /* Add Button Slot */
                  T.jsxs("button", {
                    type: "button",
                    onClick: () => setShowInventoryModal(true),
                    className: "border border-dashed border-white/20 hover:border-[#C59B51] hover:bg-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-white/40 hover:text-[#C59B51] transition-all cursor-pointer min-h-[120px]",
                    children: [
                      T.jsx("span", { className: "text-2xl font-bold", children: "+" }),
                      T.jsxs("span", { className: "text-xs font-bold uppercase tracking-wider text-center", children: ["Add Slot ", customCars.length + 1] })
                    ]
                  })
                ]
              })
            ]
          }),

          /* ACTIVE CAR STUDIO EDITOR */
          activeCar && T.jsxs("div", {
            className: "space-y-6",
            children: [
              /* DELETE CONFIRMATION ALERT (INLINE, FOOLPROOF, ZERO window.confirm) */
              deleteConfirmId === activeCar.id && T.jsxs("div", {
                className: "p-5 bg-red-500/15 border border-red-500/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in",
                children: [
                  T.jsxs("div", {
                    className: "space-y-1 text-center sm:text-left",
                    children: [
                      T.jsx("h5", { className: "text-sm font-bold text-red-300", children: "Confirm Deletion of this Featured Vehicle?" }),
                      T.jsxs("p", {
                        className: "text-xs text-white/60",
                        children: [
                          "Deleting \\"", activeCar.make, " ", activeCar.model,
                          "\\" will remove it from featured slots and automatically restore the factory default vehicle."
                        ]
                      })
                    ]
                  }),
                  T.jsxs("div", {
                    className: "flex items-center gap-2.5 shrink-0",
                    children: [
                      T.jsx("button", {
                        type: "button",
                        onClick: () => handleDeleteCar(activeCar.id),
                        className: "px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md cursor-pointer transition-all",
                        children: "Yes, Delete Now"
                      }),
                      T.jsx("button", {
                        type: "button",
                        onClick: () => setDeleteConfirmId(null),
                        className: "px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer",
                        children: "Cancel"
                      })
                    ]
                  })
                ]
              }),

              /* 1. STYLES & COLOR PALETTE */
              T.jsxs("div", {
                className: "bg-black/40 border border-white/5 p-6 rounded-3xl space-y-5",
                children: [
                  T.jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [
                      T.jsxs("div", {
                        children: [
                          T.jsx("h4", { className: "text-lg font-bold text-white", children: "Theme & Section Colors" }),
                          T.jsx("p", { className: "text-xs text-white/40", children: "Configure background colors and accent styling for this featured car." })
                        ]
                      }),
                      T.jsxs("span", {
                        className: "text-xs font-mono text-[#C59B51] font-bold",
                        children: ["Editing: ", activeCar.make, " ", activeCar.model]
                      })
                    ]
                  }),

                  T.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                    children: [
                      /* Features Background */
                      T.jsxs("div", {
                        className: "space-y-2.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/60 font-bold block", children: "Features Section Background" }),
                          T.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [
                              T.jsx("input", {
                                type: "color",
                                value: activeStyles.featuresBg || "#000F1E",
                                onChange: (e) => updateActiveCar(c => ({
                                  ...c,
                                  styles: { ...activeStyles, featuresBg: e.target.value }
                                })),
                                className: "w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                              }),
                              T.jsx("input", {
                                type: "text",
                                value: activeStyles.featuresBg || "#000F1E",
                                onChange: (e) => updateActiveCar(c => ({
                                  ...c,
                                  styles: { ...activeStyles, featuresBg: e.target.value }
                                })),
                                className: "flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs uppercase"
                              })
                            ]
                          }),
                          T.jsx("div", {
                            className: "flex items-center gap-2 flex-wrap pt-1",
                            children: presetColors.map(col => T.jsx("button", {
                              key: col,
                              type: "button",
                              onClick: () => updateActiveCar(c => ({
                                ...c,
                                styles: { ...activeStyles, featuresBg: col }
                              })),
                              style: { backgroundColor: col },
                              className: "w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform cursor-pointer",
                              title: col
                            }))
                          })
                        ]
                      }),

                      /* Title Bar Background */
                      T.jsxs("div", {
                        className: "space-y-2.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/60 font-bold block", children: "Title Bar Background" }),
                          T.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [
                              T.jsx("input", {
                                type: "color",
                                value: activeStyles.titleBarBg || "#000F1E",
                                onChange: (e) => updateActiveCar(c => ({
                                  ...c,
                                  styles: { ...activeStyles, titleBarBg: e.target.value }
                                })),
                                className: "w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                              }),
                              T.jsx("input", {
                                type: "text",
                                value: activeStyles.titleBarBg || "#000F1E",
                                onChange: (e) => updateActiveCar(c => ({
                                  ...c,
                                  styles: { ...activeStyles, titleBarBg: e.target.value }
                                })),
                                className: "flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs uppercase"
                              })
                            ]
                          }),
                          T.jsx("div", {
                            className: "flex items-center gap-2 flex-wrap pt-1",
                            children: presetColors.map(col => T.jsx("button", {
                              key: col,
                              type: "button",
                              onClick: () => updateActiveCar(c => ({
                                ...c,
                                styles: { ...activeStyles, titleBarBg: col }
                              })),
                              style: { backgroundColor: col },
                              className: "w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform cursor-pointer",
                              title: col
                            }))
                          })
                        ]
                      }),

                      /* Accent Bar */
                      T.jsxs("div", {
                        className: "space-y-2.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/60 font-bold block", children: "Accent Highlight Color" }),
                          T.jsxs("div", {
                            className: "flex items-center gap-3",
                            children: [
                              T.jsx("input", {
                                type: "color",
                                value: activeStyles.accentColor || "#C59B51",
                                onChange: (e) => updateActiveCar(c => ({
                                  ...c,
                                  styles: { ...activeStyles, accentColor: e.target.value }
                                })),
                                className: "w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                              }),
                              T.jsx("input", {
                                type: "text",
                                value: activeStyles.accentColor || "#C59B51",
                                onChange: (e) => updateActiveCar(c => ({
                                  ...c,
                                  styles: { ...activeStyles, accentColor: e.target.value }
                                })),
                                className: "flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-xs uppercase"
                              })
                            ]
                          }),
                          T.jsx("div", {
                            className: "flex items-center gap-2 flex-wrap pt-1",
                            children: presetAccents.map(col => T.jsx("button", {
                              key: col,
                              type: "button",
                              onClick: () => updateActiveCar(c => ({
                                ...c,
                                styles: { ...activeStyles, accentColor: col }
                              })),
                              style: { backgroundColor: col },
                              className: "w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform cursor-pointer",
                              title: col
                            }))
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),

              /* 2. FEATURES & EQUIPMENT LIST */
              T.jsxs("div", {
                className: "bg-black/40 border border-white/5 p-6 rounded-3xl space-y-5",
                children: [
                  T.jsxs("div", {
                    className: "flex flex-col sm:flex-row justify-between sm:items-center gap-3",
                    children: [
                      T.jsxs("div", {
                        children: [
                          T.jsxs("h4", {
                            className: "text-lg font-bold text-white flex items-center gap-2",
                            children: [
                              "Features & Equipment",
                              T.jsxs("span", {
                                className: "text-xs font-mono px-2.5 py-0.5 bg-white/10 rounded-full text-[#C59B51] font-bold",
                                children: [activeFeatures.length, " items"]
                              })
                            ]
                          }),
                          T.jsx("p", { className: "text-xs text-white/40", children: "Add or remove equipment badges." })
                        ]
                      }),
                      T.jsx("button", {
                        type: "button",
                        onClick: () => updateActiveCar(c => ({ ...c, features: [...DEFAULT_FEATURE_EQUIPMENT_LIST] })),
                        className: "text-xs font-mono text-[#C59B51] hover:underline cursor-pointer",
                        children: "Reset to 16 Default Features"
                      })
                    ]
                  }),

                  /* Add Feature Bar */
                  T.jsxs("form", {
                    onSubmit: (e) => { e.preventDefault(); addFeature(); },
                    className: "flex gap-2.5",
                    children: [
                      T.jsx("input", {
                        type: "text",
                        placeholder: "Add new feature (e.g. Bang & Olufsen 3D Sound, Night Vision Assist...)",
                        value: newFeatureText,
                        onChange: (e) => setNewFeatureText(e.target.value),
                        className: "flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#C59B51]"
                      }),
                      T.jsx("button", {
                        type: "submit",
                        className: "px-5 py-2.5 bg-[#C59B51] hover:bg-[#B38A40] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shrink-0",
                        children: "Add Feature"
                      })
                    ]
                  }),

                  /* Active Features Grid */
                  T.jsx("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2",
                    children: activeFeatures.map((feat, idx) => T.jsxs("div", {
                      key: idx,
                      className: "flex items-center justify-between gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group",
                      children: [
                        T.jsxs("div", {
                          className: "flex items-center gap-2.5 truncate",
                          children: [
                            T.jsx("div", {
                              className: "w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 text-[10px]",
                              children: "✓"
                            }),
                            T.jsx("span", { className: "text-xs text-white font-medium truncate", children: feat })
                          ]
                        }),
                        T.jsx("button", {
                          type: "button",
                          onClick: () => removeFeature(idx),
                          className: "text-white/40 hover:text-red-400 p-1 cursor-pointer transition-colors shrink-0 text-sm",
                          title: "Remove feature",
                          children: "✕"
                        })
                      ]
                    }))
                  })
                ]
              }),

              /* 3. TECHNICAL DOSSIER & EXTRA INFORMATION */
              T.jsxs("div", {
                className: "bg-black/40 border border-white/5 p-6 rounded-3xl space-y-5",
                children: [
                  T.jsxs("div", {
                    children: [
                      T.jsx("h4", { className: "text-lg font-bold text-white", children: "Technical Specifications & Extra Information" }),
                      T.jsx("p", { className: "text-xs text-white/40", children: "Core technical parameters and bespoke provenance notes." })
                    ]
                  }),

                  T.jsxs("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                    children: [
                      T.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50", children: "Make & Model" }),
                          T.jsx("input", {
                            type: "text",
                            value: (activeCar.make || "") + " " + (activeCar.model || ""),
                            onChange: (e) => {
                              const parts = e.target.value.split(" ");
                              const mk = parts[0] || "";
                              const mdl = parts.slice(1).join(" ") || "";
                              updateActiveCar(c => ({ ...c, make: mk, model: mdl }));
                            },
                            className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                          })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50", children: "Production Year" }),
                          T.jsx("input", {
                            type: "number",
                            value: activeCar.year || 2024,
                            onChange: (e) => updateActiveCar(c => ({ ...c, year: Number(e.target.value) })),
                            className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                          })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50", children: "Price (KSh)" }),
                          T.jsx("input", {
                            type: "number",
                            value: activeCar.price || 0,
                            onChange: (e) => updateActiveCar(c => ({ ...c, price: Number(e.target.value) })),
                            className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                          })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50", children: "Body Classification" }),
                          T.jsx("input", {
                            type: "text",
                            value: activeCar.type || "Prestige SUV",
                            onChange: (e) => updateActiveCar(c => ({ ...c, type: e.target.value })),
                            className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                          })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50", children: "Fuel Type" }),
                          T.jsx("input", {
                            type: "text",
                            value: activeCar.fuel || "Diesel",
                            onChange: (e) => updateActiveCar(c => ({ ...c, fuel: e.target.value })),
                            className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                          })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50", children: "Transmission" }),
                          T.jsx("input", {
                            type: "text",
                            value: activeCar.transmission || "Automatic",
                            onChange: (e) => updateActiveCar(c => ({ ...c, transmission: e.target.value })),
                            className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                          })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50", children: "Drivetrain" }),
                          T.jsx("input", {
                            type: "text",
                            value: activeSpecs.drivetrain || "All-Wheel Drive (AWD / 4WD)",
                            onChange: (e) => updateActiveCar(c => ({
                              ...c,
                              specifications: { ...activeSpecs, drivetrain: e.target.value }
                            })),
                            className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                          })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50", children: "Exterior Paint" }),
                          T.jsx("input", {
                            type: "text",
                            value: activeSpecs.exteriorPaint || "Metallic Factory Finish",
                            onChange: (e) => updateActiveCar(c => ({
                              ...c,
                              specifications: { ...activeSpecs, exteriorPaint: e.target.value }
                            })),
                            className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                          })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50", children: "Interior Trim" }),
                          T.jsx("input", {
                            type: "text",
                            value: activeSpecs.interiorTrim || "Full Premium Nappa Leather",
                            onChange: (e) => updateActiveCar(c => ({
                              ...c,
                              specifications: { ...activeSpecs, interiorTrim: e.target.value }
                            })),
                            className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                          })
                        ]
                      }),
                      T.jsxs("div", {
                        className: "space-y-1.5 sm:col-span-2 lg:col-span-3",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-white/50", children: "Import & Duty Status" }),
                          T.jsx("input", {
                            type: "text",
                            value: activeSpecs.importStatus || "Duty & Clearance Settled",
                            onChange: (e) => updateActiveCar(c => ({
                              ...c,
                              specifications: { ...activeSpecs, importStatus: e.target.value }
                            })),
                            className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-white text-xs"
                          })
                        ]
                      }),
                      /* EXTRA INFORMATION / PROVENANCE HIGHLIGHTS FIELD */
                      T.jsxs("div", {
                        className: "space-y-1.5 sm:col-span-2 lg:col-span-3",
                        children: [
                          T.jsx("label", { className: "text-xs font-mono uppercase text-[#C59B51] font-bold", children: "Extra Information & Executive Provenance Notes" }),
                          T.jsx("textarea", {
                            rows: 2,
                            placeholder: "e.g. Single owner from new, full dealership service records, ceramic paint protection, clean customs clearance...",
                            value: activeSpecs.extraInfo || "",
                            onChange: (e) => updateActiveCar(c => ({
                              ...c,
                              specifications: { ...activeSpecs, extraInfo: e.target.value }
                            })),
                            className: "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-[#C59B51]"
                          })
                        ]
                      })
                    ]
                  })
                ]
              }),

              /* 4. STUDIO PHOTOGRAPHS & LOCAL STORAGE UPLOAD */
              T.jsxs("div", {
                className: "bg-black/40 border border-white/5 p-6 rounded-3xl space-y-5",
                children: [
                  T.jsxs("div", {
                    className: "flex flex-col sm:flex-row justify-between sm:items-center gap-3",
                    children: [
                      T.jsxs("div", {
                        children: [
                          T.jsx("h4", { className: "text-lg font-bold text-white", children: "Studio Angles & Photographs (6 Images)" }),
                          T.jsx("p", { className: "text-xs text-white/40", children: "Upload photos from your local storage / device, or provide image URLs." })
                        ]
                      }),
                      /* LOCAL DEVICE STORAGE UPLOAD BUTTON */
                      T.jsxs("button", {
                        type: "button",
                        onClick: () => fileInputRef.current && fileInputRef.current.click(),
                        className: "px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border border-white/15",
                        children: [
                          T.jsx("span", { className: "text-sm", children: "📁" }),
                          "Upload Photos from Local Storage"
                        ]
                      })
                    ]
                  }),

                  /* 6 Photos Grid with Individual Upload Buttons */
                  T.jsx("div", {
                    className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3",
                    children: [0, 1, 2, 3, 4, 5].map(idx => {
                      const currentImgs = (activeCar.images && activeCar.images.length) ? [...activeCar.images] : [];
                      const val = currentImgs[idx] || "";
                      return T.jsxs("div", {
                        key: idx,
                        className: "space-y-2 bg-white/5 p-3 rounded-2xl border border-white/10 flex flex-col justify-between",
                        children: [
                          T.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              T.jsx("div", {
                                className: "w-full aspect-[16/10] bg-black/50 rounded-xl overflow-hidden",
                                children: val ? T.jsx("img", { src: val, alt: "Angle " + (idx + 1), className: "w-full h-full object-cover" }) : T.jsx("div", { className: "w-full h-full flex items-center justify-center text-white/30 text-xs", children: "Empty" })
                              }),
                              T.jsxs("div", {
                                className: "flex items-center justify-between",
                                children: [
                                  T.jsxs("span", {
                                    className: "text-[10px] font-mono text-white/50 uppercase font-bold",
                                    children: [idx === 0 ? "1. Hero Image" : "Photo " + (idx + 1)]
                                  }),
                                  /* Slot individual upload */
                                  T.jsx("button", {
                                    type: "button",
                                    onClick: () => {
                                      setTargetUploadIndex(idx);
                                      if (slotFileInputRef.current) slotFileInputRef.current.click();
                                    },
                                    className: "text-[10px] font-mono text-[#C59B51] hover:underline cursor-pointer",
                                    title: "Upload from device",
                                    children: "Upload"
                                  })
                                ]
                              })
                            ]
                          }),
                          T.jsx("input", {
                            type: "text",
                            placeholder: "/images/... or data:image",
                            value: val,
                            onChange: (e) => {
                              const newImgs = [...currentImgs];
                              newImgs[idx] = e.target.value;
                              updateActiveCar(c => ({
                                ...c,
                                images: newImgs,
                                image: newImgs[0] || c.image || ""
                              }));
                            },
                            className: "w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white font-mono text-[9px] truncate"
                          })
                        ]
                      });
                    })
                  })
                ]
              }),

              /* 5. YOUTUBE VIDEO WALKAROUND URL */
              T.jsxs("div", {
                className: "bg-black/40 border border-white/5 p-6 rounded-3xl space-y-4",
                children: [
                  T.jsxs("div", {
                    className: "flex flex-col sm:flex-row justify-between sm:items-center gap-2",
                    children: [
                      T.jsxs("div", {
                        children: [
                          T.jsx("h4", { className: "text-lg font-bold text-white", children: "YouTube Walkaround Video URL" }),
                          T.jsx("p", { className: "text-xs text-white/40", children: "Direct YouTube link opened when users click the red YouTube icon on the showcase." })
                        ]
                      }),
                      activeCar.videoUrl && T.jsxs("a", {
                        href: activeCar.videoUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-xs font-mono text-[#FF0000] hover:underline flex items-center gap-1 shrink-0",
                        children: ["▶ Test Video Link", T.jsx("span", { children: "↗" })]
                      })
                    ]
                  }),
                  T.jsx("input", {
                    type: "text",
                    placeholder: "https://www.youtube.com/watch?v=... or https://youtu.be/...",
                    value: activeCar.videoUrl || "",
                    onChange: (e) => updateActiveCar(c => ({ ...c, videoUrl: e.target.value })),
                    className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#C59B51]"
                  })
                ]
              }),

              /* BOTTOM ACTION FOOTER */
              T.jsxs("div", {
                className: "flex items-center justify-between gap-4 pt-4 border-t border-white/10 flex-wrap",
                children: [
                  /* WORKING DELETE BUTTON (triggers clean state-based confirmation) */
                  T.jsx("button", {
                    type: "button",
                    onClick: () => setDeleteConfirmId(activeCar.id),
                    className: "px-5 py-3 border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors",
                    children: "Delete This Featured Car"
                  }),
                  T.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      T.jsxs("button", {
                        type: "button",
                        onClick: () => setShowInventoryModal(true),
                        className: "px-5 py-3 border border-white/20 hover:border-white text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-2",
                        children: [
                          T.jsx("span", { children: "🚗" }),
                          "Select from Added Vehicles"
                        ]
                      }),
                      T.jsx("button", {
                        type: "button",
                        onClick: handleSave,
                        className: "px-8 py-3 bg-[#C59B51] hover:bg-[#B38A40] text-black rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-lg cursor-pointer transition-all",
                        children: "Save All Changes"
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          /* ARCHIVED FACTORY DEFAULTS */
          T.jsxs("div", {
            className: "pt-6 border-t border-white/5",
            children: [
              T.jsxs("button", {
                type: "button",
                onClick: () => setShowArchivedDefaults(!showArchivedDefaults),
                className: "text-xs font-mono text-white/40 hover:text-white flex items-center gap-2 cursor-pointer transition-colors",
                children: [
                  T.jsx("span", { children: showArchivedDefaults ? "▼" : "▶" }),
                  "View 5 Archived Factory Default Vehicles (Preserved in System)"
                ]
              }),
              showArchivedDefaults && T.jsxs("div", {
                className: "mt-4 p-5 bg-black/20 border border-white/5 rounded-2xl space-y-3",
                children: [
                  T.jsx("p", {
                    className: "text-xs text-white/50",
                    children: "These 5 original prestige cars are archived from active admin editing and serve as automatic fallbacks when fewer than 5 custom cars are present:"
                  }),
                  T.jsx("div", {
                    className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3",
                    children: DEFAULT_FEATURED_CARS.map((dc, i) => T.jsxs("div", {
                      key: dc.id,
                      className: "p-3 bg-white/5 rounded-xl border border-white/5 space-y-1 text-xs",
                      children: [
                        T.jsxs("span", {
                          className: "text-[10px] font-mono text-[#C59B51] uppercase font-bold block",
                          children: ["Default Slot ", i + 1]
                        }),
                        T.jsx("span", {
                          className: "font-bold text-white line-clamp-1 block",
                          children: dc.make + " " + dc.model
                        }),
                        T.jsx("span", {
                          className: "text-[10px] text-white/40 block",
                          children: i < customCount ? "(Currently Replaced)" : "(Currently Active Fallback)"
                        })
                      ]
                    }))
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}
`;

js = js.substring(0, studioStart) + newStudioImplementation + "\n\n" + js.substring(okStart);
console.log("Successfully replaced FeaturedCarsAdminStudio with complete inventory picker and device upload!");

// 2. Ensure FeaturedCarsAdminStudio invocation in ok passes inventoryCars: x
const oldInvocation = `_==="featured-cars"&&T.jsx(FeaturedCarsAdminStudio,{onPreview:pb}),`;
const newInvocation = `_==="featured-cars"&&T.jsx(FeaturedCarsAdminStudio,{onPreview:pb,inventoryCars:x}),`;

if (js.includes(oldInvocation)) {
  js = js.replace(oldInvocation, newInvocation);
  console.log("Updated FeaturedCarsAdminStudio invocation to pass inventoryCars: x!");
} else {
  console.log("oldInvocation not matched directly, checking regex...");
  js = js.replace(
    /T\.jsx\(FeaturedCarsAdminStudio,\{onPreview:pb\}\)/g,
    'T.jsx(FeaturedCarsAdminStudio,{onPreview:pb,inventoryCars:x})'
  );
}

// 3. Update Section 3 in FLPage to render extraInfo provenance note if available
const oldSpecsGridEnd = `].map((item, idx) => T.jsxs("div", {                      key: idx,                      className: "bg-white p-4.5 rounded-2xl border-0 flex flex-col justify-between shadow-xs " + (idx === 8 ? "sm:col-span-2" : ""),                      children: [                        T.jsx("span", { className: "text-xs font-mono uppercase font-bold text-gray-400 mb-1", children: item.label }),                        T.jsx("span", { className: "text-sm sm:text-base font-extrabold text-gray-900 leading-snug", children: item.val })                      ]                    }))                  })`;

const newSpecsGridEnd = `].map((item, idx) => T.jsxs("div", {                      key: idx,                      className: "bg-white p-4.5 rounded-2xl border-0 flex flex-col justify-between shadow-xs " + (idx === 8 ? "sm:col-span-2" : ""),                      children: [                        T.jsx("span", { className: "text-xs font-mono uppercase font-bold text-gray-400 mb-1", children: item.label }),                        T.jsx("span", { className: "text-sm sm:text-base font-extrabold text-gray-900 leading-snug", children: item.val })                      ]                    }))                  }),
                  /* Extra Provenance Information Note if provided */
                  ((car.specifications && car.specifications.extraInfo) || car.extraInfo || car.description) && T.jsxs("div", {
                    className: "p-4.5 bg-white rounded-2xl border-0 shadow-xs space-y-1",
                    children: [
                      T.jsx("span", { className: "text-xs font-mono uppercase font-bold text-[#C59B51] block", children: "Executive Provenance & Special Highlights" }),
                      T.jsx("p", { className: "text-xs sm:text-sm text-gray-700 font-medium leading-relaxed", children: (car.specifications && car.specifications.extraInfo) || car.extraInfo || car.description })
                    ]
                  })`;

if (js.includes(oldSpecsGridEnd)) {
  js = js.replace(oldSpecsGridEnd, newSpecsGridEnd);
  console.log("Successfully added extraInfo provenance note display in Section 3 of FLPage!");
}

fs.writeFileSync(jsPath, js, 'utf8');

// 4. Update index.html cache-buster
const htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');
const versionTag = 'v=20261016-feat-' + Date.now();
html = html.replace(/index-BIZlWqQ7\.js\?v=[^"']*/g, 'index-BIZlWqQ7.js?' + versionTag);
fs.writeFileSync(htmlPath, html, 'utf8');
console.log("Updated index.html cache-buster:", versionTag);

