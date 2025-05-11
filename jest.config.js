/**
 * Jest configuration
 * See full option list: https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Clear mock calls & instances between tests
  clearMocks: true,

  // Collect coverage and output to ./coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',

  /**
   * ✅  Only run test files that end with .test.js / .test.jsx / .test.ts / .test.tsx
   *     This skips Angular‑style *.spec.js files that break in a Node environment.
   */
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],

  // Ignore everything in node_modules
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],

  // Use the Node test environment
  testEnvironment: 'node',
};

module.exports = config;
