const { LOADING_STATE, LOAD_MORE_STATE } = require('../../config/constants');
const { getArticleDetail } = require('../../services/article');
const { getComments, addComment } = require('../../services/comment');
const { validateComment } = require('../../utils/validator');
const { formatDateTime } = require('../../utils/format');

Page({
  data: {
    article: null,
    comments: [],
    state: LOADING_STATE.LOADING,
    commentPage: 1,
    loadMoreState: LOAD_MORE_STATE.NO_MORE,
    submitting: false,
  },

  onLoad(options) {
    const id = options.id;
    if (!id) {
      this.setData({ state: LOADING_STATE.ERROR });
      return;
    }
    this.articleId = id;
    this.loadAll();
  },

  onShareAppMessage() {
    const { article } = this.data;
    return {
      title: article ? article.title : '文章详情',
      path: `/pages/article/index?id=${this.articleId}`,
    };
  },

  async loadAll() {
    this.setData({ state: LOADING_STATE.LOADING });
    try {
      const res = await getArticleDetail(this.articleId);
      if (res.code === 0) {
        const article = res.data.article;
        article.publishDate = formatDateTime(article.publishDate);
        this.setData({ article, state: LOADING_STATE.NORMAL });
        this.loadComments();
      } else {
        this.setData({ state: LOADING_STATE.ERROR });
      }
    } catch (_e) {
      this.setData({ state: LOADING_STATE.ERROR });
    }
  },

  async loadComments() {
    this.setData({ loadMoreState: LOAD_MORE_STATE.LOADING });
    try {
      const res = await getComments(this.articleId, { page: this.data.commentPage });
      if (res.code === 0) {
        const { comments, hasMore } = res.data;
        const formatted = comments.map(c => ({
          ...c,
          createTime: formatDateTime(c.createTime),
        }));
        this.setData({
          comments: [...this.data.comments, ...formatted],
          loadMoreState: hasMore ? LOAD_MORE_STATE.HAS_MORE : LOAD_MORE_STATE.NO_MORE,
          commentPage: this.data.commentPage + 1,
        });
      }
    } catch (_e) {
      this.setData({ loadMoreState: LOAD_MORE_STATE.ERROR });
    }
  },

  async onCommentSubmit(e) {
    const { content } = e.detail;
    const validation = validateComment(content);
    if (!validation.valid) {
      wx.showToast({ title: validation.message, icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    try {
      const res = await addComment(this.articleId, validation.content);
      if (res.code === 0) {
        wx.showToast({ title: '评论成功', icon: 'success' });
        this.setData({ commentPage: 1, comments: [] });
        await this.loadComments();
      } else {
        wx.showToast({ title: res.message || '评论失败', icon: 'none' });
      }
    } catch (_e) {
      wx.showToast({ title: '评论失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },

  onRetry() {
    this.loadAll();
  },
});
