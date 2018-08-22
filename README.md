⭐️ **A quick maintenance note:** I ([Rosey](https://github.com/Rosey)) will be on maternity leave starting in December 2017 until December 2018 and will likely have way less time to devote to issues, bug fixes, etc. (And once I get back I’ll be working full time + have a toddler, so I’m sure it won’t be much better 😇) Therefore, it’s much appreciated if people who encounter bugs and are able to do so, they open a PR with a proposed fix (vs opening an issue and waiting for me to fix it). OR if you happen to be using this library and see an open issue you’re able to fix, I would love it if you opened a PR with that fix! Of course, feel free to continue to open issues if you don’t have the time or knowledge to fix a bug you notice, I just want to set the expectation that response time will be slower 🙃 I’ll do my best to continue to review and merge any PRs that do get opened, although for the first few months after giving birth there may be total radio silence on my end. Thank you! ❤️ And thank you to everyone who has helped out and contributed to this project in its early days!!

# Markdown draft js

A tool for converting [Draft.js](https://facebook.github.io/draft-js/) [raw object](https://facebook.github.io/draft-js/docs/api-reference-data-conversion.html) to [markdown](https://daringfireball.net/projects/markdown/), and vice-versa.

**Looking for an example?** [There is a running example here](https://rosey.github.io/markdown-draft-js/)

## Basic Usage

Please note: We recommend using a polyfill (like babel-polyfill) since we're using a bunch of modern array methods.

`draftToMarkdown` expects a [RAW Draft.js JS object](https://facebook.github.io/draft-js/docs/api-reference-data-conversion.html).

It returns a string of markdown.  

```javascript
// First, import `draftToMarkdown`
import { draftToMarkdown } from 'markdown-draft-js';

var markdownString = draftToMarkdown(rawObject);
```

`markdownToDraft` expects a string containing markdown.

It returns a [RAW Draft.js JS object](https://facebook.github.io/draft-js/docs/api-reference-data-conversion.html).

```javascript
// First, import `draftToMarkdown`
import { markdownToDraft } from 'markdown-draft-js';

var rawObject = markdownToDraft(markdownString);
```

## Custom Values

In case you want to extend markdown’s functionality, you can. `draftToMarkdown` accepts an (optional) second `options` argument.

It takes two values: `styleItems` and `entityItems`. This is because of a distinction in draftjs between styles and entities. You can read more about them on [Draft’s documentation](https://facebook.github.io/draft-js/docs/api-reference-character-metadata.html).

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
      open: function (entity) {
        return '<span class="mention-item" data-user-id="' + entity.data.id + '">';
      },

      close: function (entity) {
        return '</span>';
      }
    }
  }
});
```

Since entities can also contain additional custom information - in this case, the user’s id, an `entity` object is passed to the open and close methods so that you can use that information in your open/close text if you need to.

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

Since this module uses remarkable under the hood, you can also pass down options for the remarkable parser, simply add the property `remarkableOptions` to your options object. For example, let's say you wanted to parse html as well:

```javascript
var rawDraftJSObject = markdownToDraft(markdownString, {
  remarkableOptions: {
    html: true
  }
});
```

### More options

`preserveNewlines` can be passed in to preserve empty whitespace newlines. By default, markdown rules specify that blank whitespace is collapsed, but in the interest in maintaining 1:1 parity with draft appearance-wise, this option can be turned on if you like :)  

NOTE: If you plan on passing the markdown to a 3rd party markdown parser, markdown default behaviour IS to strip additional newlines, so the HTML it generates will likely strip those newlines at that point.... Which is why this is an option disabled by default.

### FAQ

#### How do I get images to work?

For now, check out [this pull request](https://github.com/Rosey/markdown-draft-js/pull/49) and the discussion below. [this comment](https://github.com/Rosey/markdown-draft-js/pull/49#issuecomment-369682808) outlines how to get images working by writing a basic plugin for markdown-draft-js. The reason it’s not built into the library itself is because draftjs doesn’t support images out of the box, so there’s no standardized way of supporting them in the library that will work for everyone. In the future I hope to publish a plugin for people to quickly add image support if they need to, but I haven’t quite gotten there yet 🙂
