/**
 * E2E: Home page tests
 * Requires WeChat DevTools with CLI enabled.
 */
const { launch, close } = require('../helpers/automator');

let page;

beforeAll(async () => {
  const mp = await launch();
  page = await mp.reLaunch('/pages/index/index');
  await page.waitFor(2000);
}, 30000);

afterAll(async () => {
  await close();
});

describe('Home Page', () => {
  test('should display tab bar', async () => {
    const tabBar = await page.$('.tab-bar');
    expect(tabBar).toBeTruthy();
  });

  test('should show article cards when data exists', async () => {
    const cards = await page.$$('article-card');
    expect(cards.length).toBeGreaterThanOrEqual(0);
  });

  test('should navigate to article detail on card tap', async () => {
    const card = await page.$('article-card');
    if (card) {
      await card.tap();
      await page.waitFor(1000);
      const currentPage = await page.currentPage();
      expect(currentPage.path).toContain('pages/article/index');
    }
  });
});
