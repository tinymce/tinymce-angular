const path = require('path');

module.exports = async ({ config }: any) => {
  // Remove Storybook's default loaders for css
  config.module.rules = config.module.rules.filter((rule: any) => rule.test.toString() !== '/\\.css$/');

  config.module.rules.push({
    test: /\.css$/,
    use: ['to-string-loader', 'css-loader']
  });

  return config;
};
