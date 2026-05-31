module.exports = {
  '*.{js,wxs}': ['eslint --fix', 'prettier --write'],
  '*.{wxml,wxss,css,json,md}': ['prettier --write'],
};
