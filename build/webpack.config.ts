import path from "path";
import webpack from "webpack";
import TerserPlugin from "terser-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

export enum Mode {
  development = "development",
  production = "production",
}

const rootDir = path.resolve(__dirname, "..");
const dir = {
  root: rootDir,
  src: path.resolve(rootDir, "src"),
  lib: path.resolve(rootDir, "lib"),
  dist: path.resolve(rootDir, "dist"),
};

const common = (mode: Mode): webpack.Configuration => {
  const isDev = mode === Mode.development;
  return {
    mode: "production",
    devtool: isDev ? "inline-source-map" : undefined,
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".css", ".sass", ".scss"],
      alias: {
        "@components": path.resolve(dir.src, "components"),
        "@assets": path.resolve(dir.src, "assets"),
        "@data": path.resolve(dir.src, "data"),
        "@util": path.resolve(dir.src, "util"),
      },
    },
    entry: {
      index: path.resolve(dir.src, "index"),
    },
    output: {
      path: dir.dist,
      filename: "[name].bundle.js",
      chunkFilename: "[name].bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            "babel-loader",
            "ts-loader",
            "eslint-loader",
            path.resolve(__dirname, "loaders/glob-import-loader.ts"),
          ],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            {
              loader: "style-loader",
            },
            // {
            // loader: "@teamsupercell/typings-for-css-modules-loader",
            // options: {
            // formatter: "prettier",
            // },
            // },
            {
              loader: "css-loader",
              options: {
                modules: {
                  auto: true,
                  localIdentName: "[path][name]__[local]--[hash:base64:5]",
                  exportLocalsConvention: "camelCase",
                },
              },
            },
            { loader: "sass-loader" },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          loader: "file-loader",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "StogaCS",
      }),
      new CopyPlugin({
        patterns: ["CNAME"],
      }),
    ],
    optimization: {
      minimize: !isDev,
      minimizer: [
        /* eslint-disable */
        // @ts-ignore
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: isDev,
        }),
        /* eslint-enable */
      ],
    },
    performance: {
      hints: isDev ? false : "warning",
      maxAssetSize: 500000,
      maxEntrypointSize: 500000,
    },
    devServer: {
      contentBase: dir.dist,
    },
  };
};

export default common;
