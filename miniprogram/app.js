const env = require('./config/env');

App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('Please use WeChat base library v2.2.3 or above');
      return;
    }

    wx.cloud.init({
      env: env.CLOUD_ENV_ID,
      traceUser: true,
    });

    this.globalData = {
      env: env.ENV,
      categories: [],
    };
  },
});
