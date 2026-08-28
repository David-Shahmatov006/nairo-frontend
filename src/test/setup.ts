// @testing-library/dom is an explicit devDependency even though nothing imports
// it directly: yarn 1 does not install peers, and jest-dom throws on load
// without it.
import "@testing-library/jest-dom";
