const { LOADING_STATE } = require('../../config/constants');
const { getAbout } = require('../../services/category');

Page({
  data: {
    about: null,
    state: LOADING_STATE.LOADING,
  },

  onLoad() {
    this.loadAbout();
  },

  async loadAbout() {
    this.setData({ state: LOADING_STATE.LOADING });
    try {
      const res = await getAbout();
      if (res.code === 0 && res.data.about) {
        this.setData({ about: res.data.about, state: LOADING_STATE.NORMAL });
      } else {
        this.setData({ state: LOADING_STATE.EMPTY });
      }
    } catch (_e) {
      this.setData({ state: LOADING_STATE.ERROR });
    }
  },

  onRetry() {
    this.loadAbout();
  },

  onShareAppMessage() {
    return {
      title: '关于我',
      path: '/pages/about/index',
    };
  },
});
