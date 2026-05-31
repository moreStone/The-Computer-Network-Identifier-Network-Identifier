const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async event => {
  const { page = 1, pageSize = 10, categoryId } = event;
  const skip = (Math.max(1, page) - 1) * pageSize;

  const where = { isPublished: true };
  if (categoryId) {
    where.categoryId = categoryId;
  }

  try {
    const [countResult, listResult] = await Promise.all([
      db.collection('articles').where(where).count(),
      db
        .collection('articles')
        .where(where)
        .orderBy('createTime', 'desc')
        .skip(skip)
        .limit(pageSize)
        .field({
          title: true,
          summary: true,
          cover: true,
          tags: true,
          categoryId: true,
          viewCount: true,
          commentCount: true,
          publishDate: true,
          createTime: true,
        })
        .get(),
    ]);

    return {
      code: 0,
      data: {
        articles: listResult.data,
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
