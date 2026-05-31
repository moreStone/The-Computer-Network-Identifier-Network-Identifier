const articleService = require('../../../miniprogram/services/article');

describe('article service', () => {
  function clearCallFunctionCalls() {
    wx.cloud.callFunction.calls = [];
  }

  beforeEach(() => {
    wx.cloud.callFunction.mockResolvedValue({
      result: { code: 0, data: { articles: [], total: 0 } },
    });
    clearCallFunctionCalls();
  });

  function getLastCallData() {
    const calls = wx.cloud.callFunction.calls;
    return calls[calls.length - 1][0];
  }

  describe('getArticles', () => {
    test('calls getArticles cloud function with defaults', async () => {
      await articleService.getArticles({});
      const callArg = getLastCallData();
      expect(callArg.name).toBe('getArticles');
      expect(callArg.data).toEqual({ page: 1, pageSize: 10, categoryId: null });
    });

    test('passes categoryId when provided', async () => {
      await articleService.getArticles({ page: 1, categoryId: 'cat1' });
      const callArg = getLastCallData();
      expect(callArg.data.categoryId).toBe('cat1');
    });
  });

  describe('getArticleDetail', () => {
    test('calls getArticleDetail with article id', async () => {
      await articleService.getArticleDetail('art001');
      const callArg = getLastCallData();
      expect(callArg.name).toBe('getArticleDetail');
      expect(callArg.data.id).toBe('art001');
    });
  });

  describe('searchArticles', () => {
    test('calls searchArticles with keyword and pagination', async () => {
      await articleService.searchArticles({ keyword: 'React', page: 1 });
      const callArg = getLastCallData();
      expect(callArg.name).toBe('searchArticles');
      expect(callArg.data).toEqual({ keyword: 'React', page: 1, pageSize: 10 });
    });
  });
});
