module.exports = {
  "resetMocks": true,
  "verbose": false,
  "collectCoverage": false,
  "modulePaths": [
    "<rootDir>/src/"
  ],
  "collectCoverageFrom": [
    "src/**/*.{js,jsx}",
    "!**/node_modules/**"
  ],
  "testPathIgnorePatterns": [],
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$",
  "coverageReporters": [
    "json",
    "lcov",
    "text"
  ],
  "setupFiles": [
    './testHelper.js'
  ],
  "globals": {},
}