const commentService = require('../../../miniprogram/services/comment');

describe('comment service', () => {
  beforeEach(() => {
    wx.cloud.callFunction.mockResolvedValue({
      result: { code: 0, data: { comments: [], total: 0 } },
    });
    wx.cloud.callFunction.calls = [];
  });

  function getLastCallData() {
    const calls = wx.cloud.callFunction.calls;
    return calls[calls.length - 1][0];
  }

  describe('getComments', () => {
    test('calls getComments with articleId and default pagination', async () => {
      await commentService.getComments('art001', {});
      const callArg = getLastCallData();
      expect(callArg.name).toBe('getComments');
      expect(callArg.data).toEqual({ articleId: 'art001', page: 1, pageSize: 20 });
    });

    test('passes custom page options', async () => {
      await commentService.getComments('art001', { page: 3, pageSize: 10 });
      const callArg = getLastCallData();
      expect(callArg.data).toEqual({ articleId: 'art001', page: 3, pageSize: 10 });
    });
  });

  describe('addComment', () => {
    test('calls addComment with required fields', async () => {
      await commentService.addComment('art001', 'great post');
      const callArg = getLastCallData();
      expect(callArg.name).toBe('addComment');
      expect(callArg.data).toEqual({ articleId: 'art001', content: 'great post', replyTo: null });
    });

    test('passes replyTo when provided', async () => {
      await commentService.addComment('art001', 'thanks', 'cmt001');
      const callArg = getLastCallData();
      expect(callArg.data).toEqual({ articleId: 'art001', content: 'thanks', replyTo: 'cmt001' });
    });
  });
});
