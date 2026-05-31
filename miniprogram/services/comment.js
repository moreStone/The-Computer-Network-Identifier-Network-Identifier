const { callFunction } = require('./cloud');
const { COMMENT_PAGE_SIZE } = require('../config/constants');

function getComments(articleId, { page = 1, pageSize = COMMENT_PAGE_SIZE } = {}) {
  return callFunction('getComments', {
    articleId,
    page,
    pageSize,
  });
}

function addComment(articleId, content, replyTo) {
  return callFunction('addComment', {
    articleId,
    content,
    replyTo: replyTo || null,
  });
}

module.exports = {
  getComments,
  addComment,
};
