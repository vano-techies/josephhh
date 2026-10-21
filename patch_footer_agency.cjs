const fs = require('fs');
const vm = require('vm');

console.log("Updating footer attribution to 'site created by afzet agency' (in italics)...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const oldTarget = '"site created by Vano-Techies"';
const newTarget = 'T.jsx("span",{className:"italic",style:{fontStyle:"italic"},children:"site created by afzet agency"})';

if (!js.includes(oldTarget)) {
  console.error("Could not find oldTarget:", oldTarget);
  process.exit(1);
}

js = js.replace(oldTarget, newTarget);
console.log("Replaced footer attribution successfully!");

// Also update liability clause in Terms of Service
const oldTos = 'associates, or Vano-Techies be liable';
const newTos = 'associates, or afzet agency be liable';
if (js.includes(oldTos)) {
  js = js.replace(oldTos, newTos);
  console.log("Replaced TOS mention successfully!");
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
