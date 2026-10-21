const fs = require('fs');
const vm = require('vm');

console.log("Deleting Technical Dossier & Provenance section as requested...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const startTarget = '/* 6. TECHNICAL DOSSIER & PROVENANCE SPECIFICATIONS SECTION */';
const endTarget = '/* ========================================================================= */\n      /* 7. FLOATING SCROLL TO TOP';

let startIdx = js.indexOf(startTarget);
if (startIdx === -1) {
  startIdx = js.indexOf('/* 6. TECHNICAL DOSSIER');
}
if (startIdx === -1) {
  startIdx = js.indexOf('id: "specifications-section"');
  // Back up to section start
  startIdx = js.lastIndexOf('T.jsx("section", {', startIdx);
}

let endIdx = js.indexOf('/* 7. FLOATING SCROLL TO TOP');
if (endIdx === -1) {
  endIdx = js.indexOf('id: "specifications-section"');
  endIdx = js.indexOf('T.jsx("button", {', endIdx);
} else {
  // Back up to the comment separator if present
  const sepIdx = js.lastIndexOf('/* ========================================================================= */', endIdx);
  if (sepIdx !== -1 && sepIdx > startIdx) {
    endIdx = sepIdx;
  }
}

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find section boundaries:", startIdx, endIdx);
  process.exit(1);
}

js = js.substring(0, startIdx) + js.substring(endIdx);
console.log("Successfully deleted specifications section!");

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
