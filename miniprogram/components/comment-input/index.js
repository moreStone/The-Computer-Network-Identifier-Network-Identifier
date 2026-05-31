Component({
  data: {
    inputValue: '',
  },

  methods: {
    onInput(e) {
      this.setData({ inputValue: e.detail.value });
    },

    onSubmit() {
      const content = this.data.inputValue.trim();
      if (!content) return;
      this.triggerEvent('submit', { content });
      this.setData({ inputValue: '' });
    },
  },
});
