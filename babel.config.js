module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@app": "./app",
            "@assets": "./assets",
            "@components": "./components",
            "@constants": "./components/constants",
            "@helpers": "./components/helpers",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx", ".png", ".jpg", ".jpeg"],
        },
      ],
    ],
  };
};
