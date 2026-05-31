const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async event => {
  const { id } = event;
  if (!id) {
    return { code: -1, message: 'Missing article id' };
  }

  try {
    // eslint-disable-next-line no-unused-vars
    const [articleResult, _updateResult] = await Promise.all([
      db.collection('articles').doc(id).get(),
      db
        .collection('articles')
        .doc(id)
        .update({
          data: {
            viewCount: db.command.inc(1),
          },
        }),
    ]);

    const article = articleResult.data;
    if (!article || !article.isPublished) {
      return { code: -1, message: 'Article not found' };
    }

    return { code: 0, data: { article } };
  } catch (err) {
    return { code: -1, message: err.message };
  }
};
