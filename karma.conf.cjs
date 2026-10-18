process.env.CHROME_BIN = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const webpack = require("webpack");
process.env.BABEL_ENV = "test";

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],
files: [
  { pattern: "src/tests/**/*.spec.js", watched: false },
  { pattern: "src/tests/**/*.spec.jsx", watched: false },
],
preprocessors: {
  "src/tests/**/*.spec.js": ["webpack"],
  "src/tests/**/*.spec.jsx": ["webpack"],
},
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: { extensions: [".js", ".jsx"], fullySpecified: false },
      module: {
        rules: [
          { test: /\.m?js$/, resolve: { fullySpecified: false } },
          { test: /\.jsx?$/, exclude: /node_modules/, use: { loader: "babel-loader" } },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({ "import.meta.env": JSON.stringify({ BASE_URL: "/" }) }),
      ],
    },
    reporters: ["spec", "coverage"],
    coverageReporter: {
      dir: "coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "text" },
        { type: "text-summary" },
        { type: "lcovonly", subdir: "." },
      ],
    },
    browsers: ["ChromeHeadless"],
    singleRun: false,
    restartOnFileChange: true,
  });
};