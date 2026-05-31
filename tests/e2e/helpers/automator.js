/**
 * Shared automator setup for E2E tests.
 * Requires miniprogram-automator and WeChat DevTools CLI.
 *
 * npm run test:e2e
 */
const automator = require('miniprogram-automator');

let miniProgram;

async function launch() {
  miniProgram = await automator.launch({
    projectPath: require('path').resolve(__dirname, '../../..'),
  });
  return miniProgram;
}

async function close() {
  if (miniProgram) {
    await miniProgram.close();
  }
}

function getMiniProgram() {
  return miniProgram;
}

module.exports = { launch, close, getMiniProgram };
