const fs = require('fs');
const vm = require('vm');

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

console.log("Patching to archive default featured cars from admin dash...");

// 1. Replace getCustomFeaturedCars and resolveActiveFeaturedCars
const target1Start = 'function getCustomFeaturedCars() {';
const target1End = 'function useFeaturedCars() {';

const idxStart1 = js.indexOf(target1Start);
const idxEnd1 = js.indexOf(target1End, idxStart1);

if (idxStart1 === -1 || idxEnd1 === -1) {
  console.error("Could not find getCustomFeaturedCars chunk:", idxStart1, idxEnd1);
  process.exit(1);
}

const newGetAndResolve = `const FACTORY_DEFAULT_IDS = ["gle-400d", "range-rover-sport", "lexus-lx570", "porsche-cayenne", "volvo-xc90"];
function isFactoryDefaultCar(c) {
  if (!c) return false;
  if (c.isDefault || c.isArchivedDefault) return true;
  return FACTORY_DEFAULT_IDS.includes(c.id);
}
function getCustomFeaturedCars() {
  let list = [];
  if (typeof window !== "undefined" && window.__MRJOSEPH_CUSTOM_FEATURED && Array.isArray(window.__MRJOSEPH_CUSTOM_FEATURED)) {
    list = window.__MRJOSEPH_CUSTOM_FEATURED;
  } else {
    try {
      const raw = localStorage.getItem("mrjoseph_custom_featured_cars");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) list = parsed;
      }
    } catch (_) {}
  }
  return list.filter(c => c && !c.archived && !c.isArchived && !isFactoryDefaultCar(c));
}
function resolveActiveFeaturedCars() {
  const customList = getCustomFeaturedCars();
  if (customList.length > 0) {
    return customList;
  }
  return DEFAULT_FEATURED_CARS;
}
`;

js = js.substring(0, idxStart1) + newGetAndResolve + js.substring(idxEnd1);
console.log("Updated getCustomFeaturedCars and resolveActiveFeaturedCars successfully.");

// 2. Also ensure useFeaturedCars filters out default cars when parsing remote docs
js = js.replace(
  /\.filter\(c => !c\.archived\)\.sort\(\(a, b\) => \(a\.order \|\| 0\) - \(b\.order \|\| 0\)\);/g,
  '.filter(c => !c.archived && !isFactoryDefaultCar(c)).sort((a, b) => (a.order || 0) - (b.order || 0));'
);

js = js.replace(
  /\.filter\(c => !c\.archived && !c\.isArchived\)/g,
  '.filter(c => !c.archived && !c.isArchived && !isFactoryDefaultCar(c))'
);

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
