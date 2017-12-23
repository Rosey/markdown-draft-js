require('babel-polyfill');
const {draftToMarkdown, markdownToDraft} = require('markdown-draft-js');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactCreateClass = require('create-react-class');

import {Editor, EditorState, ContentState, RichUtils, convertToRaw, convertFromRaw, CompositeDecorator} from 'draft-js';
// Custom overrides for "code" style.

window.convertFromRaw = convertFromRaw;
window.convertToRaw = convertToRaw;
window.markdownToDraft = markdownToDraft;
window.ContentState = ContentState;
window.EditorState = EditorState;
window.RichUtils = RichUtils;

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    className += ' ' + this.props.label.toLowerCase();

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url}>
      {props.children}
    </a>
  );
};

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

const BLOCK_TYPES = [
      {label: 'H1', style: 'header-one'},
      {label: 'H2', style: 'header-two'},
      {label: 'H3', style: 'header-three'},
      {label: 'H4', style: 'header-four'},
      {label: 'H5', style: 'header-five'},
      {label: 'H6', style: 'header-six'},
      {label: 'Blockquote', style: 'blockquote'},
      {label: 'UL', style: 'unordered-list-item'},
      {label: 'OL', style: 'ordered-list-item'},
      {label: 'Code Block', style: 'code-block'},
    ];
const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

const DraftEditor = ReactCreateClass({
    displayName: "DraftEditor",

    getInitialState: function () {
      return {
        editorState: EditorState.createEmpty(decorator),
        markdown: ''
      };
    },

    handleKeyCommand: function (command) {
      const {editorState} = this.state;
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.setState({editorState: newState});
        return true;
      }

      return false;
    },

    clear: function () {
      var editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
      this.setState({ editorState });
    },

    onChange: function (editorState) {
      var markdown = draftToMarkdown(convertToRaw(editorState.getCurrentContent()));
      var newState = {editorState};
      if (markdown !== this.state.markdown) {
        newState.markdown = markdown;
      }

      this.setState(newState);
    },

    onTextareaChange: function (e) {
      var markdown = e.target.value;
      var editorState = EditorState.createWithContent(convertFromRaw(markdownToDraft(markdown)), decorator);
      this.setState({editorState, markdown});
    },

    onTab: function (e) {
      const maxDepth = 4;
      this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    },

    toggleBlockType: function (blockType) {
      this.onChange(
        RichUtils.toggleBlockType(
          this.state.editorState,
          blockType
        )
      );
    },

    toggleInlineStyle: function (inlineStyle) {
      this.onChange(
        RichUtils.toggleInlineStyle(
          this.state.editorState,
          inlineStyle
        )
      );
    },

    render: function () {
      const { editorState } = this.state;
      return (
        <div className="draft-js-editor-wrapper">
          <h1>Draftjs to markdown conversion example</h1>
          <p>Sorry, this example is a bit of a mess right now 🙃 will clean it up eventually! But try it out here, and check out the source <a href="https://github.com/Rosey/markdown-draft-js">on github</a>.</p>

          <div className="editor-wrapper">
            <div className="draftjs-results">
              <h1>Draft.js Editor</h1>
              <div className="editor RichEditor-root">

                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                  />
                  <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                  />
                <div className="RichEditor-editor">
                  <Editor
                    editorState={editorState}
                    handleKeyCommand={this.handleKeyCommand}
                    onChange={this.onChange}
                    onTab={this.onTab} />
                </div>
              </div>
            </div>

            <div className="markdown-results">
              <h1>Markdown Editor</h1>
              <textarea
                onChange={this.onTextareaChange}
                value={this.state.markdown}
              />
            </div>
          </div>
        </div>
      );
    }
  });


document.addEventListener('DOMContentLoaded', function () {
  var exampleDiv = document.getElementById('examples');
  ReactDOM.render(React.createElement(DraftEditor), exampleDiv);
});
