# ESLint Rules

This is the base rules for eslint that we can share between projects and then override if we need to on a project basis.

## Automatic Conversion notes
64 rules replaced with their ESLint equivalents.

### 6 ESLint rules behave differently from their TSLint counterparts
* one-var:
  - Variables declared in for loops will no longer be checked.
* camelcase:
  - Leading and trailing underscores (_) in variable names will now be ignored.
* no-underscore-dangle:
  - Leading or trailing underscores (_) on identifiers will now be forbidden.
* no-invalid-this:
  - Functions in methods will no longer be ignored.
* no-unused-expressions:
  - The TSLint optional config "allow-new" is the default ESLint behavior and will no longer be ignored.
* eqeqeq:
  - Option "smart" allows for comparing two literal values, evaluating the value of typeof and null comparisons.

### 4 rules do not yet have ESLint equivalents
- import-spacing
- one-line
- whitespace
- no-reference-import

### 2 packages are required for new ESLint rules.
- `eslint-plugin-prefer-arrow` supports this rule:
  * `only-arrow-functions` = `prefer-arrow/prefer-arrow-functions`
- `eslint-plugin-import` supports these rules:
  * `no-duplicate-imports` = `import/no-duplicates`
  * `ordered-imports` = `import/order` (implementations differ)