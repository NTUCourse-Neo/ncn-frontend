const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1500,
  viewportHeight: 900,
  projectId: "79x2jm",
  env: {
    API_ENDPOINT: "",
    API_VERSION: "",
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:3000/",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});