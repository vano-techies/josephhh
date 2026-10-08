const fs = require('fs');
const vm = require('vm');

// 1. Remove BMW 5 Series from assets/index-BIZlWqQ7.js
let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const bmwStart = js.indexOf('  {    id: "bmw-5-series",');
if (bmwStart === -1) {
  console.error('Could not find bmw-5-series in js');
  process.exit(1);
}

const nextCarStart = js.indexOf('  {    id: "porsche-cayenne",', bmwStart);
if (nextCarStart === -1) {
  console.error('Could not find next car start after bmw');
  process.exit(1);
}

js = js.substring(0, bmwStart) + js.substring(nextCarStart);
console.log('Removed bmw-5-series from array!');

// Verify JS syntax
try {
  new vm.Script(js);
  console.log('JS syntax is valid!');
} catch (err) {
  console.error('Syntax error:', err);
  process.exit(1);
}

fs.writeFileSync('assets/index-BIZlWqQ7.js', js);
console.log('Updated assets/index-BIZlWqQ7.js successfully!');

// 2. Update grid in index.html to repeat(5, 1fr)
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/grid-template-columns:\s*repeat\(6,\s*1fr\);/g, 'grid-template-columns: repeat(5, 1fr);');
fs.writeFileSync('index.html', html);
console.log('Updated index.html CSS grid to repeat(5, 1fr)!');

// 3. Update grid in assets/index-C8QovHjD.css
let css = fs.readFileSync('assets/index-C8QovHjD.css', 'utf8');
css = css.replace(/grid-template-columns:\s*repeat\(6,\s*1fr\);/g, 'grid-template-columns: repeat(5, 1fr);');
fs.writeFileSync('assets/index-C8QovHjD.css', css);
console.log('Updated assets/index-C8QovHjD.css grid to repeat(5, 1fr)!');

