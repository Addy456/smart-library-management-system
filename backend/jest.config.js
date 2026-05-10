/** Jest configuration */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  // Boots the in-memory Mongo (beforeAll/afterAll/afterEach globals used).
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 60000,
  // In-memory Mongo instance is shared — must run serially.
  maxWorkers: 1,
};
