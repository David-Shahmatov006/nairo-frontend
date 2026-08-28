const path = require("path");

// Vite resolves asset imports to a URL string. Mirror that instead of stubbing
// an empty value, so code that relies on the import being truthy behaves the
// same in tests as it does in the browser.
module.exports = {
  process(_sourceText, sourcePath) {
    const url = `/assets/${path.basename(sourcePath)}`;

    return { code: `module.exports = ${JSON.stringify(url)};` };
  },
  getCacheKey(_sourceText, sourcePath) {
    return `assetTransform:${sourcePath}`;
  },
};
