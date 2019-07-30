module.exports = async ({ config }) => {
  // Remove Storybook's default loaders for css
  config.module.rules = config.module.rules.filter((rule) => rule.test.toString() !== '/\\.css$/');

  config.module.rules.push({
    test: /\.css$/,
    use: ['to-string-loader', 'css-loader']
  });

  return config;
};
