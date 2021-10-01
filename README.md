😷 **COVID update** I am now stuck at home full time with two very young children and get zero breaks all day from the moment I wake up until the moment I go to sleep. Anything that requires deep thought, like reviewing and writing code, as well as taking deep dives into open issues, is basically impossible for me right now! So sorry if things fall behind.

⭐️ **A quick maintenance note:** I ([Rosey](https://github.com/Rosey)) work full time and am the mom to a toddler, a soon-to-be newborn (coming Dec 2019), and a high–energy dog, and this is just a side–project 😇 Therefore, it’s much appreciated if people who encounter bugs and are able to do so, they open a PR with a proposed fix (vs opening an issue and waiting for me to fix it). OR if you happen to be using this library and see an open issue you’re able to fix, I would love it if you opened a PR with that fix! Of course, feel free to continue to open issues if you don’t have the time or knowledge to fix a bug you notice, I just want to set the expectation that response time will not be super speedy 🙃 I’ll do my best to review and merge any PRs that do get opened. Thank you! ❤️ And thank you to everyone who has helped out and contributed to this project, it has been a real delight 🥰

# Markdown draft js

A tool for converting [Draft.js](https://draftjs.org) [raw object](https://draftjs.org/docs/api-reference-data-conversion) to [markdown](https://daringfireball.net/projects/markdown/), and vice-versa.

**Looking for an example?** [There is a running example here](https://rosey.github.io/markdown-draft-js/)

### Markdown draft js vs other similar projects - what’s the story?

I started this project in 2016 because I was in need of a draft/markdown conversion tool that could handle custom entities, such as mentions, and the existing conversion tools out there didn’t support these slightly complex needs. I was also finding various bugs with the existing conversion tools and none of them seemed to be maintained, so I decided to write my own.

It’s now 2019 and the landscape has potentially changed! I don’t spend a ton of time keeping tabs on other draftjs markdown conversion tools out there, but I believe there are a few that are actively maintained and significantly more popular than this one, such as [draft-js-export-markdown](https://github.com/sstur/draft-js-utils/tree/master/packages/draft-js-export-markdown). Before choosing this project, I encourage you to do your research! This may still be the best tool for what you need, but it’s always worth being critical and looking at all your options 😃 Stability wise, I use markdown-draft-js in a production environment with over 10k monthly active users and it has served very well so far.

## Basic Usage

Please note: We recommend using a polyfill (like babel-polyfill) since we're using a bunch of modern array methods.

`draftToMarkdown` expects a [RAW Draft.js JS object](https://draftjs.org/docs/api-reference-data-conversion).

It returns a string of markdown.

```javascript
// First, import `draftToMarkdown`
import { draftToMarkdown } from 'markdown-draft-js';

var markdownString = draftToMarkdown(rawObject);
```

`markdownToDraft` expects a string containing markdown.

It returns a [RAW Draft.js JS object](https://draftjs.org/docs/api-reference-data-conversion).

```javascript
// First, import `draftToMarkdown`
import { markdownToDraft } from 'markdown-draft-js';

var rawObject = markdownToDraft(markdownString);
```

## Example

```javascript
[---]

import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

[---]

constructor(props) {
  super(props);

  // Convert input from markdown to draftjs state
  const markdownString = this.props.markdownString;
  const rawData = markdownToDraft(markdownString);
  const contentState = convertFromRaw(rawData);
  const newEditorState = EditorState.createWithContent(contentState);
  this.state = {
    editorState: newEditorState,
  };

  this.onChange = (editorState) => {
    this.setState({ editorState });

    // Convert draftjs state to markdown
    const content = editorState.getCurrentContent();
    const rawObject = convertToRaw(content);
    const markdownString = draftToMarkdown(rawObject);

    // Do something with the markdown
  };
}

[---]
```

## Custom Values

In case you want to extend markdown’s functionality, you can. `draftToMarkdown` accepts an (optional) second `options` argument.

It takes two values: `styleItems` and `entityItems`. This is because of a distinction in draftjs between styles and entities. You can read more about them on [Draft’s documentation](https://draftjs.org/docs/api-reference-character-metadata).

Say I wanted to convert <span style="color: red">**red text**</span> from my Draft.js editor to a span with a red colour style. Unless I write a custom method for it, the markdown parser will ignore this special style, since it’s not a normal, pre-defined style. (An example of this style item is defined in one of the Draft.js [custom colours](https://github.com/facebook/draft-js/tree/master/examples/color) examples.)

However, I can pass in a custom renderer for the `red` style type, and then decide how I want it to be depicted in markdown. Since markdown parsers usually also accept HTML, in this example I’ll just have my custom renderer do a `span` with a red style. Here it is:

```javascript
var markdownString = draftToMarkdown(rawObject, {
  styleItems: {
    red: {
      open: function () {
        return '<span style="color: red">';
      },

      close: function () {
        return '</span>';
      }
    }
  }
});
```

`red` is the value of the `style` key in the raw object. The `open` method is what precedes the actual text, and `close` is what succeeds it.

Here’s another example, with a mention entity type -


```javascript
var markdownString = draftToMarkdown(rawObject, {
  entityItems: {
    mention: {
      open: function (entity, block) {
        return '<span class="mention-item" data-user-id="' + entity.data.id + '" data-block-type="'+ block.type + '">';
      },

      close: function (entity) {
        return '</span>';
      }
    }
  }
});
```

Since entities can also contain additional custom information - in this case, the user’s id, an `entity` object is passed to the open and close methods so that you can use that information in your open/close text if you need to.

In case you need more information about the block the entity belongs to, it is available as the second parameter of the open/close methods.

What if you wanted to go the opposite direction? markdownToDraft uses [Remarkable](https://github.com/jonschlinkert/remarkable) for defining custom markdown types.

In this case, you need to write a [remarkable plugin](https://github.com/jonschlinkert/remarkable/blob/master/docs/plugins.md) first and pass it in to `markdownToDraft` -

```javascript
var rawDraftJSObject = markdownToDraft(markdownString, {
  remarkablePlugins: [remarkableMentionPlugin],
  blockEntities: {
    mention_open: function (item) {
      return {
        type: "mention",
        mutability: "IMMUTABLE",
        data: {
          mention: {
            id: item.id,
            name: item.name
          }
        }
      };
    }
  }
});
```


## Additional options

### Remarkable options

Since this module uses Remarkable under the hood, you can also pass down preset and options for the Remarkable parser. Simply add the `remarkablePreset` or `remarkableOptions` property (or both of them) to your options object. For example, let's say you wanted to use the `commonmark` preset and parse html as well:

```javascript
var rawDraftJSObject = markdownToDraft(markdownString, {
  remarkablePreset: 'commonmark',
  remarkableOptions: {
    html: true
  }
});
```

#### Enabling / Disabling rules

It's possible to enable or disable specific rules. Remarkable categorizes them into three groups, every file represents a possible rule:

- [Inline](https://github.com/jonschlinkert/remarkable/tree/master/lib/rules_inline) (e.g. links, bold, italic)
- [Block](https://github.com/jonschlinkert/remarkable/tree/master/lib/rules_block) (e.g. tables, headings)
- [Core](https://github.com/jonschlinkert/remarkable/tree/master/lib/rules_core) (e.g. automatic link conversion or abbreviations)

```javascript
var rawDraftJSObject = markdownToDraft(markdownString, {
  remarkablePreset: 'commonmark',
  remarkableOptions: {
    disable: {
      inline: ['links', 'emphasis'],
      block: ['heading']
    },
    enable: {
      block: 'table',
      core: ['abbr']
    }
  }
});
```

The `table` rule is disabled by default but could be enabled like in the example above.

### More options

`preserveNewlines` can be passed in to preserve multiple sequential empty lines. By default, markdown rules specify that blank whitespace is collapsed, the result being that more than one empty line will be reduced to a single empty line, but in the interest in maintaining 1:1 parity with draft appearance-wise, this option can be turned on if you like :)

NOTE: If you plan on passing the markdown to a 3rd party markdown parser, markdown default behaviour IS to strip additional newlines, so the HTML it generates will likely strip those newlines at that point.... Which is why this is an option disabled by default.

`escapeMarkdownCharacters` – by default this value is **true** and markdown characters (e.g. *~_`) typed directly into the editor by a user are escaped when converting from draft to markdown.

Setting this option to **false** will prevent those special characters from being escaped, so the markdown string it generates will remain in its “raw” form. What this means is that when the markdown is later converted back to draftjs or parsed by a different markdown tool, any user-entered markdown will be rendered AS markdown, and will not "match" what the user initially entered. (So if the user explicitly typed in `**hello**`, converting to markdown and back to draft it will be restored as **hello** instead of the original `**hello**`)

### FAQ

#### How do I get images to work?

For now, check out [this pull request](https://github.com/Rosey/markdown-draft-js/pull/49) and the discussion below. [this comment](https://github.com/Rosey/markdown-draft-js/pull/49#issuecomment-369682808) outlines how to get images working by writing a basic plugin for markdown-draft-js. The reason it’s not built into the library itself is because draftjs doesn’t support images out of the box, so there’s no standardized way of supporting them in the library that will work for everyone. In the future I hope to publish a plugin for people to quickly add image support if they need to, but I haven’t quite gotten there yet 🙂
