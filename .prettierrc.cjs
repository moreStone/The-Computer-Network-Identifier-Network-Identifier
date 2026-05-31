module.exports = {
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: true,
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'avoid',
  trailingComma: 'all',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.wxml',
      options: {
        parser: 'html',
        htmlWhitespaceSensitivity: 'css',
        printWidth: 120,
        bracketSameLine: false,
      },
    },
    {
      files: '*.wxss',
      options: { parser: 'css' },
    },
    {
      files: '*.wxs',
      options: { parser: 'babel' },
    },
    {
      files: '*.json',
      options: { parser: 'json' },
    },
  ],
};
