/* global hexo */
'use strict';

const htmlparser = require('htmlparser2');
const domutils = require('domutils');

module.exports = function (db) {

  let nodeLength = 10;
  let characterNumber = 300;
  let config = this.config;

  if (config && config.excerpt_depth) {
    nodeLength = parseInt(config.excerpt_depth);
  }

  if (config && config.excerpt_characters) {
    let characterNumber = 300;
    nodeLength = parseInt(config.excerpt_characters);
  }

  return db.posts.map(post => {

    //honour the <!-- more --> !!!
    if (/<!-- more -->/.test(post.content)) {
      return {
        path: post.path,
        data: post,
        layout: post.layout
      };
    }

    let nodes = [];

    let parser = new htmlparser.Parser(new htmlparser.DomHandler((err, dom) => {
      if (!err) {
        nodes = dom;
      }
    }), {
        decodeEntities: false
      });

    parser.write(post.content);
    parser.done();

    // tracks how many tag nodes we found
    let stopIndex = 1;
    // tracks how many nodes we found in total
    let index = 0;
    let leftCharacters = characterNumber;
    for (; index < nodes.length && stopIndex <= nodeLength; index++) {
      if (nodes[index].type === 'tag') {
        stopIndex++;
      }

      let len = domutils.getText(nodes[index]).trim().length;
      leftCharacters -= len;
      if (leftCharacters <= 0) {
        break;
      }
    }

    // set correct excerpt and more nodes values
    let excerptNodes = nodes.slice(0, index);
    let moreNodes = nodes.slice(index);
    post.excerpt = (excerptNodes.map(node => domutils.getOuterHTML(node))).join('');
    post.more = (moreNodes.map(node => domutils.getOuterHTML(node))).join('');

    return {
      path: post.path,
      data: post,
      layout: post.layout
    };
  });

};
