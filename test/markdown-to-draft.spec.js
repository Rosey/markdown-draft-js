import { markdownToDraft, draftToMarkdown } from '../src/index';

describe('markdownToDraft', function () {
  describe ('codeblocks', function () {
    it('renders empty text correctly', function () {
      var markdown = '';
      var conversionResult = markdownToDraft(markdown);

      expect(conversionResult.blocks[0].text).toEqual('');
      expect(conversionResult.blocks[0].type).toEqual('unstyled');
    });

    it ('renders single-line codeblock correctly', function () {
      var markdown = '```\nsingle line codeblock\n```';
      var conversionResult = markdownToDraft(markdown);

      expect(conversionResult.blocks[0].text).toEqual('single line codeblock');
      expect(conversionResult.blocks[0].type).toEqual('code-block');
    });

    it ('renders single-line codeblock with a single trailing newline correctly', function () {
      var markdown = '```\nsingle line codeblock with trailing newline\n\n```';
      var conversionResult = markdownToDraft(markdown);

      expect(conversionResult.blocks[0].text).toEqual('single line codeblock with trailing newline\n');
      expect(conversionResult.blocks[0].type).toEqual('code-block');
    });

    it ('renders single-line codeblock wrapping newlines correctly', function () {
      var markdown = '```\n\nsingle line codeblock with wrapping newlines\n\n```';
      var conversionResult = markdownToDraft(markdown);

      expect(conversionResult.blocks[0].text).toEqual('\nsingle line codeblock with wrapping newlines\n');
      expect(conversionResult.blocks[0].type).toEqual('code-block');
    });

    it ('renders multi-line codeblock correctly', function () {
      var markdown = '```\nTest \n\n here is more \n ok\n```';
      var conversionResult = markdownToDraft(markdown);

      expect(conversionResult.blocks[0].text).toEqual('Test \n\n here is more \n ok');
      expect(conversionResult.blocks[0].type).toEqual('code-block');
    });
  });

  it('renders links correctly', function () {
    var markdown = 'This is a test of [a link](https://google.com)\n\n\n\nAnd [perhaps](https://facebook.github.io/draft-js/) we should test once more.';
    var conversionResult = markdownToDraft(markdown);
    expect(conversionResult.blocks[0].text).toEqual('This is a test of a link');
    expect(conversionResult.blocks[0].type).toEqual('unstyled');
    expect(conversionResult.blocks[0].inlineStyleRanges).toEqual([]);
    expect(conversionResult.blocks[0].entityRanges[0].offset).toEqual(18);
    expect(conversionResult.blocks[0].entityRanges[0].length).toEqual(6);
    var blockOneKey = conversionResult.blocks[0].entityRanges[0].key;
    expect(conversionResult.entityMap[blockOneKey].type).toEqual('LINK');
    expect(conversionResult.entityMap[blockOneKey].data.url).toEqual('https://google.com');

    expect(conversionResult.blocks[1].text).toEqual('And perhaps we should test once more.');
    expect(conversionResult.blocks[1].type).toEqual('unstyled');
    expect(conversionResult.blocks[1].inlineStyleRanges).toEqual([]);
    expect(conversionResult.blocks[1].entityRanges[0].offset).toEqual(4);
    expect(conversionResult.blocks[1].entityRanges[0].length).toEqual(7);
    var blockTwoKey = conversionResult.blocks[1].entityRanges[0].key;
    expect(conversionResult.entityMap[blockTwoKey].type).toEqual('LINK');
    expect(conversionResult.entityMap[blockTwoKey].data.url).toEqual('https://facebook.github.io/draft-js/');
  });

  it('renders "the kitchen sink" correctly', function () {
    var markdown = '# Hello!\n\nMy name is **Rose** :) \nToday, I\'m here to talk to you about how great markdown is!\n\n## First, here\'s a few bullet points:\n\n- One\n- Two\n- Three\n\n```\nA codeblock\n```\n\nAnd then... `some monospace text`?\nOr... _italics?_';
    var conversionResult = markdownToDraft(markdown);
    expect(conversionResult.blocks[0].text).toEqual('Hello!');
    expect(conversionResult.blocks[0].type).toEqual('header-one');
    expect(conversionResult.blocks[0].inlineStyleRanges).toEqual([]);
    expect(conversionResult.blocks[0].entityRanges).toEqual([]);

    expect(conversionResult.blocks[1].text).toEqual('My name is Rose :)\nToday, I\'m here to talk to you about how great markdown is!');
    expect(conversionResult.blocks[1].type).toEqual('unstyled');
    expect(conversionResult.blocks[1].inlineStyleRanges[0].offset).toEqual(11);
    expect(conversionResult.blocks[1].inlineStyleRanges[0].length).toEqual(4);
    expect(conversionResult.blocks[1].inlineStyleRanges[0].style).toEqual('BOLD');

    expect(conversionResult.blocks[2].text).toEqual('First, here\'s a few bullet points:');
    expect(conversionResult.blocks[2].type).toEqual('header-two');
    expect(conversionResult.blocks[2].inlineStyleRanges).toEqual([]);
    expect(conversionResult.blocks[2].entityRanges).toEqual([]);

    expect(conversionResult.blocks[3].text).toEqual('One');
    expect(conversionResult.blocks[3].type).toEqual('unordered-list-item');
    expect(conversionResult.blocks[3].inlineStyleRanges).toEqual([]);
    expect(conversionResult.blocks[3].entityRanges).toEqual([]);

    expect(conversionResult.blocks[4].text).toEqual('Two');
    expect(conversionResult.blocks[4].type).toEqual('unordered-list-item');
    expect(conversionResult.blocks[4].inlineStyleRanges).toEqual([]);
    expect(conversionResult.blocks[4].entityRanges).toEqual([]);

    expect(conversionResult.blocks[5].text).toEqual('Three');
    expect(conversionResult.blocks[5].type).toEqual('unordered-list-item');
    expect(conversionResult.blocks[5].inlineStyleRanges).toEqual([]);
    expect(conversionResult.blocks[5].entityRanges).toEqual([]);

    expect(conversionResult.blocks[6].text).toEqual('A codeblock');
    expect(conversionResult.blocks[6].type).toEqual('code-block');
    expect(conversionResult.blocks[6].inlineStyleRanges).toEqual([]);
    expect(conversionResult.blocks[6].entityRanges).toEqual([]);

    expect(conversionResult.blocks[7].text).toEqual('And then... some monospace text?\nOr... italics?');
    expect(conversionResult.blocks[7].type).toEqual('unstyled');
    expect(conversionResult.blocks[7].inlineStyleRanges[0].offset).toEqual(12);
    expect(conversionResult.blocks[7].inlineStyleRanges[0].length).toEqual(19);
    expect(conversionResult.blocks[7].inlineStyleRanges[0].style).toEqual('CODE');
    expect(conversionResult.blocks[7].inlineStyleRanges[1].offset).toEqual(39);
    expect(conversionResult.blocks[7].inlineStyleRanges[1].length).toEqual(8);
    expect(conversionResult.blocks[7].inlineStyleRanges[1].style).toEqual('ITALIC');
    expect(conversionResult.blocks[7].entityRanges).toEqual([]);
  });

  it('can handle block entity data', function () {
    const MentionRegexp = /^@\[([^\]]*)\]\s*\(([^)]+)\)/;
    function mentionWrapper(remarkable) {
      remarkable.inline.ruler.push('mention', function mention(state, silent) {
        // it is surely not our rule, so we could stop early
        if (!state.src || !state.pos) {
          return false;
        }

        if (state.src[state.pos] !== '@') {
          return false;
        }

        var match = MentionRegexp.exec(state.src.slice(state.pos));
        if (!match) {
          return false;
        }

        // in silent mode it shouldn't output any tokens or modify pending
        if (!silent) {
          state.push({
            type: 'mention_open',
            name: match[1],
            id: match[2],
            level: state.level
          });

          state.push({
            type: 'text',
            content: '@' + match[1],
            level: state.level + 1
          });

          state.push({
            type: 'mention_close',
            level: state.level
          });
        }

        // every rule should set state.pos to a position after token"s contents
        state.pos += match[0].length;

        return true;
      });
    }

    var markdown = 'Test @[Rose](1)';
    var conversionResult = markdownToDraft(markdown, {
      remarkablePlugins: [mentionWrapper],
      blockEntities: {
        mention_open: function (item) {
          return {
            type: 'MENTION',
            mutability: 'IMMUTABLE',
            data: {
              id: item.id,
              name: item.name
            }
          };
        }
      }
    });

    expect(conversionResult.blocks[0].text).toEqual('Test @Rose');
    expect(conversionResult.blocks[0].type).toEqual('unstyled');
    expect(conversionResult.blocks[0].inlineStyleRanges).toEqual([]);
    expect(conversionResult.blocks[0].entityRanges[0].offset).toEqual(5);
    expect(conversionResult.blocks[0].entityRanges[0].length).toEqual(5);
    var blockOneKey = conversionResult.blocks[0].entityRanges[0].key;
    expect(conversionResult.entityMap[blockOneKey].type).toEqual('MENTION');
    expect(conversionResult.entityMap[blockOneKey].data.id).toEqual('1');
    expect(conversionResult.entityMap[blockOneKey].data.name).toEqual('Rose');
  });

  it('can handle block data', function () {
    var markdown = '```js\ntest()\n```';
    var conversionResult = markdownToDraft(markdown, {
      blockTypes: {
        fence: function (item) {
          return {
            type: 'code-block',
            data: {
              lang: item.params
            }
          }
        }
      }
    });

    expect(conversionResult.blocks[0].type).toEqual('code-block');
    expect(conversionResult.blocks[0].data.lang).toEqual('js');
  });

  it('can handle an empty heading', function () {
    var markdown = '#';
    var conversionResult = markdownToDraft(markdown);

    expect(conversionResult.blocks[0].type).toEqual('header-one');
    expect(conversionResult.blocks[0].text).toEqual('');
  });

  it('can handle an empty blockquote', function () {
    var markdown = '>';
    var conversionResult = markdownToDraft(markdown);

    expect(conversionResult.blocks[0].type).toEqual('blockquote');
    expect(conversionResult.blocks[0].text).toEqual('');
  });

  it('can handle an empty unordered list item', function () {
    var markdown = '-';
    var conversionResult = markdownToDraft(markdown);

    expect(conversionResult.blocks[0].type).toEqual('unordered-list-item');
    expect(conversionResult.blocks[0].text).toEqual('');
  });

  it('can handle an ordered empty list item', function () {
    var markdown = '1.';
    var conversionResult = markdownToDraft(markdown);

    expect(conversionResult.blocks[0].type).toEqual('ordered-list-item');
    expect(conversionResult.blocks[0].text).toEqual('');
  });
});
