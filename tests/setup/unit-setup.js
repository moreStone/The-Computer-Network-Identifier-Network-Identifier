const storage = {};

function createMockFn() {
  const fn = function () {
    fn.calls = fn.calls || [];
    fn.calls.push(Array.from(arguments));
    return fn._returnValue;
  };
  fn._returnValue = undefined;
  fn.mockResolvedValue = function (val) {
    fn._returnValue = Promise.resolve(val);
    return fn;
  };
  fn.mockReturnValue = function (val) {
    fn._returnValue = val;
    return fn;
  };
  fn.mockClear = function () {
    fn.calls = [];
  };
  return fn;
}

function createStorageMock() {
  let store = {};
  return {
    getSync: createMockFn(),
    setSync: createMockFn(),
    removeSync: createMockFn(),
    clearSync: createMockFn(),
    _store: store,
    _reset() {
      store = {};
    },
  };
}

const storageMock = createStorageMock();
storageMock.getSync.mockReturnValue = undefined;

global.wx = {
  getStorageSync: function (key) {
    return storage[key];
  },
  setStorageSync: function (key, value) {
    storage[key] = value;
  },
  removeStorageSync: function (key) {
    delete storage[key];
  },
  clearStorageSync: function () {
    Object.keys(storage).forEach(function (k) {
      delete storage[k];
    });
  },
  cloud: {
    init: createMockFn(),
    database: createMockFn(),
    callFunction: createMockFn(),
    uploadFile: createMockFn(),
    getTempFileURL: createMockFn(),
  },
  navigateTo: createMockFn(),
  redirectTo: createMockFn(),
  switchTab: createMockFn(),
  navigateBack: createMockFn(),
  showToast: createMockFn(),
  showLoading: createMockFn(),
  hideLoading: createMockFn(),
  showModal: createMockFn(),
  stopPullDownRefresh: createMockFn(),
};

global.console = {
  debug: createMockFn(),
  info: createMockFn(),
  warn: createMockFn(),
  error: createMockFn(),
  log: createMockFn(),
};

global.getApp = function () {
  return {
    globalData: {
      env: 'test',
      categories: [],
    },
  };
};

global.getCurrentPages = function () {
  return [];
};
