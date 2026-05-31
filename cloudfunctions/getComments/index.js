const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async event => {
  const { articleId, page = 1, pageSize = 20 } = event;
  if (!articleId) {
    return { code: -1, message: 'Missing articleId' };
  }

  const skip = (Math.max(1, page) - 1) * pageSize;

  try {
    const [countResult, listResult] = await Promise.all([
      db.collection('comments').where({ articleId }).count(),
      db
        .collection('comments')
        .where({ articleId })
        .orderBy('createTime', 'desc')
        .skip(skip)
        .limit(pageSize)
        .get(),
    ]);

    return {
      code: 0,
      data: {
        comments: listResult.data,
        total: countResult.total,
        page,
        pageSize,
        hasMore: skip + listResult.data.length < countResult.total,
      },
    };
  } catch (err) {
    return { code: -1, message: err.message };
  }
};
