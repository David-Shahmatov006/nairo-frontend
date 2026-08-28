// Used only by babel-jest. Vite's React plugin forces configFile: false,
// so this never affects the production build.
//
// Keep @babel/* pinned to 7.x: babel-plugin-transform-vite-meta-env is built
// against Babel 7 and declares no peer range, so on Babel 8 it fails silently
// and import.meta.env stops being substituted.
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: ["babel-plugin-transform-vite-meta-env"],
};
