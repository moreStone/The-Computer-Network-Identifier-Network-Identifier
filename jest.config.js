module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverageFrom: [
    'miniprogram/utils/**/*.js',
    'miniprogram/services/**/*.js',
    'miniprogram/store/**/*.js',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    '^@/utils/(.*)$': '<rootDir>/miniprogram/utils/$1',
    '^@/services/(.*)$': '<rootDir>/miniprogram/services/$1',
    '^@/config/(.*)$': '<rootDir>/miniprogram/config/$1',
  },
};
