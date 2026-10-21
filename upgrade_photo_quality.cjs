const fs = require('fs');
const vm = require('vm');

console.log("Upgrading image upload resolution, quality, and CSS rendering to ultra-high fidelity...");

let js = fs.readFileSync('assets/index-BIZlWqQ7.js', 'utf8');

// 1. Upgrade FeaturedCarsAdminStudio image compression (from 850px / 0.72 to 1920px / 0.90 with high-quality smoothing)
const oldFeaturedUploadTarget = `          const maxDim = 850;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            }
          } else {
            if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.72);`;

const newFeaturedUpload = `          const maxDim = 1920;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            }
          } else {
            if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.90);`;

if (js.includes(oldFeaturedUploadTarget)) {
  js = js.replace(oldFeaturedUploadTarget, newFeaturedUpload);
  console.log("Upgraded FeaturedCarsAdminStudio upload to 1920px @ 0.90 high quality!");
} else {
  console.warn("Could not find exact oldFeaturedUploadTarget in JS!");
}

// 2. Upgrade vehicle form upload compression (from 600px / 0.30 to 1920px / 0.88)
const oldVehicleUploadTarget = `const Ne=document.createElement("canvas"),De=600,ct=600;let Ye=ge.width,pn=ge.height;Ye>pn?Ye>De&&(pn*=De/Ye,Ye=De):pn>ct&&(Ye*=ct/pn,pn=ct),Ne.width=Ye,Ne.height=pn;const un=Ne.getContext("2d");if(un){un.drawImage(ge,0,0,Ye,pn);const mn=Ne.toDataURL("image/webp",.3);`;

const newVehicleUpload = `const Ne=document.createElement("canvas"),De=1920,ct=1920;let Ye=ge.width,pn=ge.height;Ye>pn?Ye>De&&(pn*=De/Ye,Ye=De):pn>ct&&(Ye*=ct/pn,pn=ct),Ne.width=Ye,Ne.height=pn;const un=Ne.getContext("2d");if(un){un.imageSmoothingEnabled=true;un.imageSmoothingQuality="high";un.drawImage(ge,0,0,Ye,pn);const mn=Ne.toDataURL("image/webp",.88);`;

if (js.includes(oldVehicleUploadTarget)) {
  js = js.replace(oldVehicleUploadTarget, newVehicleUpload);
  console.log("Upgraded vehicle form upload to 1920px @ 0.88 high quality!");
} else {
  console.warn("Could not find exact oldVehicleUploadTarget in JS!");
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
