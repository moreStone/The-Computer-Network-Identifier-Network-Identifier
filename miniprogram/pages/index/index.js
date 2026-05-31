const { LOADING_STATE, LOAD_MORE_STATE } = require('../../config/constants');
const { getArticles } = require('../../services/article');
const { getCategories } = require('../../services/category');

Page({
  data: {
    state: LOADING_STATE.LOADING,
    articles: [],
    categories: [],
    activeCategoryId: '',
    page: 1,
    loadMoreState: LOAD_MORE_STATE.HAS_MORE,
  },

  onLoad() {
    this.initLoad();
  },

  onShow() {
    if (this.data.articles.length > 0) {
      this.loadArticles(true);
    }
  },

  onPullDownRefresh() {
    this.setData({ page: 1, articles: [], loadMoreState: LOAD_MORE_STATE.HAS_MORE });
    Promise.all([this.loadCategories(), this.loadArticles()]).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.loadMoreState === LOAD_MORE_STATE.HAS_MORE) {
      this.loadArticles();
    }
  },

  async initLoad() {
    this.setData({ state: LOADING_STATE.LOADING });
    try {
      await Promise.all([this.loadCategories(), this.loadArticles()]);
      this.setData({
        state: this.data.articles.length ? LOADING_STATE.NORMAL : LOADING_STATE.EMPTY,
      });
    } catch (_e) {
      this.setData({ state: LOADING_STATE.ERROR });
    }
  },

  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    const categoryId = id === this.data.activeCategoryId ? '' : id;
    this.setData({
      activeCategoryId: categoryId,
      page: 1,
      articles: [],
      loadMoreState: LOAD_MORE_STATE.HAS_MORE,
      state: LOADING_STATE.LOADING,
    });
    this.loadArticles();
  },

  onRetry() {
    this.setData({ state: LOADING_STATE.LOADING, page: 1, articles: [] });
    this.loadArticles();
  },

  async loadCategories() {
    try {
      const res = await getCategories();
      if (res.code === 0) {
        this.setData({ categories: res.data.categories });
      }
    } catch (_e) {
      // categories are non-critical
    }
  },

  async loadArticles(silent) {
    if (!silent) {
      this.setData({ loadMoreState: LOAD_MORE_STATE.LOADING });
    }

    try {
      const { page, activeCategoryId } = this.data;
      const res = await getArticles({
        page,
        categoryId: activeCategoryId || undefined,
      });

      if (res.code === 0) {
        const { articles, hasMore } = res.data;
        this.setData({
          articles: [...this.data.articles, ...articles],
          loadMoreState: hasMore ? LOAD_MORE_STATE.HAS_MORE : LOAD_MORE_STATE.NO_MORE,
          state: LOADING_STATE.NORMAL,
          page: page + 1,
        });

        if (!silent) {
          this.setData({
            state: this.data.articles.length ? LOADING_STATE.NORMAL : LOADING_STATE.EMPTY,
          });
        }
      } else {
        throw new Error(res.message);
      }
    } catch (_e) {
      this.setData({
        loadMoreState: LOAD_MORE_STATE.ERROR,
        state: silent ? this.data.state : LOADING_STATE.ERROR,
      });
    }
  },
});
