function get(key, defaultValue) {
  try {
    const value = wx.getStorageSync(key);
    return value !== '' && value !== undefined && value !== null ? value : defaultValue;
  } catch (_e) {
    return defaultValue;
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(key, value);
    return true;
  } catch (_e) {
    return false;
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (_e) {
    return false;
  }
}

function clear() {
  try {
    wx.clearStorageSync();
    return true;
  } catch (_e) {
    return false;
  }
}

module.exports = {
  get,
  set,
  remove,
  clear,
};
