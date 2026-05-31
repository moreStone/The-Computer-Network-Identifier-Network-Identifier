const { LOADING_STATE } = require('../../config/constants');
const { getCategories } = require('../../services/category');
const { getArticles } = require('../../services/article');

Page({
  data: {
    categories: [],
    activeCategoryId: '',
    articles: [],
    state: LOADING_STATE.LOADING,
  },

  onLoad() {
    this.initLoad();
  },

  async initLoad() {
    try {
      const res = await getCategories();
      if (res.code === 0) {
        this.setData({ categories: res.data.categories });
      }
      await this.loadArticles();
    } catch (_e) {
      this.setData({ state: LOADING_STATE.ERROR });
    }
  },

  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    if (id === this.data.activeCategoryId) return;
    this.setData({
      activeCategoryId: id,
      articles: [],
      state: LOADING_STATE.LOADING,
    });
    this.loadArticles();
  },

  async loadArticles() {
    try {
      const res = await getArticles({
        page: 1,
        pageSize: 50,
        categoryId: this.data.activeCategoryId || undefined,
      });

      if (res.code === 0) {
        this.setData({
          articles: res.data.articles,
          state: this.data.articles.length ? LOADING_STATE.NORMAL : LOADING_STATE.EMPTY,
        });
      }
    } catch (_e) {
      this.setData({ state: LOADING_STATE.ERROR });
    }
  },
});
