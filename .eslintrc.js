/* eslint-env node */
module.exports = {
  'extends': './dist/test/module/ESLintConfig.js',
  "parserOptions": {
    "projectService": true,
    "tsconfigRootDir": __dirname,
  },
  root: true,
}
