const { LOADING_STATE, LOAD_MORE_STATE } = require('../../config/constants');

Page({
  data: {
    state: LOADING_STATE.IDLE,
    articles: [],
    page: 1,
    loadMoreState: LOAD_MORE_STATE.HAS_MORE,
  },

  onLoad() {
    this.loadArticles();
  },

  onPullDownRefresh() {
    this.setData({ page: 1, articles: [], loadMoreState: LOAD_MORE_STATE.HAS_MORE });
    this.loadArticles().then(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    if (this.data.loadMoreState === LOAD_MORE_STATE.HAS_MORE) {
      this.loadArticles();
    }
  },

  loadArticles() {
    // Stub: will be implemented when cloud functions are ready
  },
});
