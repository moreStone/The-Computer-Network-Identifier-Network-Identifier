const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async _event => {
  try {
    const result = await db.collection('about').doc('about_page').get();
    return { code: 0, data: { about: result.data } };
  } catch (_e) {
    return { code: 0, data: { about: { content: '', avatar: '', socialLinks: [] } } };
  }
};
