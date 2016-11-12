// A map of draftjs block types -> markdown open and close characters
// Both the open and close methods must exist, even if they simply return an empty string.
// They should always return a string.
const StyleItems = {
  // BLOCK LEVEL
  'unordered-list-item': {
    open: function () {
      return '- ';
    },

    close: function () {
      return '';
    }
  },

  'ordered-list-item': {
    open: function () {
      return '1. ';
    },

    close: function () {
      return '';
    }
  },

  'blockquote': {
    open: function () {
      return '> ';
    },

    close: function () {
      return '';
    }
  },

  'header-one': {
    open: function () {
      return '# ';
    },

    close: function () {
      return '';
    }
  },

  'header-two': {
    open: function () {
      return '## ';
    },

    close: function () {
      return '';
    }
  },

  'header-three': {
    open: function () {
      return '### ';
    },

    close: function () {
      return '';
    }
  },

  'header-four': {
    open: function () {
      return '#### ';
    },

    close: function () {
      return '';
    }
  },

  'header-five': {
    open: function () {
      return '##### ';
    },

    close: function () {
      return '';
    }
  },

  'header-six': {
    open: function () {
      return '###### ';
    },

    close: function () {
      return '';
    }
  },

  'code-block': {
    open: function () {
      return '```\n';
    },

    close: function () {
      return '\n```';
    }
  },

  // INLINE LEVEL
  'BOLD': {
    open: function () {
      return '**';
    },

    close: function () {
      return '**';
    }
  },

  'ITALIC': {
    open: function () {
      return '_';
    },

    close: function () {
      return '_';
    }
  },

  'STRIKETHROUGH': {
    open: function () {
      return '~~';
    },

    close: function () {
      return '~~';
    }
  },

  'CODE': {
    open: function () {
      return '`';
    },

    close: function () {
      return '`';
    }
  }
};

// A map of draftjs entity types -> markdown open and close characters
// entities are different from block types because they have additional data attached to them.
// an entity object is passed in to both open and close, in case it's needed for string generation.
//
// Both the open and close methods must exist, even if they simply return an empty string.
// They should always return a string.
const EntityItems = {
  'LINK': {
    open: function (entity) {
      return '[';
    },

    close: function (entity) {
      return `](${entity.data.url})`;
    }
  }
}

// Bit of a hack - we normally want a double newline after a block,
// but for list items we just want one (unless it's the _last_ list item in a group.)
const SingleNewlineAfterBlock = [
  'unordered-list-item',
  'ordered-list-item'
];

/**
 * Generate markdown for a single block javascript object
 * DraftJS raw object contains an array of blocks, which is the main "structure"
 * of the text. Each block = a new line.
 *
 * @param {Object} block - block to generate markdown for
 * @param {Number} index - index of the block in the blocks array
 * @param {Object} rawDraftObject - entire raw draft object (needed for accessing the entityMap)
 * @param {Object} options - additional options passed in by the user calling this method.
 *
 * @return {String} markdown string
**/
function renderBlock(block, index, rawDraftObject, options) {
  var openInlineStyles = [];
  var markdownString = '',
      // We keep track of where in the array of inlineStyleRanges and entityRanges we are
      // so that we don't keep re-searching the entire array when we check to see if we should open/close
      // any markdown syntax.
      styleSearchStartingPoint = 0,
      styleCloseStartingPoint = 0,
      entitySearchStartingPoint = 0,
      entityCloseStartingPoint = 0,
      customStyleItems = options.styleItems || {},
      customEntityItems = options.entityItems || {};

  var type = block.type;

  // Render main block wrapping element
  if (customStyleItems[type] || StyleItems[type]) {
    markdownString += (customStyleItems[type] || StyleItems[type]).open();
  }

  // Render text within content, along with any inline styles/entities
  Array.prototype.slice.apply(block.text).some(function (character, characterIndex) {
    // Close any inline tags that need closing
    block.inlineStyleRanges.slice(styleCloseStartingPoint).forEach(function (style, styleIndex) {
      if (style.offset + style.length === characterIndex) {
        if ((customStyleItems[style.style] || StyleItems[style.style])) {
          var styleIndex = openInlineStyles.indexOf(style);

          // Handle nested case - close any open inline styles before closing the parent
          if (styleIndex !== openInlineStyles.length - 1) {
            for (var i = openInlineStyles.length - 1; i !== styleIndex; i--) {
              markdownString += (customStyleItems[openInlineStyles[i].style] || StyleItems[openInlineStyles[i].style]).close();
            }
          }

          markdownString += (customStyleItems[style.style] || StyleItems[style.style]).close();

          // Handle nested case - reopen any inline styles after closing the parent
          if (styleIndex !== openInlineStyles.length - 1) {
            for (var i = openInlineStyles.length - 1; i !== styleIndex; i--) {
              markdownString += (customStyleItems[openInlineStyles[i].style] || StyleItems[openInlineStyles[i].style]).open();
            }
          }

          openInlineStyles.splice(styleIndex, 1);
        }
        styleCloseStartingPoint++;
      } else if (style.offset + style.length < characterIndex) {
        styleCloseStartingPoint++;
        return true;
      }
    });

    // Close any entity tags that need closing
    block.entityRanges.slice(entityCloseStartingPoint).some(function (range, rangeIndex) {
      if (range.offset + range.length === characterIndex) {
        var entity = rawDraftObject.entityMap[range.key];
        if (customEntityItems[entity.type] || EntityItems[entity.type]) {
          markdownString += (customEntityItems[entity.type] || EntityItems[entity.type]).close(entity);
        }
        entityCloseStartingPoint++;
      } else if (range.offset + range.length < characterIndex) {
        entityCloseStartingPoint++;
        return true;
      }
    });

    // Open any inline tags that need opening
    block.inlineStyleRanges.slice(styleSearchStartingPoint).some(function (style, styleIndex) {
      if (style.offset === characterIndex) {
        if ((customStyleItems[style.style] || StyleItems[style.style])) {
          markdownString += (customStyleItems[style.style] || StyleItems[style.style]).open();
          openInlineStyles.push(style);
        }
      } else if (style.offset > characterIndex) {
        styleSearchStartingPoint = styleIndex;
        return true;
      }
    });

    // Open any entity tags that need opening
    block.entityRanges.slice(entitySearchStartingPoint).some(function (range, rangeIndex) {
      if (range.offset === characterIndex) {
        var entity = rawDraftObject.entityMap[range.key];
        if (customEntityItems[entity.type] || EntityItems[entity.type]) {
          markdownString += (customEntityItems[entity.type] || EntityItems[entity.type]).open(entity);
        }
      } else if (range.offset > characterIndex) {
        entitySearchStartingPoint = rangeIndex;
        return true;
      }
    });

    markdownString += character;
  });

  // Close any remaining inline tags (if an inline tag ends at the very last char, we won't catch it inside the loop)
  block.inlineStyleRanges.slice(styleCloseStartingPoint).forEach(function (style, styleIndex) {
    if (style.offset + style.length >= block.text.length) {
      if (customStyleItems[style.style] || StyleItems[style.style]) {
        markdownString += (customStyleItems[style.style] || StyleItems[style.style]).close();
      }
    }
  });

  // Close any remaining entity tags
  block.entityRanges.slice(entityCloseStartingPoint).forEach(function (range, rangeIndex) {
    if (range.offset + range.length === block.text.length) {
      var entity = rawDraftObject.entityMap[range.key];
      if (customEntityItems[entity.type] || EntityItems[entity.type]) {
        markdownString += (customEntityItems[entity.type] || EntityItems[entity.type]).close(entity);
      }
    }
  });

  // Close block level item
  if (customStyleItems[type] || StyleItems[type]) {
    markdownString += (customStyleItems[type] || StyleItems[type]).close();
  }

  // Determine how many newlines to add - generally we want 2, but for list items we just want one when they are succeeded by another list item.
  if (SingleNewlineAfterBlock.indexOf(type) !== -1 && rawDraftObject.blocks[index + 1] && SingleNewlineAfterBlock.indexOf(rawDraftObject.blocks[index + 1].type) !== -1) {
    markdownString += '\n';
  } else if (rawDraftObject.blocks[index + 1]) {
    markdownString += '\n\n';
  }

  return markdownString;
}

/**
 * Generate markdown for a raw draftjs object
 * DraftJS raw object contains an array of blocks, which is the main "structure"
 * of the text. Each block = a new line.
 *
 * @param {Object} rawDraftObject - draftjs object to generate markdown for
 * @param {Object} options - optional additional data, see readme for what options can be passed in.
 *
 * @return {String} markdown string
**/
function draftToMarkdown(rawDraftObject, options) {
  options = options || {};
  var markdownString = '';
  rawDraftObject.blocks.forEach(function (block, index) {
    markdownString += renderBlock(block, index, rawDraftObject, options);
  });

  return markdownString;
}

module.exports = draftToMarkdown;
