'use strict';

const htmlparser = require('htmlparser2');
const domutils = require('domutils');

module.exports = (db) => {

  return db.posts.map(post => {

    //honour the <!-- more --> !!!
    if (/<!-- more -->/.test(post.content)) {
      return {
        path: post.path,
        data: post,
        layout: 'post'
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

    if (nodes.length > 10) {
      let stopIndex = 0;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].type === 'tag') {
          if (++stopIndex > 9) {
            break;
          }
        }
      }

      nodes = nodes.slice(0, stopIndex);
      post.excerpt = (nodes.map(node => domutils.getOuterHTML(node))).join('');
    }

    return {
      path: post.path,
      data: post,
      layout: 'post'
    };
  });

};
