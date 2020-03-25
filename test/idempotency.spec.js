import { markdownToDraft, draftToMarkdown } from '../src/index';

/*
 * Note: These tests are to make sure markdown to draft and then back to markdown have the exact same value before-and-after
 *
 * However, there are some cases where this will not be possible -
 * For example, this is valid in draftjs:
 * _I am italic content with a space included at the end _
 * but markdown will struggle with this so we need to convert it to:
 * _I am italic content with a space after the closing italic symbol instead of before_
 * The end result should basically look the same to a human, but behind the scenes it has to be a bit different.
 *
 * Still, for the most part results should match, so these tests are for cases when they _should_ match.
*/

describe('idempotency', function () {

  it('renders new lines text correctly', function () {
    var markdownString = 'Test\n\n\nHello There\n\nSmile\n\n\n\n\n\n\n\nYep Hi';
    var draftJSObject = markdownToDraft(markdownString, {preserveNewlines: true});
    var markdownFromDraft = draftToMarkdown(draftJSObject, {preserveNewlines: true});

    expect(markdownFromDraft).toEqual(markdownString);

    markdownString = 'a\nb\n\nc\n\n\nd';
    draftJSObject = markdownToDraft(markdownString, {preserveNewlines: true});
    markdownFromDraft = draftToMarkdown(draftJSObject, {preserveNewlines: true});

    expect(markdownFromDraft).toEqual(markdownString);

    markdownString = '\n\na';
    draftJSObject = markdownToDraft(markdownString, {preserveNewlines: true});
    markdownFromDraft = draftToMarkdown(draftJSObject, {preserveNewlines: true});
    expect(markdownFromDraft).toEqual(markdownString);

  });

  it('renders new lines text correctly with styled blocks', function () {
    var markdownString = '# Test\n\n\nHello There\n\nSmile\n\n\n\n\n\n\n\nYep Hi';
    var draftJSObject = markdownToDraft(markdownString, {preserveNewlines: true});
    var markdownFromDraft = draftToMarkdown(draftJSObject, {preserveNewlines: true});

    expect(markdownFromDraft).toEqual(markdownString);
  });

  it('renders blockquotes correctly', function () {
    var markdownString = '> Hello I am Blockquote\n\nI am not\n\n> I am';
    var draftJSObject = markdownToDraft(markdownString, {preserveNewlines: true});
    var markdownFromDraft = draftToMarkdown(draftJSObject, {preserveNewlines: true});
    expect(markdownFromDraft).toEqual(markdownString);
  });

  it('renders italic text correctly', function () {
    var markdownString = '_I am italic_ …I am not italic.';
    var draftJSObject = markdownToDraft(markdownString);
    var markdownFromDraft = draftToMarkdown(draftJSObject);

    expect(markdownFromDraft).toEqual(markdownString);
  });

  it('renders bold text correctly', function () {
    var markdownString = 'Hello **I am bold** I am not bold.';
    var draftJSObject = markdownToDraft(markdownString);
    var markdownFromDraft = draftToMarkdown(draftJSObject);

    expect(markdownFromDraft).toEqual(markdownString);
  });

  it('renders nested styles correctly', function () {
    var markdownString = '**bold** _italic_ test **bold _italic_** _italic_ _italic **bold** italic **bold italic**_';
    var draftJSObject = markdownToDraft(markdownString);
    var markdownFromDraft = draftToMarkdown(draftJSObject);

    expect(markdownFromDraft).toEqual(markdownString);
  });

  it('renders inline code correctly', function () {
    var markdownString = 'Test `here is some inline code`';
    var draftJSObject = markdownToDraft(markdownString);
    var markdownFromDraft = draftToMarkdown(draftJSObject);

    expect(markdownFromDraft).toEqual(markdownString);
  });

  it('renders code fences correctly', function () {
    var markdownString = '```\nHello I am Codefence\n```';
    var draftJSObject = markdownToDraft(markdownString);
    var markdownFromDraft = draftToMarkdown(draftJSObject);

    expect(markdownFromDraft).toEqual(markdownString);
  });

  it('renders blockquotes correctly', function () {
    var markdownString = '> Hello I am Blockquote';
    var draftJSObject = markdownToDraft(markdownString);
    var markdownFromDraft = draftToMarkdown(draftJSObject);

    expect(markdownFromDraft).toEqual(markdownString);
  });

  // TODO this test should pass but markdown-to-draft doesn’t correctly create empty markdown blocks in this case currently.
  xit('renders blockquotes with blank lines correctly', function () {
    var markdownString = '> Hello I am Blockquote\n> more\n> \n> \n> hey';
    var draftJSObject = markdownToDraft(markdownString);
    var markdownFromDraft = draftToMarkdown(draftJSObject);

    expect(markdownFromDraft).toEqual(markdownString);
  });

  it('renders links correctly', function () {
    var markdown = 'This is a test of [a link](https://google.com)\n\nAnd [perhaps](https://facebook.github.io/draft-js/) we should test once more.';
    var rawDraftConversion = markdownToDraft(markdown);
    var markdownConversion = draftToMarkdown(rawDraftConversion);

    expect(markdownConversion).toEqual(markdown);
  });

  it ('renders codeblock with syntax correctly', function () {
    var markdown = '```javascript\nsingle line codeblock\n```';
    var rawDraftConversion = markdownToDraft(markdown);
    var markdownConversion = draftToMarkdown(rawDraftConversion);
    expect(markdownConversion).toEqual(markdown);
  });

  it('renders "the kitchen sink" correctly', function () {
    var markdown = '# Hello!\n\nMy name is **Rose** :)\nToday, I\'m here to talk to you about how great markdown is!\n\n## First, here\'s a few bullet points:\n\n- One\n- Two\n- Three\n\n```\nA codeblock\n```\n\nAnd then... `some monospace text`?\nOr... _italics?_';
    var rawDraftConversion = markdownToDraft(markdown);
    var markdownConversion = draftToMarkdown(rawDraftConversion);

    expect(markdownConversion).toEqual(markdown);
  });

  it ('renders escaped italics correctly', function () {
    var markdown = 'test \\_not italic\\_ test';
    var rawDraftConversion = markdownToDraft(markdown);
    var markdownConversion = draftToMarkdown(rawDraftConversion);

    expect(markdownConversion).toEqual(markdown);
  });

  it ('renders escaped bold correctly', function () {
    var markdown = 'test \\*\\*not italic\\*\\* test';
    var rawDraftConversion = markdownToDraft(markdown);
    var markdownConversion = draftToMarkdown(rawDraftConversion);

    expect(markdownConversion).toEqual(markdown);
  });
});
