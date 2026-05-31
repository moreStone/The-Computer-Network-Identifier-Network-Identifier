const {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  truncateText,
  formatViewCount,
  buildPagination,
} = require('../../../miniprogram/utils/format');

describe('formatDate', () => {
  test('formats Date object correctly', () => {
    expect(formatDate(new Date('2024-01-15'))).toBe('2024-01-15');
  });

  test('formats date string correctly', () => {
    expect(formatDate('2024-12-01T10:30:00Z')).toBe('2024-12-01');
  });

  test('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });

  test('returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  test('returns empty string for invalid date', () => {
    expect(formatDate('invalid')).toBe('');
  });
});

describe('formatDateTime', () => {
  test('formats date with time correctly', () => {
    const result = formatDateTime(new Date('2024-06-15T14:30:00'));
    expect(result).toContain('2024-06-15');
    expect(result).toContain(':');
  });

  test('returns empty string for null', () => {
    expect(formatDateTime(null)).toBe('');
  });
});

describe('formatRelativeTime', () => {
  test('returns 刚刚 for very recent time', () => {
    const now = new Date();
    expect(formatRelativeTime(new Date(now.getTime() - 30 * 1000))).toBe('刚刚');
  });

  test('returns minutes ago', () => {
    const now = new Date();
    expect(formatRelativeTime(new Date(now.getTime() - 5 * 60 * 1000))).toBe('5分钟前');
  });

  test('returns hours ago', () => {
    const now = new Date();
    expect(formatRelativeTime(new Date(now.getTime() - 3 * 3600 * 1000))).toBe('3小时前');
  });

  test('returns days ago', () => {
    const now = new Date();
    expect(formatRelativeTime(new Date(now.getTime() - 5 * 86400 * 1000))).toBe('5天前');
  });

  test('returns empty string for null', () => {
    expect(formatRelativeTime(null)).toBe('');
  });
});

describe('truncateText', () => {
  test('returns full text when under max length', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  test('truncates with ellipsis when over max length', () => {
    expect(truncateText('hello world', 8)).toBe('hello wo...');
  });

  test('returns empty string for null', () => {
    expect(truncateText(null, 10)).toBe('');
  });

  test('returns empty string for empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });
});

describe('formatViewCount', () => {
  test('returns "0" for zero', () => {
    expect(formatViewCount(0)).toBe('0');
  });

  test('returns string for small numbers', () => {
    expect(formatViewCount(999)).toBe('999');
  });

  test('formats as k for thousands', () => {
    expect(formatViewCount(1500)).toBe('1.5k');
  });

  test('formats as w for ten-thousands', () => {
    expect(formatViewCount(12000)).toBe('1.2w');
  });

  test('returns "0" for null/undefined', () => {
    expect(formatViewCount(null)).toBe('0');
    expect(formatViewCount(undefined)).toBe('0');
  });
});

describe('buildPagination', () => {
  test('returns first page defaults', () => {
    const result = buildPagination(1);
    expect(result.skip).toBe(0);
    expect(result.limit).toBe(10);
    expect(result.page).toBe(1);
  });

  test('calculates skip correctly for page 3', () => {
    const result = buildPagination(3, 15);
    expect(result.skip).toBe(30);
    expect(result.limit).toBe(15);
    expect(result.page).toBe(3);
  });

  test('clamps page to minimum 1', () => {
    const result = buildPagination(-1);
    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
  });
});
