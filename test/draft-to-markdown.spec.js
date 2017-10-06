import { markdownToDraft, draftToMarkdown } from '../src/index';

describe('draftToMarkdown', function () {
  it('renders inline styled text with trailing whitespace correctly', function () {
    /* eslint-disable */
    var rawObject = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"Test Bold Text Test","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":5,"length":10,"style":"BOLD"}],"entityRanges":[],"data":{}}]};
    /* eslint-enable */

    var markdown = draftToMarkdown(rawObject);
    expect(markdown).toEqual('Test **Bold Text** Test');
  });

  it('renders inline styled text with trailing whitespace correctly when trailing whitespace is the last character', function () {
    /* eslint-disable */
    var rawObject = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"Test Bold Text ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":5,"length":10,"style":"BOLD"}],"entityRanges":[],"data":{}}]};
    /* eslint-enable */

    var markdown = draftToMarkdown(rawObject);
    expect(markdown).toEqual('Test **Bold Text** ');
  });

  it('renders nested inline styled text with trailing whitespace correctly', function () {
    /* eslint-disable */
    var rawObject = {"entityMap":{},"blocks":[{"key":"dvfr1","text":"Test Bold Text Test","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":10,"style":"ITALIC"},{"offset":5,"length":9,"style":"BOLD"}],"entityRanges":[],"data":{}}]};
    /* eslint-enable */

    var markdown = draftToMarkdown(rawObject);
    expect(markdown).toEqual('_Test **Bold**_ **Text** Test');
  });

  it('renders links correctly', function () {
    /* eslint-disable */
    var rawObject = {"entityMap":{"0":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://google.com"}},"1":{"type":"LINK","mutability":"MUTABLE","data":{"url":"https://facebook.github.io/draft-js/"}}},"blocks":[{"key":"58spd","text":"This is a test of a link","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":18,"length":6,"key":0}],"data":{}},{"key":"9ln6g","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3euar","text":"And perhaps we should test once more.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":4,"length":7,"key":1}],"data":{}}]};
    /* eslint-enable */
    var markdown = draftToMarkdown(rawObject);
    expect(markdown).toEqual('This is a test of [a link](https://google.com)\n\n\n\nAnd [perhaps](https://facebook.github.io/draft-js/) we should test once more.');
  });

  it('renders "the kitchen sink" correctly', function () {
    /* eslint-disable */
    var rawObject = {"entityMap":{},"blocks":[{"key":"2uvch","text":"Hello!","type":"header-one","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"gcip","text":"My name is Rose :) \nToday, I'm here to talk to you about how great markdown is!\n","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":11,"length":4,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"eu8ak","text":"First, here's a few bullet points:","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"fiti6","text":"One","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"d8amu","text":"Two","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7r62d","text":"Three","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"3n7hc","text":"A codeblock","type":"code-block","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"9o0hn","text":"And then... some monospace text?\nOr... italics?","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":12,"length":19,"style":"CODE"},{"offset":39,"length":8,"style":"ITALIC"}],"entityRanges":[],"data":{}}]};
    /* eslint-enable */
    var markdown = draftToMarkdown(rawObject);
    expect(markdown).toEqual('# Hello!\n\nMy name is **Rose** :) \nToday, I\'m here to talk to you about how great markdown is!\n\n\n## First, here\'s a few bullet points:\n\n- One\n- Two\n- Three\n\n```\nA codeblock\n```\n\nAnd then... `some monospace text`?\nOr... _italics?_');
  });

  it('renders complex nested items correctly', function () {
    /* eslint-disable */
    var rawObject = {"entityMap":{},"blocks":[{"key":"2unrq","text":"asdasdasd","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":9,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"62od7","text":"asdasd","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":6,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"c5obb","text":"asdasdasdmmmasdads","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":9,"style":"BOLD"},{"offset":0,"length":12,"style":"ITALIC"}],"entityRanges":[],"data":{}}]};
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
    var rawObject = {"entityMap":{},"blocks":[{"key":"f2bpj","text":"OneTwoThree","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":3,"style":"red"},{"offset":3,"length":3,"style":"orange"},{"offset":6,"length":5,"style":"yellow"}],"entityRanges":[],"data":{}}]};
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
    var rawObject = {"entityMap":{},"blocks":[{"key":"fb5f8","text":"","type":"atomic:image","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{"src":"https://example.com"}}]}
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
  })
});
