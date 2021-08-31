/* global hexo */
'use strict';

const htmlparser = require('htmlparser2');
const domrender = require("dom-serializer").default;
const defaults = require('lodash.defaults');

const Filter = require('./dom-filter');

const DEFAULT_CONFIG = {
  depth: 10,
  excerpt_excludes: [],
  more_excludes: [],
  hideWholePostExcerpts: false
};

module.exports = function(db) {
  let legacy = {};
  if (this.config.excerpt_depth) {
    this.log.warn('excerpt_depth is deprecated, please use excerpt.depth instead.');
    legacy.depth = this.config.excerpt_depth;
  }

  let opts = defaults({}, this.config.excerpt, legacy, DEFAULT_CONFIG);
  opts.depth = parseInt(opts.depth);
  if (!Array.isArray(opts.excerpt_excludes)) opts.excerpt_excludes = [opts.excerpt_excludes];
  if (!Array.isArray(opts.more_excludes)) opts.more_excludes = [opts.more_excludes];

  // create filters
  let excerptFilter = new Filter(this, opts.excerpt_excludes);
  let moreFilter = new Filter(this, opts.more_excludes);

  return db.posts.map(post => {

    //honour the <!-- more --> !!!
    if (/<!--\s*more\s*-->/.test(post.content) || post.content.indexOf('<a id="more"></a>') !== -1 || post.content.indexOf('<span id="more"></span>') !== -1) {
      return {
        path: post.path,
        data: post,
        layout: post.layout
      };
    }

    const nodes = htmlparser.parseDocument(post.content, { decodeEntities: false }).children;

    // tracks how many tag nodes we found
    let stopIndex = 1;
    // tracks how many nodes we found in total
    let index = 0;
    for (; index < nodes.length && stopIndex <= opts.depth; index++) {
      if (nodes[index].type === 'tag' && excerptFilter.match(nodes[index])) {
        stopIndex++;
      }
    }

    // set correct excerpt and more nodes values
    let excerptNodes = nodes.slice(0, index);
    let moreNodes = nodes.slice(index);

    // filter nodes
    excerptNodes = excerptFilter.filter(excerptNodes);
    moreNodes = moreFilter.filter(moreNodes);

    // If the hideWholePostExcerpts option is set to true (the default), don't show
    // excerpts for short posts (i.e. ones where the excerpt is the whole post)
    if (moreNodes.length != 0 || !opts.hideWholePostExcerpts) {
      post.excerpt = domrender(excerptNodes, { decodeEntities: false });
      post.more = domrender(moreNodes, { decodeEntities: false });
    }

    return {
      path: post.path,
      data: post,
      layout: post.layout
    };
  });

};
