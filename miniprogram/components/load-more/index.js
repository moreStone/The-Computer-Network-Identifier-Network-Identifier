const { LOAD_MORE_STATE } = require('../../config/constants');

Component({
  properties: {
    state: {
      type: String,
      value: LOAD_MORE_STATE.NO_MORE,
    },
  },

  data: {
    LOAD_MORE_STATE,
  },
});
