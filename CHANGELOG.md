# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.9.0 - 2021-06-14

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