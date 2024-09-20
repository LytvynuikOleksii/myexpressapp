// jest.config.js

module.exports = {
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  testTimeout: 30000,
};
