module.exports = (baseConfig) => {
  baseConfig.module.rules.push({
    test: /\.css$/,
    use: ['to-string-loader', 'css-loader']
  });
  return baseConfig;
};
