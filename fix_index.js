const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Add preloads in the head
const preloads = `
    <link rel="preconnect" href="https://images.unsplash.com" />
    <link rel="preload" as="image" href="/logo.png" />
    <link rel="preload" href="/assets/index-C8QovHjD.css" as="style" />
    <link rel="modulepreload" href="/assets/index-BIZlWqQ7.js" />
`;

html = html.replace('</head>', preloads + '</head>');

// Add instant loader in root
const loader = `<div id="root">
      <style>
        .initial-loader {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: #0a0a0a;
          display: flex; align-items: center; justify-content: center;
          z-index: 99999;
        }
        .initial-loader-spinner {
          width: 40px; height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      </style>
      <div class="initial-loader">
        <div class="initial-loader-spinner"></div>
      </div>
    </div>`;

html = html.replace('<div id="root"></div>', loader);

fs.writeFileSync('index.html', html);
