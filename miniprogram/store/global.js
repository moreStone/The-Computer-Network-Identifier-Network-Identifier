const listeners = {};

function on(event, callback) {
  if (!listeners[event]) {
    listeners[event] = [];
  }
  listeners[event].push(callback);
}

function off(event, callback) {
  if (!listeners[event]) return;
  const idx = listeners[event].indexOf(callback);
  if (idx !== -1) {
    listeners[event].splice(idx, 1);
  }
}

function emit(event, data) {
  if (!listeners[event]) return;
  listeners[event].forEach(cb => {
    try {
      cb(data);
    } catch (err) {
      console.error(`[Store] Error in listener for event "${event}":`, err);
    }
  });
}

function getGlobal(key) {
  const app = getApp();
  return app && app.globalData ? app.globalData[key] : undefined;
}

function setGlobal(key, value) {
  const app = getApp();
  if (app && app.globalData) {
    app.globalData[key] = value;
    emit(key, value);
  }
}

module.exports = {
  on,
  off,
  emit,
  getGlobal,
  setGlobal,
};
