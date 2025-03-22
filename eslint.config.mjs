import base from './dist/test/module/ESLintConfig.mjs';
import tseslint from 'typescript-eslint';

const config = tseslint.config(
  base,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    },
  }
);

export default config;
