# Changelog


## [2.4.0] - 2021-10-01

- Include block as a param in entity open/close (https://github.com/Rosey/markdown-draft-js/pull/160)
- Support for sub, sup, htmlblock (https://github.com/Rosey/markdown-draft-js/pull/163)

## [2.3.0] - 2021-07-16

- Fix for overlapping inline styles (https://github.com/Rosey/markdown-draft-js/pull/130)
- Bump lodash version to 4.17.19 (https://github.com/Rosey/markdown-draft-js/pull/132)
- Fix ordered list numbering (https://github.com/Rosey/markdown-draft-js/pull/135)
- Add strikethrough support (https://github.com/Rosey/markdown-draft-js/issues/156)
- Fix issue with newlines after lists when `preserveNewLines` is `true` (https://github.com/Rosey/markdown-draft-js/pull/146)

## [2.2.1] - 2020-06-16

- Update remarkable dependency (https://github.com/Rosey/markdown-draft-js/pull/126)
- Reduce package size (https://github.com/Rosey/markdown-draft-js/pull/125)
- Fix bug with some unicode surrogate pairs and entity items on draft-to-markdown (https://github.com/Rosey/markdown-draft-js/pull/123)

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
