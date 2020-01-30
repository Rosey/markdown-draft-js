# Changelog

## [2.2.0] - 2020-01-30

- Fixed issue with newlines not always matching correctly when `preserveNewlines: true` is set. Issue outlining the bug here: https://github.com/Rosey/markdown-draft-js/issues/111

## [2.1.1] - 2019-10-10
### Fixes

- Fixed bug where inline styles like bold or italic would become malformed when converting from draft to markdown if they included a trailing `\n` character.

## [2.1.0] - 2019-10-09
### Fixes

- Fixed issue when soft newlines were used in draft didn’t convert correctly to markdown.

### Documentation

- Update README to be a bit more current w/r/t project status.

## [2.0.0] - 2019-08-07
### Changes
- **Potentially breaking change:** Update remarkable.js dependency to version 2. Addresses security concerns and features a smaller package size.
- Update devDependency packages to latest versions
- Add husky pre-push linting hook