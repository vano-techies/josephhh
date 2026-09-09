const fs = require('fs');
let content = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

// 1. Add state
const searchState = `const n=c7(),[i,o]=Fe.useState(t),[u,h]=Fe.useState("newest"),[srch,setSrch]=Fe.useState("");`;
content = content.replace(`const n=c7(),[i,o]=Fe.useState(t),[u,h]=Fe.useState("newest");`, searchState);

// 2. Add search filter
const oldFilter = `let m=n.filter(_=>i==="All"||_.type===i?!0:i==="Kenya"?_.location==="Cars in Kenya"||_.status==="Kenya":i==="Incoming"?_.location==="Incoming Cars"||_.status==="Incoming":!1);`;
const newFilter = `let m=n.filter(_=>i==="All"||_.type===i?!0:i==="Kenya"?_.location==="Cars in Kenya"||_.status==="Kenya":i==="Incoming"?_.location==="Incoming Cars"||_.status==="Incoming":!1).filter(_=>srch===""||_.make.toLowerCase().includes(srch.toLowerCase())||_.model.toLowerCase().includes(srch.toLowerCase())||(_.price&&_.price.toString().includes(srch)));`;
content = content.replace(oldFilter, newFilter);

// 3. Add search UI
const oldUi = `T.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 w-full md:w-auto",children:[T.jsxs("div",{className:"flex items-center justify-between sm:justify-start gap-2 bg-transparent px-4 py-3 border border-[var(--color-base)]/20 w-full sm:w-auto",children:[T.jsxs("div",{className:"flex items-center gap-2"`;

const newUi = `T.jsxs("div",{className:"flex flex-col lg:flex-row gap-4 w-full md:w-auto",children:[T.jsxs("div",{className:"flex items-center justify-between sm:justify-start gap-2 bg-transparent px-4 py-3 border border-[var(--color-base)]/20 w-full sm:w-64",children:[T.jsx("input",{type:"text",placeholder:"Search brand, model...",className:"bg-transparent text-sm font-medium outline-none text-[var(--color-base)] w-full placeholder:text-[var(--color-slate)]/50",value:srch,onChange:_=>setSrch(_.target.value)})]}),T.jsxs("div",{className:"flex items-center justify-between sm:justify-start gap-2 bg-transparent px-4 py-3 border border-[var(--color-base)]/20 w-full sm:w-auto",children:[T.jsxs("div",{className:"flex items-center gap-2"`;

if (content.includes(`T.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 w-full md:w-auto",children:[T.jsxs("div",{className:"flex items-center justify-between sm:justify-start gap-2 bg-transparent px-4 py-3 border border-[var(--color-base)]/20 w-full sm:w-auto",children:[T.jsxs("div",{className:"flex items-center gap-2"`)) {
    content = content.replace(oldUi, newUi);
    fs.writeFileSync('assets/index-BIZlWqQ7.js', content);
    console.log("Patched successfully");
} else {
    console.log("Could not find UI to patch");
    // print what we have
    const idx = content.indexOf(`T.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 w-full md:w-auto"`);
    console.log(content.substring(idx, idx + 300));
}
