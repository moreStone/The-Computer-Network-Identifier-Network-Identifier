const path = require('path');

const projectPath = path.resolve(__dirname, '..');
const appid = process.env.WX_APPID;
const privateKey = process.env.WX_PRIVATE_KEY;

(async () => {
  try {
    const ci = require('miniprogram-ci');

    const project = new ci.Project({
      appid,
      type: 'miniProgram',
      projectPath,
      privateKey,
      ignores: ['node_modules/**', '.git/**', 'tests/**', 'scripts/**', '.github/**'],
    });

    const version = process.env.VERSION || '1.0.0';

    await ci.upload({
      project,
      version,
      desc: `Production upload: v${version}`,
      robot: 1,
      setting: {
        es6: true,
        minify: true,
        autoPrefixWXSS: true,
      },
      onProgressUpdate: msg => console.log('[CI]', msg),
    });

    console.log(`[CI] Production v${version} uploaded successfully.`);
  } catch (err) {
    console.error('[CI] Production upload failed:', err.message || err);
    process.exit(1);
  }
})();
