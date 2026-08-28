/** @type {import('jest').Config} */
export default {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  setupFiles: ["<rootDir>/src/test/env.setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
    "^.+\\.(webp|avif|png|jpe?g|gif|svg|woff2?|ttf|eot|mp4)$":
      "<rootDir>/src/test/assetTransform.cjs",
  },
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  // These packages ship ESM only, so Babel has to transpile them too.
  transformIgnorePatterns: [
    "/node_modules/(?!(file-type|strtok3|token-types|uint8array-extras|@tokenizer|peek-readable|usehooks-ts)/)",
  ],
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/test/**",
    "!src/main.tsx",
  ],
};
