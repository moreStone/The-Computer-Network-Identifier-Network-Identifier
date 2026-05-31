/**
 * One-time script to initialize cloud database collections and indexes.
 * Run via WeChat DevTools CLI or manually in the cloud console.
 *
 * Usage:
 *   1. Open WeChat DevTools -> Cloud Development -> Database
 *   2. Create the collections below manually, OR
 *   3. Run a cloud function that calls db.createCollection().
 *
 * Since createCollection and createIndex are only available in cloud functions
 * or the devtools console, this file serves as documentation and reference.
 */

const COLLECTIONS = [
  {
    name: 'articles',
    indexes: [
      {
        fields: [
          { name: 'isPublished', direction: 'asc' },
          { name: 'createTime', direction: 'desc' },
        ],
      },
      {
        fields: [
          { name: 'categoryId', direction: 'asc' },
          { name: 'createTime', direction: 'desc' },
        ],
      },
      { fields: [{ name: 'tags', direction: 'asc' }] },
    ],
  },
  {
    name: 'comments',
    indexes: [
      {
        fields: [
          { name: 'articleId', direction: 'asc' },
          { name: 'createTime', direction: 'desc' },
        ],
      },
    ],
  },
  {
    name: 'categories',
    indexes: [],
  },
  {
    name: 'about',
    indexes: [],
  },
];

module.exports = { COLLECTIONS };

if (require.main === module) {
  const cloud = require('wx-server-sdk');
  cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
  const db = cloud.database();

  (async () => {
    for (const col of COLLECTIONS) {
      try {
        await db.createCollection(col.name);
        console.log(`[OK] Collection "${col.name}" created.`);
      } catch (err) {
        if (err.errCode === -502005) {
          console.log(`[SKIP] Collection "${col.name}" already exists.`);
        } else {
          console.error(`[FAIL] Collection "${col.name}":`, err);
        }
      }

      for (const idx of col.indexes) {
        try {
          await db.collection(col.name).createIndex({ fields: idx.fields });
          console.log(`[OK] Index on "${col.name}" (${JSON.stringify(idx.fields)}) created.`);
        } catch (err) {
          console.error(`[FAIL] Index on "${col.name}":`, err);
        }
      }
    }
    console.log('[DONE] Database initialization complete.');
  })();
}
