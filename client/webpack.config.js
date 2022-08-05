const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "src", "app.tsx"),
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    compress: true,
    historyApiFallback: true,
    port: 9000,
  },
  devtool: "source-map-loader",
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js|jsx)?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        exclude: /(node_modules|bower_components)/,
        enforce: "pre",
      },
      {
        test: /\.(sass|less|css)$/,
        loaders: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "src/img/",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Schedule",
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ],
  watch: true,
};
