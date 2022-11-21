const path = require('path');

const resolveTsconfigPathsToAlias = (
  tsconfigPath = path.resolve(process.cwd(), './tsconfig.json'),
  context,
) => {
  const { paths, baseUrl } = require(tsconfigPath).compilerOptions;
  const aliases = {};
  const pathContext = context || baseUrl;

  Object.keys(paths).forEach((item) => {
    const key = item.replace('/*', '');
    const value = path.resolve(pathContext, paths[item][0].replace('/*', ''));

    aliases[key] = value;
  });
  return aliases;
};

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: resolveTsconfigPathsToAlias(),
    // alias: {
    //   '@src': path.resolve(__dirname, '../src'),
    // },
  },
  module: {
    rules: [
      {
        // 使用 babel-loader 来编译处理 js 和 jsx tsx 文件
        test: /\.(js|jsx|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },
};
