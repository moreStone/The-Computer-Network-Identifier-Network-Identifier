const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async event => {
  const { articleId, content, replyTo } = event;
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  if (!openid) {
    return { code: -1, message: 'Please login first' };
  }

  if (!articleId || !content || !content.trim()) {
    return { code: -1, message: 'Invalid params' };
  }

  const trimmed = content.trim();
  if (trimmed.length > 500) {
    return { code: -1, message: 'Comment too long (max 500 chars)' };
  }

  try {
    const article = await db.collection('articles').doc(articleId).get();
    if (!article.data || !article.data.isPublished) {
      return { code: -1, message: 'Article not found' };
    }
  } catch (_e) {
    return { code: -1, message: 'Article not found' };
  }

  try {
    const [addResult] = await Promise.all([
      db.collection('comments').add({
        data: {
          _openid: openid,
          articleId,
          content: trimmed,
          replyTo: replyTo || null,
          createTime: db.serverDate(),
        },
      }),
      db
        .collection('articles')
        .doc(articleId)
        .update({
          data: {
            commentCount: db.command.inc(1),
          },
        }),
    ]);

    return {
      code: 0,
      data: {
        commentId: addResult._id,
      },
    };
  } catch (err) {
    return { code: -1, message: err.message };
  }
};
