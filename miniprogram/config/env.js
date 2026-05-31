const ENV_CONFIG = {
  dev: {
    ENV: 'dev',
    CLOUD_ENV_ID: 'your-env-id-dev',
    DEBUG: true,
  },
  staging: {
    ENV: 'staging',
    CLOUD_ENV_ID: 'your-env-id-staging',
    DEBUG: true,
  },
  prod: {
    ENV: 'prod',
    CLOUD_ENV_ID: 'your-env-id-prod',
    DEBUG: false,
  },
};

const currentEnv = 'dev';

module.exports = ENV_CONFIG[currentEnv];
