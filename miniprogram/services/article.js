const { callFunction } = require('./cloud');
const { PAGE_SIZE } = require('../config/constants');

function getArticles({ page = 1, pageSize = PAGE_SIZE, categoryId } = {}) {
  return callFunction('getArticles', {
    page,
    pageSize,
    categoryId: categoryId || null,
  });
}

function getArticleDetail(id) {
  return callFunction('getArticleDetail', { id });
}

function searchArticles({ keyword, page = 1, pageSize = PAGE_SIZE } = {}) {
  return callFunction('searchArticles', {
    keyword,
    page,
    pageSize,
  });
}

module.exports = {
  getArticles,
  getArticleDetail,
  searchArticles,
};
