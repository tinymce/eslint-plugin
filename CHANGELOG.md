# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

## 2.2.1 - 2022-08-30

### Fixed
- Some rules did not work correctly on Windows.

## 2.2.0 - 2022-08-25

### Added
- Enabled the `@typescript-eslint/func-call-spacing`, `computed-property-spacing`, `no-whitespace-before-property`, `rest-spread-spacing`, `semi-spacing` and `switch-colon-spacing` spacing rules by default.

### Improved
- Swapped to the `@typescript-eslint/brace-style`, `@typescript-eslint/object-curly-spacing` and `@typescript-eslint/space-before-blocks` rule variants to detect issues in interfaces and types.

## 2.1.0 - 2022-08-23

### Added
- Enabled the `@typescript-eslint/naming-convention` rule so that it enforces pascal case type names.
- Added new `@tinymce/prefer-mcagar-tiny-assertions` rule to detect places where `TinyAssertions.assertContent` and `TinyAssertions.assertRawContent` should be used in tests.
- Added new `@tinymce/prefer-mcagar-tiny-dom` rule to detect places where `TinyDom` should be used in tests.
- Added new `@tinymce/no-direct-editor-events` rule to ensure events are only dispatched inside `api/Events.ts`.
- Added new `@tinymce/no-direct-editor-options` rule to ensure options are only registered and accessed inside `api/Options.ts`.
- Added new `@tinymce/no-publicapi-module-imports` rule to detect invalid imports from `PublicApi.ts`.

## 2.0.1 - 2021-11-25

### Fixed
- Fixed incorrect `eslint-plugin-import` dependency.

## 2.0.0 - 2021-11-25

### Changed
- Upgraded to require ESLint 8.x.
- The `@tinymce/no-unimported-promise` is no longer enabled by default.

## 1.9.0 - 2021-06-17

### Added
- The `@tinymce/prefer-fun` rule now supports configuring which rules should be checked.

### Improved
- The `@tinymce/no-main-module-imports` rule now detects Main imports via aliases from outside the `src/main/` directory.
- The `@tinymce/prefer-fun` rule now detects where `Fun.constant` and `Fun.identity` should be used.

### Changed
- The editor configuration now enforces newlines between import groups.

## 1.8.0 - 2021-05-24

### Added
- Enabled the `template-curly-spacing` rule by default.
- Added the `mocha` plugin to detect duplicate test names and exclusive/only tests.

## 1.7.0 - 2020-10-16

### Changed
- Enabled the `brace-style` rule to ensure code cannot be on the same line as if/else statements.

### Fixed
- `Fun.constant(false)` was not detected as syntax that should be replaced by `Fun.never`.

## 1.6.0 - 2020-10-14

### Added
- Added new `@tinymce/prefer-fun` rule to detect places where `Fun.noop`, `Fun.never` and `Fun.always` should be used.
- Added a new `editor` config that extends the standard rules to provide more editor specific rules.

### Changed
- Enabled the following additional rules by default:
  - `@typescript-eslint/await-thenable`
  - `@typescript-eslint/ban-ts-comment`
  - `@typescript-eslint/consistent-type-assertions`
  - `@typescript-eslint/consistent-type-definitions`
  - `@typescript-eslint/no-for-in-array`
  - `@typescript-eslint/no-implied-eval`
  - `@typescript-eslint/no-namespace`
  - `@typescript-eslint/no-parameter-properties`
  - `@typescript-eslint/switch-exhaustiveness-check`
  - `@typescript-eslint/type-annotation-spacing`
  - `arrow-spacing`
  - `dot-location`
  - `key-spacing`
  - `max-len`
  - `no-fallthrough`
  - `no-nested-ternary`
  - `prefer-arrow/prefer-arrow-functions`
  - `space-before-blocks`

## 1.5.2 - 2020-12-08

### Fixed
- Some dom-globals weren't flagged as invalid when using the `@tinymce/no-implicit-dom-globals` rule. 

## 1.5.0 - 2020-10-01

### Fixed
- Updated dependencies to support new tuple syntax in typescript 4.

## 1.4.0 - 2020-07-27

### Added

- Added new `@tinymce/no-implicit-dom-globals` rule to prevent dom global variables being used implicitly.

## 1.3.0 - 2020-07-23

### Added

- Added the `@typescript-eslint/keyword-spacing`, `comma-spacing`, `no-multi-spaces`, `space-infix-ops` and `space-unary-ops` rules to the default ruleset.

### Fixed

- Fixed the `@tinymce/no-unimported-promise` incorrectly detecting local variables.
- Fixed the `@tinymce/no-enums-in-export-specifier` detecting built-in object properties.

## 1.2.0 - 2020-04-06

## 1.1.0 - 2020-03-16

### Changed
- `@typescript-eslint/no-unused-vars` enabled as a warning with ability to use leading underscore to ignore
- `@typescript-eslint/no-empty-interface` turned off as empty interfaces are frequently used as placeholders
- `@typescript-eslint/prefer-includes` turned off as it causes IE incompatibility
- `@typescript-eslint/prefer-string-starts-ends-with` turned off as it causes IE incompatibility

## 1.0.0 - 2020-03-09

### Added
- Setup project
- Imported all rules from `tslint-rules`
