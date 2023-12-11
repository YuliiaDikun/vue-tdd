module.exports = {
  globals: {
    fetch,
    Headers,
    Request,
    Response,
    FormData,
    Blob,
  },
  setupFiles: ["./jest.polyfills.js"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.vue$": "@vue/vue3-jest",
  },
  testEnvironment: "jsdom",

  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};
