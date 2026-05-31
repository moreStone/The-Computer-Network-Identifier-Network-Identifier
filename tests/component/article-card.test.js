/**
 * Component test: article-card
 * Uses miniprogram-simulate (requires jsdom environment).
 *
 * npm run test:component
 */
const path = require('path');
const simulate = require('miniprogram-simulate');

const componentPath = path.resolve(__dirname, '../../miniprogram/components/article-card/index');

describe('article-card', () => {
  let component;

  beforeEach(() => {
    component = simulate.render(simulate.load(componentPath));
  });

  test('renders article title', () => {
    component.setData({
      article: {
        _id: '001',
        title: 'Test Article',
        summary: 'A test summary',
        cover: '/assets/images/default-cover.png',
        tags: ['blog'],
        publishDate: '2024-01-15',
      },
    });

    const titleEl = component.querySelector('.article-title');
    expect(titleEl).toBeTruthy();
  });

  test('does not render when article is null', () => {
    component.setData({ article: null });
    const card = component.querySelector('.article-card');
    expect(card).toBeFalsy();
  });
});
