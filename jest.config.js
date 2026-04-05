export default {
  projects: [
    {
      displayName: 'unit', // matches --selectProjects unit
      testMatch: ['<rootDir>/packages/unit/src/__tests__/**/*.test.js'],
      testEnvironment: 'node',
      testTimeout: 5000,
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/packages/integration/src/__tests__/**/*.test.js'],
      testEnvironment: 'node',
      testTimeout: 15000, // longer — these hit real APIs over network
    },
    {
      displayName: 'api',
      testMatch: ['<rootDir>/packages/api/src/__tests__/**/*.test.js'],
      testEnvironment: 'node',
      testTimeout: 10000,
    },
  ],
  verbose: true,
  collectCoverageFrom: [
    'shared/helpers/**/*.js',
    'packages/*/src/**/*.js',
    '!**/__tests__/**', // don't count test files themselves
  ],
};
