const fs = require('fs');
const vm = require('vm');

console.log("Restoring homepage hero to exact original and upgrading featured car hero section...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

// =========================================================================
// 1. RESTORE HOMEPAGE HERO (nk component) TO EXACT ORIGINAL
// =========================================================================
const nkStart = js.indexOf("function nk({ setView: s, setSelectedCar: e }) {");
let actualNkStart = nkStart;
if (actualNkStart === -1) {
  actualNkStart = js.indexOf("function nk({setView:s,setSelectedCar:e}){");
}

const nkEnd = js.indexOf(`T.jsxs("section",{id:"featured-vehicles"`, actualNkStart);

if (actualNkStart === -1 || nkEnd === -1) {
  console.error("Could not find nk boundaries:", actualNkStart, nkEnd);
  process.exit(1);
}

const originalNk = `function nk({setView:s,setSelectedCar:e}){const[t,n]=Fe.useState(0),i=c7(),o=useFeaturedCars(),u=["/images/hero_showroom.jpg","/images/2019-MERCEDES-BENZ-G-WAGON-G350d-FRESH-IMPORT-Experience-unmatched-luxury-power-and-presenc.jpg","/images/2023-LEXUS-LX600-ULTRA-LUXURY-THE-SUMMIT-OF-SOPHISTICATION-Every-detail-of-this-Graphite-Blac.jpg"];return T.jsxs("div",{style:{backgroundColor:"#ffffff",width:"100%"},children:[T.jsxs("section",{className:"hero-section-box",children:[T.jsx("img",{src:u[t%u.length],alt:"Mr Joseph Premium Showroom",className:"hero-bg-cover"}),T.jsx("div",{className:"hero-dark-vignette"}),T.jsxs("div",{style:{position:"absolute",top:16,left:32,zIndex:15,display:"flex",alignItems:"center",gap:8},className:"hidden sm:flex",children:[T.jsx("span",{style:{height:1.5,width:18,backgroundColor:"#C59B51"}}),T.jsx("span",{style:{color:"rgba(255,255,255,0.92)",fontFamily:"'Inter', sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase"},children:"home of luxury and class"}),T.jsx("span",{style:{height:1.5,width:18,backgroundColor:"#C59B51"}})]}),T.jsx("div",{className:"hero-inner-content",children:T.jsxs("div",{className:"hero-text-wrapper",children:[T.jsx("p",{className:"hero-welcome-badge",children:"WELCOME TO"}),T.jsx("h1",{className:"hero-h1-white",children:"MR JOSEPH"}),T.jsx("h2",{className:"hero-h2-gold",children:"PREMIUM CARS"}),T.jsxs("p",{className:"hero-p-sub",children:["Luxury Vehicles. Exceptional Service.",T.jsx("br",{}),"Your Next Drive Starts Here."]}),T.jsxs("button",{onClick:()=>{const h=document.getElementById("our-cars-section");h?h.scrollIntoView({behavior:"smooth"}):s("inventory")},className:"hero-btn-cta",children:["BROWSE OUR CARS",T.jsx("span",{style:{fontSize:13,fontWeight:"bold"},children:"→"})]})]})}),T.jsxs("div",{className:"hero-arrow-controls",children:[T.jsx("button",{onClick:()=>n(h=>(h-1+u.length)%u.length),className:"hero-arrow-btn","aria-label":"Previous slide",children:T.jsx("span",{children:"‹"})}),T.jsx("button",{onClick:()=>n(h=>(h+1)%u.length),className:"hero-arrow-btn","aria-label":"Next slide",children:T.jsx("span",{children:"›"})})]})]}),`;

js = js.substring(0, actualNkStart) + originalNk + js.substring(nkEnd);
console.log("Successfully restored homepage hero section to exact original!");

// =========================================================================
// 2. UPGRADE FEATURED CAR HERO SECTION (IN FLPage)
// - Alternates animatedly across all photos/angles (including all the cars in the bottom)
// - Completely UNZOOMED: object-fit: contain !important, transform: none !important
// - Prev / Next navigation, angle counter, perspective indicator dots
// - Clicking any angle in the bottom gallery switches the hero image
// =========================================================================
const flPageStart = js.indexOf("function FLPage({ carId: sId, onBack: backFn }) {");
if (flPageStart === -1) {
  console.error("Could not find FLPage start!");
  process.exit(1);
}

// Find state definitions in FLPage
const targetLightboxState = "const [lightboxImg, setLightboxImg] = Fe.useState(null);";
const lightboxIdx = js.indexOf(targetLightboxState, flPageStart);
if (lightboxIdx === -1) {
  console.error("Could not find lightboxImg state in FLPage!");
  process.exit(1);
}

// Add heroSlide state & pause state in FLPage
const newStates = `const [lightboxImg, setLightboxImg] = Fe.useState(null);
  const [heroSlide, setHeroSlide] = Fe.useState(0);
  const [isHeroPaused, setIsHeroPaused] = Fe.useState(false);`;

js = js.substring(0, lightboxIdx) + newStates + js.substring(lightboxIdx + targetLightboxState.length);

// Also add auto-alternating timer effect in FLPage after window.scrollTo effect
const scrollEffectTarget = `Fe.useEffect(() => {    window.scrollTo(0, 0);  }, [sId]);`;
const scrollEffectIdx = js.indexOf(scrollEffectTarget, flPageStart);

if (scrollEffectIdx !== -1) {
  const newTimerEffect = `Fe.useEffect(() => {    window.scrollTo(0, 0); setHeroSlide(0);  }, [sId]);
  Fe.useEffect(() => {
    if (!rawImages || rawImages.length <= 1 || isHeroPaused) return;
    const interval = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % rawImages.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [rawImages && rawImages.length, isHeroPaused]);`;
  js = js.substring(0, scrollEffectIdx) + newTimerEffect + js.substring(scrollEffectIdx + scrollEffectTarget.length);
}

// Replace Section 1 in FLPage with the animated alternating, unzoomed hero section
const s1StartTarget = "/* SECTION 1: HERO SECTION";
const s1EndTarget = "/* Vehicle Title Bar */";

const s1Start = js.indexOf(s1StartTarget, flPageStart);
const s1End = js.indexOf(s1EndTarget, s1Start);

if (s1Start === -1 || s1End === -1) {
  console.error("Could not find Section 1 hero boundaries in FLPage:", s1Start, s1End);
  process.exit(1);
}

const newFeaturedHero = `/* SECTION 1: HERO SECTION - ANIMATED ALTERNATING UNZOOMED CAR DISPLAY */
      T.jsxs("section", {
        className: "featured-hero-container relative w-full overflow-hidden flex items-center justify-center bg-[#0A0A0F] select-none",
        style: { height: "58vh", minHeight: "420px", maxHeight: "640px", width: "100%", backgroundColor: "#0A0A0F", position: "relative" },
        onMouseEnter: () => setIsHeroPaused(true),
        onMouseLeave: () => setIsHeroPaused(false),
        children: [
          /* Ambient blurred background glow from current slide */
          rawImages.map((imgUrl, idx) => {
            const isActive = idx === (heroSlide % rawImages.length);
            return T.jsx("div", {
              key: "glow-" + idx,
              className: "absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700",
              style: {
                backgroundImage: "url(" + imgUrl + ")",
                backgroundPosition: "center",
                backgroundSize: "cover",
                opacity: isActive ? 0.18 : 0,
                filter: "blur(45px)",
                transform: "none",
                zIndex: 1
              }
            });
          }),

          /* Dark vignette gradient for luxury contrast */
          T.jsx("div", {
            className: "absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-[#0A0A0F]/60 pointer-events-none",
            style: { zIndex: 2 }
          }),

          /* Animated Alternating Unzoomed Foreground Car Slides */
          rawImages.map((imgUrl, idx) => {
            const isActive = idx === (heroSlide % rawImages.length);
            return T.jsx("div", {
              key: "slide-" + idx,
              className: "absolute inset-0 w-full h-full flex items-center justify-center p-4 sm:p-8 cursor-pointer",
              style: {
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
                transition: "opacity 0.75s ease-in-out",
                zIndex: 5
              },
              onClick: () => setLightboxImg(imgUrl),
              title: fullName + " - Angle " + (idx + 1) + " (Click to Enlarge)",
              children: T.jsx("img", {
                src: imgUrl,
                alt: fullName + " Perspective " + (idx + 1),
                className: "featured-hero-clean-img",
                style: {
                  maxHeight: "92%",
                  maxWidth: "96%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: "center",
                  transform: "none",
                  filter: "drop-shadow(0 20px 45px rgba(0, 0, 0, 0.75))",
                  display: "block"
                }
              })
            });
          }),

          /* Top Left Perspective Badge */
          T.jsxs("div", {
            className: "absolute top-5 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 font-mono text-[11px] font-bold tracking-wider",
            children: [
              T.jsx("span", { className: "w-2 h-2 rounded-full bg-[#C59B51] animate-ping shrink-0" }),
              T.jsxs("span", {
                children: [
                  "VIEW ",
                  String((heroSlide % rawImages.length) + 1).padStart(2, "0"),
                  " / ",
                  String(rawImages.length).padStart(2, "0")
                ]
              })
            ]
          }),

          /* Top Right Click to Enlarge Badge */
          T.jsxs("button", {
            type: "button",
            onClick: () => setLightboxImg(rawImages[heroSlide % rawImages.length]),
            className: "absolute top-5 right-6 z-20 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white text-[10px] font-mono uppercase font-bold tracking-widest cursor-pointer transition-all",
            children: ["🔍 Enlarge View"]
          }),

          /* Navigation Controls: Previous / Next Buttons */
          T.jsx("button", {
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              setHeroSlide(prev => (prev - 1 + rawImages.length) % rawImages.length);
            },
            className: "absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center text-xl font-bold cursor-pointer transition-all hover:scale-105",
            "aria-label": "Previous angle",
            children: "‹"
          }),
          T.jsx("button", {
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              setHeroSlide(prev => (prev + 1) % rawImages.length);
            },
            className: "absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center text-xl font-bold cursor-pointer transition-all hover:scale-105",
            "aria-label": "Next angle",
            children: "›"
          }),

          /* Bottom Interactive Perspective Dots / Indicators */
          T.jsx("div", {
            className: "absolute bottom-5 inset-x-0 z-20 flex items-center justify-center gap-2",
            children: rawImages.map((_, dotIdx) => {
              const isCur = dotIdx === (heroSlide % rawImages.length);
              return T.jsx("button", {
                key: "dot-" + dotIdx,
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  setHeroSlide(dotIdx);
                },
                className: "h-2 transition-all duration-300 rounded-full cursor-pointer " + (
                  isCur ? "w-8 bg-[#C59B51]" : "w-2 bg-white/40 hover:bg-white/70"
                ),
                "aria-label": "View angle " + (dotIdx + 1)
              });
            })
          })
        ]
      }),
      `;

js = js.substring(0, s1Start) + newFeaturedHero + js.substring(s1End);
console.log("Successfully updated Section 1 in FLPage!");

// In Section 4B (Compact gallery), clicking a perspective also sets heroSlide to that angle
const galleryClickOld = 'onClick: () => setLightboxImg(imgUrl),';
const galleryClickNew = 'onClick: () => { setHeroSlide(idx + 1); setLightboxImg(imgUrl); },';
if (js.includes(galleryClickOld)) {
  js = js.replace(galleryClickOld, galleryClickNew);
  console.log("Wired gallery clicks to also update heroSlide in FLPage!");
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
