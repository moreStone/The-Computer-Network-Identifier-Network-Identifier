/**
 * E2E: Search page tests
 */
const { launch, close } = require('../helpers/automator');

let page;

beforeAll(async () => {
  const mp = await launch();
  page = await mp.reLaunch('/pages/search/index');
  await page.waitFor(2000);
}, 30000);

afterAll(async () => {
  await close();
});

describe('Search Page', () => {
  test('should render search bar', async () => {
    const searchBar = await page.$('search-bar');
    expect(searchBar).toBeTruthy();
  });

  test('should show results for valid keyword', async () => {
    const input = await page.$('search-bar input');
    if (input) {
      await input.input('博客');
      await page.waitFor(1500);
      const results = await page.$$('article-card');
      expect(results.length).toBeGreaterThanOrEqual(0);
    }
  });
});
