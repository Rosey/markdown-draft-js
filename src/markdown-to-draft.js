const Remarkable = require('remarkable');

// Block level items, key is Remarkable's key for them, value returned is
// A function that generates the raw draftjs key and block data.
//
// Why a function? Because in some cases (headers) we need additional information
// before we can determine the exact key to return. And blocks may also return data
const DefaultBlockTypes = {
    paragraph_open: function (item) {
        return {
            type: 'unstyled',
            text: ''
        };
    },
    image: function (item) {
        return {
            type: 'atomic',
            text: ' '
        };
    },
    blockquote_open: function (item) {
        return {
            type: 'blockquote',
            text: ''
        };
    },

    ordered_list_item_open: function () {
        return {
            type: 'ordered-list-item',
            text: ''
        };
    },

    unordered_list_item_open: function () {
        return {
            type: 'unordered-list-item',
            text: ''
        };
    },

    fence: function (item) {
        return {
            type: 'code-block',
            text: item.content || '',
            entityRanges: [],
            inlineStyleRanges: []
        };
    },

    heading_open: function (item) {
        var type = 'header-' + ({
            1: 'one',
            2: 'two',
            3: 'three',
            4: 'four',
            5: 'five',
            6: 'six'
        })[item.hLevel];

        return {
            type: type,
            text: ''
        };
    }

};

// Entity types. These are things like links or images that require
// additional data and will be added to the `entityMap`
// again. In this case, key is remarkable key, value is
// meethod that returns the draftjs key + any data needed.
const DefaultBlockEntities = {
    link_open: function (item) {
        return {
            type: 'LINK',
            mutability: 'MUTABLE',
            data: {
                url: item.href
            }
        };
    },
    image: function (item) {
        let data = {src: item.src, type: "placeholder"}
        if (item.alt && item.alt.length > 1)
            data.alt = item.alt;
        return {
            type: 'image',
            mutability: 'IMMUTABLE',
            data: data
        };
    }
};

// Entity styles. Simple Inline styles that aren't added to entityMap
// key is remarkable key, value is draftjs raw key
const DefaultBlockStyles = {
    strong_open: 'BOLD',
    em_open: 'ITALIC',
    ins_open: 'UNDERLINE',
    code: 'CODE',
    del_open: 'STRIKETHROUGH',
    sup: 'SUPERSCRIPT',
    sub: 'SUBSCRIPT'
};


// Key generator for entityMap items
var idCounter = -1;

function generateUniqueKey() {
    idCounter++;
    return idCounter;
}


function addStyledBlock(offset, content, style) {
    return {offset: offset, length: content ? content.length : 1, style};

}

function addEntityBlock(blockEntities,length, content, entity) {
    let key = generateUniqueKey();
    blockEntities[key] = entity;
    return {
        offset: content.length || 0,
        length: length,
        key: key,
    }
}

function updateHistoryTag(tag, content, blockHistory) {
    let idx = -1
    for (let i = blockHistory.length-1;i>=0;i--)
        if (blockHistory[i].tag == tag) {
            blockHistory[i].items.forEach(item => item.length = content.length - item.offset)
            idx = i
            break
        }
    if (idx !== -1)
        blockHistory = blockHistory.slice(0,idx)
}


/*
 * Handle inline content in a block level item
 * parses for BlockEntities (links, images) and BlockStyles (em, strong)
 * doesn't handle block level items (blockquote, ordered list, etc)
 *
 * @param <Object> inlineItem - single object from remarkable data representation of markdown
 * @param <Object> BlockEntities - key-value object of mappable block entity items. Passed in as param so users can include their own custom stuff
 * @param <Object> BlockStyles - key-value object of mappable block styles items. Passed in as param so users can include their own custom stuff
 *
 * @return <Object>
 *  content: Entire text content for the inline item,
 *  blockEntities: New block eneities to be added to global block entity map
 *  blockEntityRanges: block-level representation of block entities including key to access the block entity from the global map
 *  blockStyleRanges: block-level representation of styles (eg strong, em)
*/
function parseInline(inlineItem, BlockEntities, BlockStyles, htmlPlugins) {
    let content = '', blockEntities = {}, blockEntityRanges = [], blockHistory = [], blockInlineStyleRanges = [];
    const parser = new DOMParser();
    inlineItem.children.forEach(function (child) {
        if (child.type === 'text') {
            content += child.content;
        } else if (child.type === 'softbreak') {
            content += '\n';
        } else if (BlockStyles[child.type]) {
            let styleBlock = addStyledBlock(content.length, child.content, BlockStyles[child.type])
            // Edge case hack because code items don't have inline content or open/close, unlike everything else
            if (['code', 'sup', 'sup'].indexOf(child.type) >= 0) {
                //styleBlock.length = child.content.length;
                content += child.content;
            }
            blockHistory.push({tag:child.type,items:[styleBlock]})
            blockInlineStyleRanges.push(styleBlock);
        } else if (BlockEntities[child.type]) {
            let entityBlock = addEntityBlock(blockEntities,1, content, BlockEntities[child.type](child))
            blockHistory.push({tag:child.type,items:[entityBlock]})
            blockEntityRanges.push(entityBlock);

        } else if (child.type.indexOf('_close') !== -1 && BlockEntities[child.type.replace('_close', '_open')]) {
            updateHistoryTag(child.type.replace('_close', '_open'), content, blockHistory)

        } else if (child.type.indexOf('_close') !== -1 && BlockStyles[child.type.replace('_close', '_open')]) {
            updateHistoryTag(child.type.replace('_close', '_open'), content, blockHistory)
        } else if (child.type === 'htmltag') {
            let node = parser.parseFromString(child.content, "text/xml").firstChild
            if (node) {
                if (node.nodeName == 'html' && child.content.startsWith('</')) {
                    let tag = child.content.replace(/[^a-z\.]+/g,  '')
                    updateHistoryTag(tag, content, blockHistory)
                } else {
                    let attribs = {}
                    for (let i = 0; i < node.attributes.length; i++) {
                        attribs[node.attributes[i].name] = node.attributes[i].value
                    }
                    if (htmlPlugins.blockPlugins[node.nodeName]) {
                        let {blockContent, blockEntity} = htmlPlugins.blockPlugins[node.nodeName](attribs)
                        let entityBlock = addEntityBlock(blockEntities,blockContent.length, content, blockEntity)
                        blockEntityRanges.push(entityBlock);
                        content += blockContent
                    } else if (htmlPlugins.inlineStylePlugins[node.nodeName]) {
                        let styles = htmlPlugins.inlineStylePlugins[node.nodeName](attribs)
                        if (styles.length > 0) {
                            let style_items = []
                            styles.forEach(item => {
                                let styleBlock = addStyledBlock(content.length, child.content, item)
                                style_items.push(styleBlock)
                                blockInlineStyleRanges.push(styleBlock);
                            })
                            blockHistory.push({tag: node.nodeName, items: style_items})

                        }
                    }
                }
            } else {

            }

        }
    });

    return {content, blockEntities, blockEntityRanges, blockInlineStyleRanges};
}

function handlSpanStyles(attribs) {
    let style_attribs = []
    if (attribs.style) {
        let styles = attribs.style.split(';')
        for (let i=0;i<styles.length;i++) {
            let style_pair = styles[i].split(':')
            if (style_pair.length == 2) {
                if (['color','background-color'].indexOf(style_pair[0]) >= 0)
                    style_attribs.push(style_pair[0] + '-' + style_pair[1])
            }

        }
    }
    return style_attribs

}

/**
 * Convert markdown into raw draftjs object
 *
 * @param {String} markdown - markdown to convert into raw draftjs object
 * @param {Object} options - optional additional data, see readme for what options can be passed in.
 *
 * @return {Object} rawDraftObject
 **/
function markdownToDraft(string, options = {}) {
    idCounter = -1;
    const defaultOptions = {html: true}
    const md = new Remarkable(Object.assign({}, defaultOptions, options.remarkableOptions || {}));
    const htmlPlugins = {blockPlugins: options.htmlBlockPlugins || {}, inlineStylePlugins: {'span': handlSpanStyles}};
    // If users want to define custom remarkable plugins for custom markdown, they can be added here
    if (options.remarkablePlugins) {
        options.remarkablePlugins.forEach(function (plugin) {
            md.use(plugin, {});
        });
    }
    md.inline.ruler.enable([
        'ins',
        'sub',
        'sup'
    ]);
    var blocks = []; // blocks will be returned as part of the final draftjs raw object
    var entityMap = {}; // entitymap will be returned as part of the final draftjs raw object
    var parsedData = md.parse(string, {}); // remarkable js takes markdown and makes it an array of style objects for us to easily parse
    var currentListType = null; // Because of how remarkable's data is formatted, we need to cache what kind of list we're currently dealing with

    // Allow user to define custom BlockTypes and Entities if they so wish
    const BlockTypes = Object.assign({}, DefaultBlockTypes, options.blockTypes || {});
    const BlockEntities = Object.assign({}, DefaultBlockEntities, options.blockEntities || {});
    const BlockStyles = Object.assign({}, DefaultBlockStyles, options.blockStyles || {});

    parsedData.forEach(function (item) {

        // Because of how remarkable's data is formatted, we need to cache what kind of list we're currently dealing with
        if (item.type === 'bullet_list_open') {
            currentListType = 'unordered_list_item_open';
        } else if (item.type === 'ordered_list_open') {
            currentListType = 'ordered_list_item_open';
        }

        var itemType = item.type;
        if (itemType === 'list_item_open') {
            itemType = currentListType;
        }

        if (itemType === 'inline') {
            // Parse inline content and apply it to the most recently created block level item,
            // which is where the inline content will belong.
            var {content, blockEntities, blockEntityRanges, blockInlineStyleRanges} = parseInline(item, BlockEntities, BlockStyles, htmlPlugins);
            var blockToModify = blocks[blocks.length - 1];
            blockToModify.text = content;
            blockToModify.inlineStyleRanges = blockInlineStyleRanges;
            blockToModify.entityRanges = blockEntityRanges;
            if (item.children.length == 1 && BlockTypes[item.children[0].type]) {
                let block = BlockTypes[item.children[0].type](item.children[0])
                blockToModify.type = block.type
                blockToModify.text = block.text
            }
            // The entity map is a master object separate from the block so just add any entities created for this block to the master object
            Object.assign(entityMap, blockEntities);
        } else if ((itemType.indexOf('_open') !== -1 || itemType === 'fence') && BlockTypes[itemType]) {
            // Draftjs only supports 1 level of blocks, hence the item.level === 0 check
            // List items will always be at least `level==1` though so we need a separate check fo rthat
            // TODO: Draft does allow lists to be nested within lists, it's the one exception to its rule,
            // but right now this code doesn't support that.
            if (item.level === 0 || item.type === 'list_item_open') {
                var block = Object.assign({
                    depth: 0
                }, BlockTypes[itemType](item))

                blocks.push(block);
            }
        }
    });

    return {
        entityMap,
        blocks
    };
}

module.exports = markdownToDraft;
