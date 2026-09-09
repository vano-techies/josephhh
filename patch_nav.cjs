const fs = require('fs');
let content = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

// Header className
const oldHeader = `return T.jsxs("header",{className:\`fixed top-0 left-0 w-full z-50 transition-all duration-500 pt-2 md:pt-4 pb-0\`,children:[T.jsx("div",{className:"w-full px-2 lg:px-0 max-w-[1600px] mx-auto"`;

const newHeader = `return T.jsxs("header",{className:\`\${s==="home"?"fixed":"absolute"} top-0 left-0 w-full z-50 transition-all duration-500 pt-2 md:pt-4 pb-0\`,children:[T.jsx("div",{className:"w-full px-2 lg:px-0 max-w-[1600px] mx-auto"`;

if (content.includes(oldHeader)) {
    content = content.replace(oldHeader, newHeader);
} else {
    console.log("Could not find oldHeader");
}

// Logo className
const oldLogo = `T.jsx("img",{src:"/logo.png",alt:"Mr Joseph",className:"h-20 sm:h-28 object-contain brightness-0 ml-[-16px] mt-[-12px]"})`;

const newLogo = `T.jsx("img",{src:"/logo.png",alt:"Mr Joseph",className:\`\${s==="home"?"h-20 sm:h-28 ml-[-16px] mt-[-12px]":"h-12 sm:h-14 ml-[-4px] mt-0"} object-contain brightness-0\`})`;

if (content.includes(oldLogo)) {
    content = content.replace(oldLogo, newLogo);
} else {
    console.log("Could not find oldLogo");
}

fs.writeFileSync('assets/index-BIZlWqQ7.js', content);
console.log("Patched successfully");
