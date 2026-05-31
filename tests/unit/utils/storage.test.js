const storage = require('../../../miniprogram/utils/storage');

describe('storage', () => {
  test('set and get work correctly', () => {
    storage.set('key1', 'value1');
    expect(storage.get('key1')).toBe('value1');
  });

  test('get returns default when key missing', () => {
    expect(storage.get('missing', 'default')).toBe('default');
  });

  test('get returns default when value is empty string', () => {
    storage.set('empty', '');
    expect(storage.get('empty', 'default')).toBe('default');
  });

  test('remove deletes key', () => {
    storage.set('key2', 'value2');
    storage.remove('key2');
    expect(storage.get('key2', 'gone')).toBe('gone');
  });

  test('clear removes all keys', () => {
    storage.set('a', '1');
    storage.set('b', '2');
    storage.clear();
    expect(storage.get('a', 'gone')).toBe('gone');
    expect(storage.get('b', 'gone')).toBe('gone');
  });
});
