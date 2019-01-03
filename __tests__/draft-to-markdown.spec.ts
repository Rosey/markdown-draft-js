import { markdownToDraft, draftToMarkdown } from '../src/index';
import * as Draft from 'draft-js';

describe('draftToMarkdown', function () {
  describe('whitespace', function () {
    it('renders inline styled text with leading whitespace correctly', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"Test Bold Text Test","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":4,"length":10,"style":"BOLD"}],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('Test **Bold Text** Test');
    });

    it('renders inline styled text with trailing whitespace correctly', function () {
      /* eslint-disable */
      var rawObject = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"Test Bold Text Test","type":"inline","depth":0,"inlineStyleRanges":[{"offset":5,"length":10,"style":"BOLD"}],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown: Draft.RawDraftContentState = draftToMarkdown(rawObject);
      expect(markdown).toEqual('Test **Bold Text** Test');
    });

    it('renders inline styled text with trailing whitespace correctly when trailing whitespace is the last character', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"Test Bold Text ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":5,"length":10,"style":"BOLD"}],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('Test **Bold Text** ');
    });

    it('renders nested inline styled text with trailing whitespace correctly', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"Test Bold Text Test","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":10,"style":"ITALIC"},{"offset":5,"length":9,"style":"BOLD"}],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('_Test **Bold**_ **Text** Test');

      /* eslint-disable */
      rawObject = {"entityMap":{},"blocks":[{"key":"84jcj","text":"bold/italic plain","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":11,"style":"BOLD"},{"offset":0,"length":11,"style":"ITALIC"}],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('**_bold/italic_** plain');
    });

    it('handles blank lines with styled block types', function () {
      // draft-js can have blank lines that have block styles.
      // This would result in double-application of markdown line prefixes.

      /* eslint-disable */
      const rawObject: Draft.RawDraftContentState = { "blocks": [ { "key": "e8ojh", "text": "", "type": "header-three", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "eg79g", "text": "Header 1", "type": "header-three", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "123", "text": "", "type": "header-three", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "456", "text": "Header 2", "type": "header-three", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} } ], "entityMap": {} };
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('### Header 1\n\n### Header 2');

      markdown = draftToMarkdown(rawObject, {preserveNewlines: true});
      expect(markdown).toEqual('### \n### Header 1\n### \n### Header 2');
    });
  });

  describe('entity conversion', function () {
    describe('headings', function () {
      it ('renders heading-one correctly', function () {
        /* eslint-disable */
        var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"depth":0,"type":"header-one","text":"Test","inlineStyleRanges":[],"entityRanges":[]},{"depth":0,"type":"unstyled","text":"Hello :)","entityRanges":[],"inlineStyleRanges":[]},{"depth":0,"type":"header-one","text":"Test","inlineStyleRanges":[],"entityRanges":[]}]};
        /* eslint-enable */

        var markdown = draftToMarkdown(rawObject);

        expect(markdown).toEqual('# Test\n\nHello :)\n\n# Test');
      });

      it ('renders heading-two correctly', function () {
        /* eslint-disable */
        var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"depth":0,"type":"header-two","text":"Test","inlineStyleRanges":[],"entityRanges":[]},{"depth":0,"type":"unstyled","text":"Hello :)","entityRanges":[],"inlineStyleRanges":[]},{"depth":0,"type":"header-two","text":"Test","inlineStyleRanges":[],"entityRanges":[]}]};
        /* eslint-enable */

        var markdown = draftToMarkdown(rawObject);

        expect(markdown).toEqual('## Test\n\nHello :)\n\n## Test');
      });

      it ('renders heading-three correctly', function () {
        /* eslint-disable */
        var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"depth":0,"type":"header-three","text":"Test","inlineStyleRanges":[],"entityRanges":[]},{"depth":0,"type":"unstyled","text":"Hello :)","entityRanges":[],"inlineStyleRanges":[]},{"depth":0,"type":"header-three","text":"Test","inlineStyleRanges":[],"entityRanges":[]}]};
        /* eslint-enable */

        var markdown = draftToMarkdown(rawObject);

        expect(markdown).toEqual('### Test\n\nHello :)\n\n### Test');
      });

      it ('renders heading-four correctly', function () {
        /* eslint-disable */
        var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"depth":0,"type":"header-four","text":"Test","inlineStyleRanges":[],"entityRanges":[]},{"depth":0,"type":"unstyled","text":"Hello :)","entityRanges":[],"inlineStyleRanges":[]},{"depth":0,"type":"header-four","text":"Test","inlineStyleRanges":[],"entityRanges":[]}]};
        /* eslint-enable */

        var markdown = draftToMarkdown(rawObject);

        expect(markdown).toEqual('#### Test\n\nHello :)\n\n#### Test');
      });

      it ('renders heading-five correctly', function () {
        /* eslint-disable */
        var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"depth":0,"type":"header-five","text":"Test","inlineStyleRanges":[],"entityRanges":[]},{"depth":0,"type":"unstyled","text":"Hello :)","entityRanges":[],"inlineStyleRanges":[]},{"depth":0,"type":"header-five","text":"Test","inlineStyleRanges":[],"entityRanges":[]}]};
        /* eslint-enable */

        var markdown = draftToMarkdown(rawObject);

        expect(markdown).toEqual('##### Test\n\nHello :)\n\n##### Test');
      });

      it ('renders heading-six correctly', function () {
        /* eslint-disable */
        var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"depth":0,"type":"header-six","text":"Test","inlineStyleRanges":[],"entityRanges":[]},{"depth":0,"type":"unstyled","text":"Hello :)","entityRanges":[],"inlineStyleRanges":[]},{"depth":0,"type":"header-six","text":"Test","inlineStyleRanges":[],"entityRanges":[]}]};
        /* eslint-enable */

        var markdown = draftToMarkdown(rawObject);

        expect(markdown).toEqual('###### Test\n\nHello :)\n\n###### Test');
      });
    });

    describe('code', function () {
      it ('renders codeblock without syntax correctly', function () {
        /* eslint-disable */
        var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"depth":0,"type":"code-block","data":{},"text":"Test codeblock","entityRanges":[],"inlineStyleRanges":[]}]};
        /* eslint-enable */
        var markdown = draftToMarkdown(rawObject);

        expect(markdown).toEqual('```\nTest codeblock\n```');
      });

      it ('renders codeblock with syntax correctly', function () {
        /* eslint-disable */
        var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"depth":0,"type":"code-block","data":{"language":"javascript"},"text":"Test codeblock","entityRanges":[],"inlineStyleRanges":[]}]};
        /* eslint-enable */
        var markdown = draftToMarkdown(rawObject);

        expect(markdown).toEqual('```javascript\nTest codeblock\n```');
      });

      it ('renders inline code correctly', function () {
        /* eslint-disable */
        var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"depth":0,"type":"unstyled","text":"Hello I am some inline code","entityRanges":[],"inlineStyleRanges":[{"offset":6,"length":21,"style":"CODE"}]}]};
        /* eslint-enable */
        var markdown = draftToMarkdown(rawObject);

        expect(markdown).toEqual('Hello `I am some inline code`');
      });
    });

    describe('inline styles', function () {
      it ('renders bold text correctly', function () {
        /* eslint-disable */
        var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"depth":0,"type":"unstyled","text":"Hello I am bold yay","entityRanges":[],"inlineStyleRanges":[{"offset":6,"length":9,"style":"BOLD"}]}]};
        /* eslint-enable */
        var markdown = draftToMarkdown(rawObject);

        expect(markdown).toEqual('Hello **I am bold** yay');
      });

      it ('renders italic text correctly', function () {
        /* eslint-disable */
        var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"depth":0,"type":"unstyled","text":"Hello There, I am italic yay","entityRanges":[],"inlineStyleRanges":[{"offset":12,"length":12,"style":"ITALIC"}]}]};
        /* eslint-enable */
        var markdown = draftToMarkdown(rawObject);

        expect(markdown).toEqual('Hello There, _I am italic_ yay');
      });
    });

    it('renders links with a URL correctly', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{"0":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://google.com"}},"1":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://facebook.github.io/draft-js/"}}},"blocks":[{"key":"58spd","text":"This is a test of a link","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":18,"length":6,"key":0}],"data":{}},{"key":"9ln6g","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3euar","text":"And perhaps we should test once more.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":4,"length":7,"key":1}],"data":{}}]};
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('This is a test of [a link](https://google.com)\n\nAnd [perhaps](https://facebook.github.io/draft-js/) we should test once more.');
    });

    it('renders links with a HREF correctly', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{"0":{"type":"LINK","mutability":"MUTABLE","data":{"href":"https://google.com"}},"1":{"type":"LINK","mutability":"MUTABLE","data":{"href":"https://facebook.github.io/draft-js/"}}},"blocks":[{"key":"58spd","text":"This is a test of a link","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":18,"length":6,"key":0}],"data":{}},{"key":"9ln6g","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3euar","text":"And perhaps we should test once more.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":4,"length":7,"key":1}],"data":{}}]};
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('This is a test of [a link](https://google.com)\n\nAnd [perhaps](https://facebook.github.io/draft-js/) we should test once more.');
    });

    it('renders “the kitchen sink” correctly', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"2uvch","text":"Hello!","type":"header-one","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"gcip","text":"My name is Rose :) \nToday, I'm here to talk to you about how great markdown is!\n","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":11,"length":4,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"eu8ak","text":"First, here's a few bullet points:","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"fiti6","text":"One","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"d8amu","text":"Two","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7r62d","text":"Three","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3n7hc","text":"A codeblock","type":"code-block","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9o0hn","text":"And then... some monospace text?\nOr... italics?","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":12,"length":19,"style":"CODE"},{"offset":39,"length":8,"style":"ITALIC"}],"entityRanges":[],"data":{}}]};
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('# Hello!\n\nMy name is **Rose** :) \nToday, I\'m here to talk to you about how great markdown is!\n\n\n## First, here\'s a few bullet points:\n\n- One\n- Two\n- Three\n\n```\nA codeblock\n```\n\nAnd then... `some monospace text`?\nOr... _italics?_');
    });

    it('renders complex nested items correctly', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"2unrq","text":"asdasdasd","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":9,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"62od7","text":"asdasd","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":6,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"c5obb","text":"asdasdasdmmmasdads","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":9,"style":"BOLD"},{"offset":0,"length":12,"style":"ITALIC"}],"entityRanges":[],"data":{}}]};
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('**asdasdasd**\n\n**asdasd**\n\n**_asdasdasd_**_mmm_asdads');

      /* eslint-disable */
      rawObject = {"entityMap":{"0":{"type":"mention","mutability":"SEGMENTED","data":{"mention":{"name":"Bran Stark","avatar":"https://d1ojh8nvjh9gcx.cloudfront.net/accounts/168181/2e4bff18a328c50404c411c04e608a32a967b1a2/large_2x.png","link":null,"id":168181}}}},"blocks":[{"key":"bkvjj","text":"asdadd adasdasd Bran Stark sadadsadasddasdasdasdsadsadasdsadasdasdasdsa","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":7,"length":9,"style":"BOLD"},{"offset":27,"length":27,"style":"BOLD"},{"offset":38,"length":7,"style":"ITALIC"},{"offset":63,"length":8,"style":"ITALIC"}],"entityRanges":[{"offset":16,"length":10,"key":0}],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject, {
        entityItems: {
          mention: {
            open: function () {
              return '[';
            },

            close: function (entity) {
              return '](@'+ entity.data.mention.id +')';
            }
          }
        }
      });

      expect(markdown).toEqual('asdadd **adasdasd** [Bran Stark](@168181) **sadadsadasd_dasdasd_asdsadsad**asdsadasd_asdasdsa_');

      /* eslint-disable */
      rawObject = {"entityMap":{"0":{"type":"mention","mutability":"SEGMENTED","data":{"mention":{"name":"Bran Stark","avatar":"https://d1ojh8nvjh9gcx.cloudfront.net/accounts/168181/2e4bff18a328c50404c411c04e608a32a967b1a2/large_2x.png","link":null,"id":168181}}}},"blocks":[{"key":"42pht","text":"jkhkhj Bran Stark  khkjj","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":17,"style":"BOLD"}],"entityRanges":[{"offset":7,"length":10,"key":0}],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject, {
        entityItems: {
          mention: {
            open: function () {
              return '[';
            },

            close: function (entity) {
              return '](@'+ entity.data.mention.id +')';
            }
          }
        }
      });

      expect(markdown).toEqual('**jkhkhj [Bran Stark](@168181)**  khkjj');
    });

    it('renders custom items correctly', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"f2bpj","text":"OneTwoThree","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":3,"style":"red"},{"offset":3,"length":3,"style":"orange"},{"offset":6,"length":5,"style":"yellow"}],"entityRanges":[],"data":{}}]};
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject, {
        styleItems: {
          red: {
            open: function () {
              return '<span style="color: red">';
            },

            close: function () {
              return '</span>';
            }
          },

          orange: {
            open: function () {
              return '<span style="color: orange">';
            },

            close: function () {
              return '</span>';
            }
          },

          yellow: {
            open: function () {
              return '<span style="color: yellow">';
            },

            close: function () {
              return '</span>';
            }
          }
        }
      });

      expect(markdown).toEqual('<span style="color: red">One</span><span style="color: orange">Two</span><span style="color: yellow">Three</span>')
    });

    it('allows to retrieve block data', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"fb5f8","text":"","type":"atomic:image","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{"src":"https://example.com"}}]}
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject, {
        styleItems: {
          'atomic:image': {
            open: (block) => {
              const alt = block.data.alt || ''
              const title = block.data.title
                ? ` "${block.data.title}"`
                : ''
              return `![${alt}](${block.data.src}${title})`
            },
            close: () => ''
          }
        }
      })

      expect(markdown).toEqual('![](https://example.com)')
    });

    it('renders nested unordered lists', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"fqn68","text":"item","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"5p96k","text":"item","type":"unordered-list-item","depth":1,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject);

      expect(markdown).toEqual('- item\n    - item');
    });

    it('renders nested ordered lists', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"d9c1d","text":"item","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"meoh","text":"item","type":"ordered-list-item","depth":1,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject);

      expect(markdown).toEqual('1. item\n    1. item');
    });

    it('renders complex nested ordered lists', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"83lsh","text":"Test Item one unnested","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"f8nk7","text":"Test Item one nested","type":"ordered-list-item","depth":1,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"68mnn","text":"Test Item two nested","type":"ordered-list-item","depth":1,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3lr37","text":"Test item three nested","type":"ordered-list-item","depth":1,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"6t7np","text":"Test item two unnested","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c6spi","text":"Test item three unnested","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"dm827","text":"Test Item Four unnested","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"bni48","text":"Test item one nested under test item four","type":"ordered-list-item","depth":1,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"d3g6c","text":"Test item one double nested","type":"ordered-list-item","depth":2,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"cshu1","text":"Test item two double nested","type":"ordered-list-item","depth":2,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject);

      expect(markdown).toEqual('1. Test Item one unnested\n    1. Test Item one nested\n    2. Test Item two nested\n    3. Test item three nested\n2. Test item two unnested\n3. Test item three unnested\n4. Test Item Four unnested\n    1. Test item one nested under test item four\n        1. Test item one double nested\n        2. Test item two double nested');
    });

    it('renders unnested ordered lists', function () {
      /* eslint-disable */
      var rawObject = {"entityMap":{},"blocks":[{"key":"d9c1d","text":"item","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"meoh","text":"item","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */
      var markdown: Draft.RawDraftContentState = draftToMarkdown(rawObject);

      expect(markdown).toEqual('1. item\n2. item');
    });

    it('renders newlines after ordered lists correctly', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"d9c1d","text":"item","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"meoh","text":"item","type":"ordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"litt","text":"foo","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject);

      expect(markdown).toEqual('1. item\n2. item\n\nfoo');
    });

    it('renders newlines after unordered lists correctly', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"d9c1d","text":"item","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"meoh","text":"item","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"litt","text":"foo","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject);

      expect(markdown).toEqual('- item\n- item\n\nfoo');
    });

    it('renders emoji correctly', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState =  {
        'entityMap': {},
        'blocks': [
          {
            'depth': 0,
            'type': 'unstyled',
            'text': 'Testing 👍 italic words words words bold words words words',
            'entityRanges': [],
            'inlineStyleRanges': [
              {
                'offset': 10,
                'length': 6,
                'style': 'ITALIC'
              },
              {
                'offset': 35,
                'length': 4,
                'style': 'BOLD'
              }
            ]
          }
        ]
      }
      /* eslint-enable */
      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('Testing 👍 _italic_ words words words **bold** words words words');
    });
  });

  describe('escaping markdown characters', function () {

    it ('escapes inline markdown characters', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"Test _not italic_ Test **not bold**","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('Test \\_not italic\\_ Test \\*\\*not bold\\*\\*');
    });

    it ('escapes block markdown characters when at start of line', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"# Test _not # italic_ Test **not bold**","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('\\# Test \\_not # italic\\_ Test \\*\\*not bold\\*\\*');
    });

    it ('doesn’t escape heading markdown characters when no whitespace afterwards', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"#Test","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('#Test');
    });

    it ('does escape blockquote markdown characters when no whitespace afterwards', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":">Test","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('\\>Test');
    });

    it ('doesn’t escape markdown characters in inline code blocks', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"such special code which contains *special* chars is so important","type":"unstyled","depth":0,"inlineStyleRanges":[{'offset':5,'length':43,'style':'CODE'}],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('such `special code which contains *special* chars` is so important');
    });

    it ('doesn’t escape markdown characters in code blocks', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"such special _code_ which contains *special* chars *wow*","type":"code-block","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject);
      expect(markdown).toEqual('```\nsuch special _code_ which contains *special* chars *wow*\n```');
    });
  });

  describe('allowing markdown characters', function () {
    it('preserves inline markdown characters', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"Test _not italic_ Test **not bold**","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject, { escapeMarkdownCharacters: false });
      expect(markdown).toEqual('Test _not italic_ Test **not bold**');
    });

    it('preserves block markdown characters at begining of a line', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"# Test _not # italic_ Test **not bold**","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject, { escapeMarkdownCharacters: false });
      expect(markdown).toEqual('# Test _not # italic_ Test **not bold**');
    });

    it('preserves blockquotes markdown characters with no trailing whitespace', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":">Test","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject, { escapeMarkdownCharacters: false });
      expect(markdown).toEqual('>Test');
    });

    it('preserves italics markdown characters with no trailing whitespace', function () {
      /* eslint-disable */
      var rawObject: Draft.RawDraftContentState = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"_Test_","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};
      /* eslint-enable */

      var markdown = draftToMarkdown(rawObject, { escapeMarkdownCharacters: false });
      expect(markdown).toEqual('_Test_');
    });
  });
});
