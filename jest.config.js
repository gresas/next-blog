module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: [
    "<rootDir>/app/generated/prisma/.*\\.d\\.ts$"
  ],
  collectCoverage: true,
  collectCoverageFrom: ["app/**/*.{ts,tsx}"],
  coverageReporters: ["text", "lcov"],
};
