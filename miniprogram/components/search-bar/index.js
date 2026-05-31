Component({
  properties: {
    autofocus: {
      type: Boolean,
      value: false,
    },
    value: {
      type: String,
      value: '',
    },
    placeholder: {
      type: String,
      value: '搜索文章...',
    },
  },

  methods: {
    onInput(e) {
      this.triggerEvent('search', { keyword: e.detail.value });
    },

    onConfirm(e) {
      this.triggerEvent('search', { keyword: e.detail.value });
    },
  },
});
