const dotenv = require("dotenv");
const webpack = require("webpack");

module.exports = {
  options: {
    buildType: "spa",
    enableBabelCache: false,
  },
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    if (dev) {
      const env = dotenv.config({ path: "../.env" }).parsed;

      // reduce it to a nice object, the same as before
      const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
      }, {});

      config.plugins = [...config.plugins, new webpack.DefinePlugin(envKeys)];
    }
    
    // Ignore fs dependencies so we can use winston
    // if (opts.env.target === 'node' && !opts.env.dev) {
    config.node = { fs: "empty" };
    // }

    return config;
  },
  plugins: ["scss"],
};
