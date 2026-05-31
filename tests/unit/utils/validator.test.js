const {
  validateComment,
  validateSearchKeyword,
  validateArticleId,
} = require('../../../miniprogram/utils/validator');

describe('validateComment', () => {
  test('accepts valid comment', () => {
    const result = validateComment('好文章');
    expect(result.valid).toBe(true);
    expect(result.content).toBe('好文章');
  });

  test('trims whitespace', () => {
    const result = validateComment('  你好  ');
    expect(result.content).toBe('你好');
  });

  test('rejects empty string', () => {
    const result = validateComment('');
    expect(result.valid).toBe(false);
  });

  test('rejects whitespace-only string', () => {
    const result = validateComment('   ');
    expect(result.valid).toBe(false);
  });

  test('rejects null', () => {
    const result = validateComment(null);
    expect(result.valid).toBe(false);
  });

  test('rejects content exceeding max length', () => {
    const long = 'a'.repeat(501);
    const result = validateComment(long);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('500');
  });
});

describe('validateSearchKeyword', () => {
  test('accepts valid keyword', () => {
    const result = validateSearchKeyword('博客');
    expect(result.valid).toBe(true);
    expect(result.keyword).toBe('博客');
  });

  test('rejects empty keyword', () => {
    expect(validateSearchKeyword('').valid).toBe(false);
  });

  test('rejects keyword over 50 chars', () => {
    const long = 'a'.repeat(51);
    expect(validateSearchKeyword(long).valid).toBe(false);
  });
});

describe('validateArticleId', () => {
  test('accepts valid string id', () => {
    expect(validateArticleId('abc123').valid).toBe(true);
  });

  test('rejects empty id', () => {
    expect(validateArticleId('').valid).toBe(false);
  });

  test('rejects non-string id', () => {
    expect(validateArticleId(123).valid).toBe(false);
  });
});
