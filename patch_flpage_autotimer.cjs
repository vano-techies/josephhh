const fs = require('fs');
const vm = require('vm');

console.log("Adding auto-alternating timer to Featured Car hero section in FLPage...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const targetStr = `  const [lightboxImg, setLightboxImg] = Fe.useState(null);
  const [heroSlide, setHeroSlide] = Fe.useState(0);
  const [isHeroPaused, setIsHeroPaused] = Fe.useState(false);

  Fe.useEffect(() => {
    window.scrollTo(0, 0);
  }, [sId]);`;

const targetIdx = js.indexOf(targetStr);
if (targetIdx === -1) {
  console.error("Could not find targetStr!");
  process.exit(1);
}

const replacement = `  const [lightboxImg, setLightboxImg] = Fe.useState(null);
  const [heroSlide, setHeroSlide] = Fe.useState(0);
  const numImages = (car && car.images && car.images.length) ? car.images.length : (car && car.image ? 1 : 0);

  // Auto-advance timer: smoothly alternates vehicle photos on its own without pressing buttons
  Fe.useEffect(() => {
    window.scrollTo(0, 0);
    setHeroSlide(0);
  }, [sId]);

  Fe.useEffect(() => {
    if (numImages <= 1 || lightboxImg) return;
    const interval = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % numImages);
    }, 3200);
    return () => clearInterval(interval);
  }, [numImages, lightboxImg]);`;

js = js.substring(0, targetIdx) + replacement + js.substring(targetIdx + targetStr.length);
console.log("Successfully replaced state and added auto-advance timer!");

// Also remove onMouseEnter / onMouseLeave pausing so it keeps alternating freely on its own without stopping
const mouseEnterOld = 'onMouseEnter: () => setIsHeroPaused(true),\n        onMouseLeave: () => setIsHeroPaused(false),';
if (js.includes(mouseEnterOld)) {
  js = js.replace(mouseEnterOld, '');
  console.log("Removed hover pause restriction so it alternates continuously on its own!");
} else {
  // Try single line
  const mouseEnterOld2 = 'onMouseEnter: () => setIsHeroPaused(true),        onMouseLeave: () => setIsHeroPaused(false),';
  if (js.includes(mouseEnterOld2)) {
    js = js.replace(mouseEnterOld2, '');
    console.log("Removed single-line hover pause restriction!");
  }
}

// In slide click: simply open lightbox without advancing
const slideClickOld = 'onClick: () => { setHeroSlide(idx + 1); setLightboxImg(imgUrl); },';
const slideClickNew = 'onClick: () => setLightboxImg(imgUrl),';
if (js.includes(slideClickOld)) {
  js = js.replace(slideClickOld, slideClickNew);
  console.log("Cleaned up slide onClick in hero section!");
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
