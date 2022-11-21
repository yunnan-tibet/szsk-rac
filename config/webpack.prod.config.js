const path = require('path');
const fs = require('fs-extra');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 用于将组件的css打包成单独的文件输出到`lib`目录中
const baseConfig = require('./webpack.base.js'); // 引用公共的配置

const entryList = { index: path.join(__dirname, '../src/index.tsx') };
const componentsDir = path.join(__dirname, '../src');
const files = fs.readdirSync(componentsDir);
function isDir(dir) {
  return fs.lstatSync(dir).isDirectory();
}
files.forEach((file) => {
  const absolutePath = path.join(componentsDir, file);
  if (isDir(absolutePath)) {
    entryList[file] = `${absolutePath}/index.tsx`;
  }
});

const prodConfig = {
  mode: 'production', // 打包模式
  entry: entryList,
  output: {
    path: path.resolve(process.cwd(), './dist'),
    publicPath: './',
    filename: (chunkData) => {
      return chunkData.chunk.name === 'index' ? '[name].js' : '[name]/index.js';
    },
    library: 'szsk',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    // libraryExport: 'default', // 兼容 ES6 的模块系统、CommonJS 和 AMD 模块规范
  },

  context: process.cwd(),

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      moduleFilename: ({ name }) => {
        return `${name === 'index' ? `${name}` : `${name}/index`}.css`;
      },
    }),
  ],
  externals: {
    // 定义外部依赖，避免把react和react-dom打包进去
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
  },
};

module.exports = merge(prodConfig, baseConfig); // 将baseConfig和prodConfig合并为一个配置
