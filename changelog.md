# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2020-07-22

### Added

- Added the `comma-spacing`, `keyword-spacing`, `no-multi-spaces`, `space-infix-ops` and `space-unary-ops` rules to the default ruleset.

## [1.1.0] - 2020-03-16

### Changed
- `@typescript-eslint/no-unused-vars` enabled as a warning with ability to use leading underscore to ignore
- `@typescript-eslint/no-empty-interface` turned off as empty interfaces are frequently used as placeholders
- `@typescript-eslint/prefer-includes` turned off as it causes IE incompatibility
- `@typescript-eslint/prefer-string-starts-ends-with` turned off as it causes IE incompatibility

## [1.0.0] - 2020-03-09

### Added
- Setup project
- Imported all rules from `tslint-rules`