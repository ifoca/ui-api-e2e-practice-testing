module.exports = {
  env: {
    node: true, // makes 'require', 'module', '__dirname' etc. valid globals
    es2022: true, // enables modern JS syntax recognition (optional chaining, etc.)
  },
  plugins: ['jest'],
  extends: ['plugin:jest/recommended'],
  rules: {
    // Warns if you write test.skip() — reminds you not to forget disabled tests
    'jest/no-disabled-tests': 'warn',

    // ERRORS if test.only() is found — this would silently skip all other tests in CI
    'jest/no-focused-tests': 'error',

    // Ensures expect() calls are valid — catches typos like expect(x).toBe
    'jest/valid-expect': 'error',

    // Prevents expect() outside a test/it block (would never actually run)
    'jest/no-standalone-expect': 'error',

    // Enforces that async tests either return the promise or use async/await
    'jest/valid-expect-in-promise': 'error',
  },
};
