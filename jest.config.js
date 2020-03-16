'use strict';

module.exports = {
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testRegex: './src/test/.+Test\\.ts$',
  collectCoverage: false,
  collectCoverageFrom: ['src/main/**/*.{js,jsx,ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  coverageReporters: ['text-summary', 'lcov'],
};