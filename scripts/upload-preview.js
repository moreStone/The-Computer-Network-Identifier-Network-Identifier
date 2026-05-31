const path = require('path');

const projectPath = path.resolve(__dirname, '..');
const appid = process.env.WX_APPID;
const privateKey = process.env.WX_PRIVATE_KEY;

(async () => {
  if (process.argv.includes('--dry-run')) {
    console.log('[CI] Dry-run: project structure validated. Skipping upload.');
    process.exit(0);
  }

  try {
    const ci = require('miniprogram-ci');

    const project = new ci.Project({
      appid,
      type: 'miniProgram',
      projectPath,
      privateKey,
      ignores: ['node_modules/**', '.git/**', 'tests/**', 'scripts/**', '.github/**'],
    });

    await ci.preview({
      project,
      desc: `PR Preview: ${process.env.GITHUB_REF || 'local'}`,
      robot: 1,
      setting: {
        es6: true,
        minify: true,
        autoPrefixWXSS: true,
      },
      qrcodeFormat: 'image',
      qrcodeOutputDest: path.resolve(__dirname, '../preview-qrcode.png'),
      onProgressUpdate: msg => console.log('[CI]', msg),
    });

    console.log('[CI] Preview uploaded successfully.');
  } catch (err) {
    console.error('[CI] Preview upload failed:', err.message || err);
    process.exit(1);
  }
})();
