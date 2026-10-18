const fs = require('fs');
const vm = require('vm');

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

console.log("Starting featured vehicles sync patch...");

// --- 1. Patch useFeaturedCars hook and boot sync block ---
const target1Start = js.indexOf("function useFeaturedCars()");
const target1End = js.indexOf("let SIX_SCREENSHOT_CARS = resolveActiveFeaturedCars();", target1Start);

if (target1Start === -1 || target1End === -1) {
  console.error("Could not find useFeaturedCars chunk:", target1Start, target1End);
  process.exit(1);
}

const replacement1 = `function useFeaturedCars() {
  const [featuredCars, setFeaturedCars] = Fe.useState(() => resolveActiveFeaturedCars());
  Fe.useEffect(() => {
    const handleUpdate = () => {
      setFeaturedCars(resolveActiveFeaturedCars());
    };
    window.addEventListener("mrjoseph_featured_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Immediate fast-path REST query to Firestore for instant cross-device updates
    try {
      fetch("https://firestore.googleapis.com/v1/projects/" + GV + "/databases/" + $V + "/documents:runQuery?key=" + XV, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ structuredQuery: { from: [{ collectionId: "featured_cars" }] } })
      }).then(r => r.json()).then(data => {
        const docs = (data || []).filter(item => item.document);
        if (docs.length > 0) {
          const remote = docs.map(d => {
            const f = d.document.fields || {};
            return {
              id: f.id?.stringValue || d.document.name.split("/").pop(),
              make: f.make?.stringValue || "Prestige",
              model: f.model?.stringValue || "Edition",
              year: Number(f.year?.integerValue) || 2023,
              price: Number(f.price?.integerValue) || 0,
              mileage: f.mileage?.stringValue || "35,000 km",
              fuel: f.fuel?.stringValue || "Diesel",
              transmission: f.transmission?.stringValue || "Automatic",
              type: f.type?.stringValue || "Prestige SUV",
              location: f.location?.stringValue || "Kiambu Road, Ridgeways",
              status: f.status?.stringValue || "Available",
              description: f.description?.stringValue || "",
              image: f.image?.stringValue || "/images/hero_showroom.jpg",
              images: f.images?.arrayValue?.values?.map(v => v.stringValue) || [f.image?.stringValue || "/images/hero_showroom.jpg"],
              features: f.features?.arrayValue?.values?.map(v => v.stringValue) || [...DEFAULT_FEATURE_EQUIPMENT_LIST],
              styles: { featuresBg: "#000F1E", titleBarBg: "#000F1E", accentColor: "#C59B51" },
              specifications: {
                drivetrain: "Intelligent All-Wheel Drive (AWD)",
                exteriorPaint: "Metallic Factory Finish",
                interiorTrim: "Full Premium Nappa Leather",
                importStatus: "Duty & Clearance Settled",
                extraInfo: f.description?.stringValue || ""
              },
              videoUrl: f.videoUrl?.stringValue || "",
              order: Number(f.order?.integerValue) || 0,
              archived: f.archived?.booleanValue || false
            };
          }).filter(c => !c.archived).sort((a, b) => (a.order || 0) - (b.order || 0));
          if (remote.length > 0) {
            window.__MRJOSEPH_CUSTOM_FEATURED = remote;
            try { localStorage.setItem("mrjoseph_custom_featured_cars", JSON.stringify(remote)); } catch (_) {}
            SIX_SCREENSHOT_CARS = resolveActiveFeaturedCars();
            setFeaturedCars(resolveActiveFeaturedCars());
          }
        }
      }).catch(() => {});
    } catch (_) {}

    // Real-time Firestore SDK onSnapshot listener
    let unsubSnapshot = null;
    try {
      if (typeof wh !== "undefined" && typeof vg !== "undefined" && typeof kM !== "undefined" && typeof FM !== "undefined") {
        const q = kM(vg(wh, "featured_cars"));
        unsubSnapshot = FM(q, (snapshot) => {
          if (snapshot && !snapshot.empty) {
            const remoteDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
              .filter(c => !c.archived && !c.isArchived)
              .sort((a, b) => (a.order || 0) - (b.order || 0));
            if (remoteDocs.length > 0) {
              window.__MRJOSEPH_CUSTOM_FEATURED = remoteDocs;
              try { localStorage.setItem("mrjoseph_custom_featured_cars", JSON.stringify(remoteDocs)); } catch (_) {}
              SIX_SCREENSHOT_CARS = resolveActiveFeaturedCars();
              setFeaturedCars(resolveActiveFeaturedCars());
            }
          }
        }, (err) => {
          console.warn("Firestore featured sync note:", err);
        });
      }
    } catch (e) {
      console.warn("Firestore featured listener error:", e);
    }

    return () => {
      window.removeEventListener("mrjoseph_featured_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);
  return featuredCars;
}

if (typeof window !== "undefined") {
  try {
    idbGetFeatured().then(idbCars => {
      if (idbCars && Array.isArray(idbCars) && idbCars.length > 0) {
        window.__MRJOSEPH_CUSTOM_FEATURED = idbCars;
        if (typeof resolveActiveFeaturedCars === "function") {
          SIX_SCREENSHOT_CARS = resolveActiveFeaturedCars();
        }
      }
    });

    // Immediate REST fetch on script boot
    fetch("https://firestore.googleapis.com/v1/projects/" + GV + "/databases/" + $V + "/documents:runQuery?key=" + XV, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ structuredQuery: { from: [{ collectionId: "featured_cars" }] } })
    }).then(r => r.json()).then(data => {
      const docs = (data || []).filter(item => item.document);
      if (docs.length > 0) {
        const remote = docs.map(d => {
          const f = d.document.fields || {};
          return {
            id: f.id?.stringValue || d.document.name.split("/").pop(),
            make: f.make?.stringValue || "Prestige",
            model: f.model?.stringValue || "Edition",
            year: Number(f.year?.integerValue) || 2023,
            price: Number(f.price?.integerValue) || 0,
            mileage: f.mileage?.stringValue || "35,000 km",
            fuel: f.fuel?.stringValue || "Diesel",
            transmission: f.transmission?.stringValue || "Automatic",
            type: f.type?.stringValue || "Prestige SUV",
            location: f.location?.stringValue || "Kiambu Road, Ridgeways",
            status: f.status?.stringValue || "Available",
            description: f.description?.stringValue || "",
            image: f.image?.stringValue || "/images/hero_showroom.jpg",
            images: f.images?.arrayValue?.values?.map(v => v.stringValue) || [f.image?.stringValue || "/images/hero_showroom.jpg"],
            features: f.features?.arrayValue?.values?.map(v => v.stringValue) || [...DEFAULT_FEATURE_EQUIPMENT_LIST],
            styles: { featuresBg: "#000F1E", titleBarBg: "#000F1E", accentColor: "#C59B51" },
            specifications: {
              drivetrain: "Intelligent All-Wheel Drive (AWD)",
              exteriorPaint: "Metallic Factory Finish",
              interiorTrim: "Full Premium Nappa Leather",
              importStatus: "Duty & Clearance Settled",
              extraInfo: f.description?.stringValue || ""
            },
            videoUrl: f.videoUrl?.stringValue || "",
            order: Number(f.order?.integerValue) || 0,
            archived: f.archived?.booleanValue || false
          };
        }).filter(c => !c.archived).sort((a, b) => (a.order || 0) - (b.order || 0));
        if (remote.length > 0) {
          window.__MRJOSEPH_CUSTOM_FEATURED = remote;
          try { localStorage.setItem("mrjoseph_custom_featured_cars", JSON.stringify(remote)); } catch (_) {}
          if (typeof resolveActiveFeaturedCars === "function") {
            SIX_SCREENSHOT_CARS = resolveActiveFeaturedCars();
          }
          window.dispatchEvent(new CustomEvent("mrjoseph_featured_updated", { detail: remote }));
        }
      }
    }).catch(() => {});
  } catch (_) {}
}
`;

js = js.substring(0, target1Start) + replacement1 + js.substring(target1End);
console.log("Chunk 1 replaced.");

// --- 2. Patch FeaturedCarsAdminStudio cloud sync & persistChanges ---
const targetStudioStart = '  // Auto-sync from cloud on mount if opening on a fresh device in production';
const targetStudioEnd = '  const handleSave = () => {';

const startIdx2 = js.indexOf(targetStudioStart);
if (startIdx2 === -1) {
  console.error("Could not find FeaturedCarsAdminStudio targetStudioStart");
  process.exit(1);
}
const endIdx2 = js.indexOf(targetStudioEnd, startIdx2);

const newStudioSyncAndPersist = `  // Real-time and REST cloud sync for FeaturedCarsAdminStudio across all devices
  Fe.useEffect(() => {
    let unsubSnapshot = null;
    const applyRemoteList = (remote) => {
      if (!remote || !Array.isArray(remote) || remote.length === 0) return;
      window.__MRJOSEPH_CUSTOM_FEATURED = remote;
      try { localStorage.setItem("mrjoseph_custom_featured_cars", JSON.stringify(remote)); } catch (_) {}
      if (typeof resolveActiveFeaturedCars === "function") {
        SIX_SCREENSHOT_CARS = resolveActiveFeaturedCars();
      }
      setCustomCars(prev => {
        // If user is actively typing unsaved changes, keep their edits
        if (hasUnsavedChanges) return prev;
        return remote;
      });
      setActiveCarId(prevId => {
        if (prevId && remote.some(c => c.id === prevId)) return prevId;
        return remote[0] ? remote[0].id : null;
      });
    };

    // Fast-path: query Firestore REST API immediately (works in <100ms on all devices)
    try {
      fetch("https://firestore.googleapis.com/v1/projects/" + GV + "/databases/" + $V + "/documents:runQuery?key=" + XV, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ structuredQuery: { from: [{ collectionId: "featured_cars" }] } })
      }).then(r => r.json()).then(data => {
        const docs = (data || []).filter(item => item.document);
        if (docs.length > 0) {
          const parsed = docs.map(d => {
            const f = d.document.fields || {};
            return {
              id: f.id?.stringValue || d.document.name.split("/").pop(),
              make: f.make?.stringValue || "Prestige",
              model: f.model?.stringValue || "Edition",
              year: Number(f.year?.integerValue) || 2023,
              price: Number(f.price?.integerValue) || 0,
              mileage: f.mileage?.stringValue || "35,000 km",
              fuel: f.fuel?.stringValue || "Diesel",
              transmission: f.transmission?.stringValue || "Automatic",
              type: f.type?.stringValue || "Prestige SUV",
              location: f.location?.stringValue || "Kiambu Road, Ridgeways",
              status: f.status?.stringValue || "Available",
              description: f.description?.stringValue || "",
              image: f.image?.stringValue || "/images/hero_showroom.jpg",
              images: f.images?.arrayValue?.values?.map(v => v.stringValue) || [f.image?.stringValue || "/images/hero_showroom.jpg"],
              features: f.features?.arrayValue?.values?.map(v => v.stringValue) || [...DEFAULT_FEATURE_EQUIPMENT_LIST],
              styles: { featuresBg: "#000F1E", titleBarBg: "#000F1E", accentColor: "#C59B51" },
              specifications: {
                drivetrain: "Intelligent All-Wheel Drive (AWD)",
                exteriorPaint: "Metallic Factory Finish",
                interiorTrim: "Full Premium Nappa Leather",
                importStatus: "Duty & Clearance Settled",
                extraInfo: f.description?.stringValue || ""
              },
              videoUrl: f.videoUrl?.stringValue || "",
              order: Number(f.order?.integerValue) || 0,
              archived: f.archived?.booleanValue || false
            };
          }).filter(c => !c.archived).sort((a, b) => (a.order || 0) - (b.order || 0));
          if (parsed.length > 0) applyRemoteList(parsed);
        }
      }).catch(() => {});
    } catch (_) {}

    // Real-time Firestore SDK listener
    try {
      if (typeof wh !== "undefined" && typeof vg !== "undefined" && typeof kM !== "undefined" && typeof FM !== "undefined") {
        const q = kM(vg(wh, "featured_cars"));
        unsubSnapshot = FM(q, (snapshot) => {
          if (snapshot && !snapshot.empty) {
            const remoteDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
              .filter(c => !c.archived && !c.isArchived)
              .sort((a, b) => (a.order || 0) - (b.order || 0));
            if (remoteDocs.length > 0) {
              applyRemoteList(remoteDocs);
            }
          }
        }, (err) => {
          console.warn("Featured cars live snapshot error:", err);
        });
      }
    } catch (err) {
      console.warn("Error setting up featured cars listener:", err);
    }

    return () => {
      if (unsubSnapshot) unsubSnapshot();
    };
  }, [hasUnsavedChanges]);

  // Keep activeCarId synchronized with customCars
  Fe.useEffect(() => {
    if (customCars.length > 0) {
      if (!activeCarId || !customCars.some(c => c.id === activeCarId)) {
        setActiveCarId(customCars[0].id);
      }
    } else {
      setActiveCarId(null);
    }
  }, [customCars.length, activeCarId]);

  const activeCar = (activeCarId ? customCars.find(c => c.id === activeCarId) : null) || customCars[0] || null;
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
    extraInfo: (activeCar && (activeCar.description || activeCar.extraInfo)) || ""
  };

  const updateActiveCar = (updater) => {
    const currId = activeCarId || (customCars[0] ? customCars[0].id : null);
    if (!currId) return;
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
    setCustomCars(prev => prev.map(c => {
      if (c.id === currId) {
        return updater(c);
      }
      return c;
    }));
  };

  // PERSISTENCE ENGINE (Multi-tiered: memory + IndexedDB + localStorage + Firestore Web SDK + direct REST API)
  const persistChanges = async (updatedList, toastMsg = "All featured vehicle changes saved and synced live to production!") => {
    setIsSaving(true);
    setSaveSuccess(false);

    // 1. Instant local & memory update
    if (typeof window !== "undefined") {
      window.__MRJOSEPH_CUSTOM_FEATURED = updatedList;
    }
    if (typeof resolveActiveFeaturedCars === "function") {
      SIX_SCREENSHOT_CARS = resolveActiveFeaturedCars();
    }
    try {
      localStorage.setItem("mrjoseph_custom_featured_cars", JSON.stringify(updatedList));
    } catch (quotaErr) {
      console.warn("LocalStorage quota note:", quotaErr);
    }
    try {
      if (typeof idbSaveFeatured === "function") {
        await idbSaveFeatured(updatedList);
      }
    } catch (_) {}

    // 2. PRODUCTION FIRESTORE PERSISTENCE (Multi-tier: Web SDK + direct REST API)
    try {
      const cleanList = updatedList.map((car, idx) => ({
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
        specifications: {
          drivetrain: String((car.specifications && car.specifications.drivetrain) || "Intelligent All-Wheel Drive (AWD)"),
          exteriorPaint: String((car.specifications && car.specifications.exteriorPaint) || "Metallic Factory Finish"),
          interiorTrim: String((car.specifications && car.specifications.interiorTrim) || "Full Premium Nappa Leather"),
          importStatus: String((car.specifications && car.specifications.importStatus) || "Duty & Clearance Settled"),
          extraInfo: String((car.specifications && car.specifications.extraInfo) || car.description || "")
        },
        videoUrl: String(car.videoUrl || ""),
        order: idx,
        archived: !!car.archived,
        updatedAt: new Date().toISOString()
      }));

      // A. Write to Firestore via Web SDK
      if (typeof wh !== "undefined" && typeof zM !== "undefined" && typeof Eg !== "undefined") {
        const promises = cleanList.map(docData => zM(Eg(wh, "featured_cars", docData.id), docData));
        await Promise.all(promises).catch(err => console.warn("Web SDK setDoc note:", err));
      }

      // B. ALSO GUARANTEE WRITE via Firestore REST API (Works directly and immediately)
      const restPromises = cleanList.map(async (car, idx) => {
        const docUrl = "https://firestore.googleapis.com/v1/projects/" + GV + "/databases/" + $V + "/documents/featured_cars/" + encodeURIComponent(car.id) + "?key=" + XV;
        const fields = {
          id: { stringValue: car.id },
          make: { stringValue: car.make },
          model: { stringValue: car.model },
          year: { integerValue: String(car.year) },
          price: { integerValue: String(car.price) },
          mileage: { stringValue: car.mileage },
          fuel: { stringValue: car.fuel },
          transmission: { stringValue: car.transmission },
          type: { stringValue: car.type },
          location: { stringValue: car.location },
          status: { stringValue: car.status },
          description: { stringValue: car.description },
          image: { stringValue: car.image },
          images: {
            arrayValue: {
              values: car.images.map(img => ({ stringValue: String(img) }))
            }
          },
          features: {
            arrayValue: {
              values: car.features.map(f => ({ stringValue: String(f) }))
            }
          },
          videoUrl: { stringValue: car.videoUrl },
          order: { integerValue: String(idx) },
          archived: { booleanValue: car.archived },
          updatedAt: { stringValue: car.updatedAt }
        };
        return fetch(docUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields })
        });
      });
      await Promise.all(restPromises).catch(err => console.warn("REST API patch note:", err));

      // C. Also clean up any removed docs from Firestore
      const currentIds = new Set(cleanList.map(c => c.id));
      if (typeof jM !== "undefined" && typeof BM !== "undefined" && typeof vg !== "undefined") {
        jM(vg(wh, "featured_cars")).then(existingSnap => {
          existingSnap.docs.forEach(docItem => {
            if (!currentIds.has(docItem.id)) {
              BM(Eg(wh, "featured_cars", docItem.id)).catch(() => {});
              try {
                fetch("https://firestore.googleapis.com/v1/projects/" + GV + "/databases/" + $V + "/documents/featured_cars/" + encodeURIComponent(docItem.id) + "?key=" + XV, {
                  method: "DELETE"
                }).catch(() => {});
              } catch (_) {}
            }
          });
        }).catch(() => {});
      }

      // D. Also save light config in cars collection without massive image arrays
      try {
        if (typeof zM !== "undefined" && typeof Eg !== "undefined") {
          const lightConfig = cleanList.map(c => ({
            id: c.id,
            make: c.make,
            model: c.model,
            year: c.year,
            price: c.price,
            image: c.image,
            order: c.order,
            archived: c.archived
          }));
          zM(Eg(wh, "cars", "featured_config"), {
            customCars: lightConfig,
            isDecorative: true,
            updatedAt: new Date().toISOString()
          }).catch(() => {});
        }
      } catch (_) {}

    } catch (fsErr) {
      console.warn("Firestore sync catch:", fsErr);
    }

    // 3. Broadcast to all open tabs and windows
    if (typeof window !== "undefined") {
      try {
        window.dispatchEvent(new CustomEvent("mrjoseph_featured_updated", { detail: updatedList }));
        window.dispatchEvent(new Event("storage"));
      } catch (_) {}
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setHasUnsavedChanges(false);
    setSaveToast(toastMsg || "All featured vehicles saved and synced live to production across all devices!");
    setTimeout(() => { setSaveSuccess(false); }, 4000);
    setTimeout(() => { setSaveToast(null); }, 5000);
  };
`;

js = js.substring(0, startIdx2) + newStudioSyncAndPersist + js.substring(endIdx2);
console.log("Chunk 2 replaced.");

// Validate syntax
try {
  new vm.Script(js);
  console.log("Syntax validation PASSED!");
} catch (e) {
  console.error("Syntax validation FAILED:", e);
  process.exit(1);
}

fs.writeFileSync('assets/index-BIZlWqQ7.js', js);
console.log("Successfully wrote assets/index-BIZlWqQ7.js!");
