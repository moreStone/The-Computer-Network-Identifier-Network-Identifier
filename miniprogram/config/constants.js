module.exports = {
  PAGE_SIZE: 10,
  COMMENT_PAGE_SIZE: 20,
  SEARCH_DEBOUNCE_MS: 300,
  MAX_COMMENT_LENGTH: 500,

  LOADING_STATE: {
    IDLE: 'idle',
    LOADING: 'loading',
    ERROR: 'error',
    EMPTY: 'empty',
    NORMAL: 'normal',
  },

  LOAD_MORE_STATE: {
    LOADING: 'loading',
    NO_MORE: 'noMore',
    HAS_MORE: 'hasMore',
    ERROR: 'error',
  },
};
