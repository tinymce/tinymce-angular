const path = require('path');

module.exports = (baseConfig: any) => {
  baseConfig.module.rules.push({
    test: /\.css$/,
    use: ['to-string-loader', 'css-loader']
  });
  return baseConfig;
};
