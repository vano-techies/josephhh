const fs = require('fs');
let content = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const oldHeader = 'return T.jsxs("header",{className:`${s==="home"?"fixed":"absolute"} top-0 left-0 w-full z-50 transition-all duration-500 pt-2 md:pt-4 pb-0`,children:[T.jsx("div",{className:"w-full px-2 lg:px-0 max-w-[1600px] mx-auto"';
const newHeader = 'return T.jsxs("header",{className:"absolute top-0 left-0 w-full z-50 transition-all duration-500 pt-2 md:pt-4 pb-0",children:[T.jsx("div",{className:"w-full px-2 lg:px-0 max-w-[1600px] mx-auto"';

if (content.includes(oldHeader)) {
    content = content.replace(oldHeader, newHeader);
    fs.writeFileSync('assets/index-BIZlWqQ7.js', content);
    console.log("Patched successfully");
} else {
    console.log("Could not find oldHeader");
    const idx = content.indexOf('return T.jsxs("header",{className:');
    console.log(content.substring(idx, idx + 200));
}
