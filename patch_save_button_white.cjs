const fs = require('fs');
const vm = require('vm');

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

const targetStart = "const renderSaveButton = (isPrimary = true) => {";
const targetEnd = "  return T.jsxs(\"div\", {";

const startIdx = js.indexOf(targetStart);
if (startIdx === -1) {
  console.error("Could not find targetStart");
  process.exit(1);
}

const endIdx = js.indexOf(targetEnd, startIdx);
if (endIdx === -1) {
  console.error("Could not find targetEnd");
  process.exit(1);
}

const newBlock = `const renderSaveButton = (isPrimary = true) => {
    return T.jsxs("button", {
      type: "button",
      onClick: handleSave,
      disabled: isSaving,
      style: { color: "#ffffff" },
      className: "px-7 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2.5 " + (
        saveSuccess
          ? "bg-emerald-600 !text-white shadow-emerald-500/40 ring-2 ring-emerald-300 scale-105"
          : isSaving
            ? "bg-[#C59B51]/80 !text-white cursor-wait"
            : hasUnsavedChanges
              ? "bg-[#C59B51] hover:bg-[#B38A40] !text-white ring-2 ring-white/50 shadow-xl hover:scale-102"
              : isPrimary
                ? "bg-[#C59B51] hover:bg-[#B38A40] !text-white shadow-md hover:scale-102"
                : "bg-white/15 hover:bg-white/25 !text-white border border-white/20 shadow-md hover:scale-102"
      ),
      children: [
        isSaving
          ? T.jsx("span", { className: "animate-spin text-sm leading-none inline-block text-white", style: { color: "#ffffff" }, children: "⟳" })
          : saveSuccess
            ? T.jsx("span", { className: "text-base font-black leading-none text-white", style: { color: "#ffffff" }, children: "✓" })
            : T.jsx("span", { className: "text-sm leading-none text-white", style: { color: "#ffffff" }, children: "💾" }),
        T.jsx("span", {
          style: { color: "#ffffff", fontWeight: 800 },
          className: "text-white font-extrabold tracking-widest",
          children: isSaving
            ? "Saving Changes..."
            : saveSuccess
              ? "Saved Successfully!"
              : "Save All Changes"
        })
      ]
    });
  };
`;

js = js.substring(0, startIdx) + newBlock + js.substring(endIdx);

// Validate JS syntax
try {
  new vm.Script(js);
  console.log("Syntax validation PASSED!");
} catch (e) {
  console.error("Syntax validation FAILED:", e);
  process.exit(1);
}

fs.writeFileSync('assets/index-BIZlWqQ7.js', js);
console.log("Successfully updated renderSaveButton in assets/index-BIZlWqQ7.js!");
