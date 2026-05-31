Component({
  properties: {
    article: {
      type: Object,
      value: null,
    },
  },

  methods: {
    onTap() {
      const { article } = this.data;
      if (article && article._id) {
        wx.navigateTo({ url: `/pages/article/index?id=${article._id}` });
      }
    },
  },
});
