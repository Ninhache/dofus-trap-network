// shared config (dev and prod)
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./index.tsx",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      '@components': resolve(__dirname, "../../src/components"),
      '@classes': resolve(__dirname, "../../src/classes"),
      '@assets': resolve(__dirname, "../../src/assets"),
      '@json': resolve(__dirname, "../../src/json"),
      '@src': resolve(__dirname, "../../src")
    }
  },
  context: resolve(__dirname, "../../src"),
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(scss|sass)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          "file-loader?hash=sha512&digest=hex&name=img/[contenthash].[ext]",
        ],
      }
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "index.html.ejs" })],
};
