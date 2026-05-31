const { LOADING_STATE } = require('../../config/constants');
const { searchArticles } = require('../../services/article');
const { validateSearchKeyword } = require('../../utils/validator');

Page({
  data: {
    keyword: '',
    results: [],
    searched: false,
    loading: false,
    state: LOADING_STATE.IDLE,
  },

  onSearch(e) {
    const { keyword } = e.detail;
    const validation = validateSearchKeyword(keyword);
    if (!validation.valid) {
      wx.showToast({ title: validation.message, icon: 'none' });
      return;
    }

    this.setData({
      keyword: validation.keyword,
      loading: true,
      state: LOADING_STATE.LOADING,
      searched: true,
    });

    searchArticles({ keyword: validation.keyword })
      .then(res => {
        if (res.code === 0) {
          this.setData({
            results: res.data.articles,
            state: res.data.articles.length ? LOADING_STATE.NORMAL : LOADING_STATE.EMPTY,
          });
        } else {
          this.setData({ state: LOADING_STATE.ERROR });
        }
      })
      .catch(_e => {
        this.setData({ state: LOADING_STATE.ERROR });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
});
