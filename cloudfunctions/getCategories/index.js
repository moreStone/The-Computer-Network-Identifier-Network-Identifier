const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async _event => {
  try {
    const result = await db.collection('categories').orderBy('sort', 'asc').get();

    return {
      code: 0,
      data: {
        categories: result.data,
      },
    };
  } catch (err) {
    return { code: -1, message: err.message };
  }
};
