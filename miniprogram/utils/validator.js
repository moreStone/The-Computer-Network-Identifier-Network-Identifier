const { MAX_COMMENT_LENGTH } = require('../config/constants');

function validateComment(content) {
  if (!content || typeof content !== 'string') {
    return { valid: false, message: '评论内容不能为空' };
  }
  const trimmed = content.trim();
  if (!trimmed) {
    return { valid: false, message: '评论内容不能为空' };
  }
  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return { valid: false, message: `评论内容不能超过${MAX_COMMENT_LENGTH}个字符` };
  }
  return { valid: true, content: trimmed };
}

function validateSearchKeyword(keyword) {
  if (!keyword || typeof keyword !== 'string') {
    return { valid: false, message: '搜索关键词不能为空' };
  }
  const trimmed = keyword.trim();
  if (!trimmed) {
    return { valid: false, message: '搜索关键词不能为空' };
  }
  if (trimmed.length > 50) {
    return { valid: false, message: '搜索关键词不能超过50个字符' };
  }
  return { valid: true, keyword: trimmed };
}

function validateArticleId(id) {
  if (!id || typeof id !== 'string') {
    return { valid: false, message: '无效的文章ID' };
  }
  return { valid: true, id };
}

module.exports = {
  validateComment,
  validateSearchKeyword,
  validateArticleId,
};
