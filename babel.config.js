module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "commonjs",
        targets: "node >= 18",
      },
    ],
  ],
};
