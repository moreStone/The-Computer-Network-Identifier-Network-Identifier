const { callFunction } = require('./cloud');

function getCategories() {
  return callFunction('getCategories');
}

function getAbout() {
  return callFunction('getAbout');
}

module.exports = {
  getCategories,
  getAbout,
};
