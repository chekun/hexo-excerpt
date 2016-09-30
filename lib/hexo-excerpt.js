/* global hexo */
'use strict';

const htmlparser = require('htmlparser2');
const domutils = require('domutils');

module.exports = function(db) {

	let node_length = 10;
	let config = this.config;
	let options = config.options;

	if(options && options.excerpt_nodes) {
		node_length = parseInt(options.excerpt_nodes);
	}

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

		// tracks how many tag nodes we found
		let stopIndex = 1;
		// tracks how many nodes we found in total
		let index = 0;
		for (; index < nodes.length && stopIndex <= node_length; index++) {
			if (nodes[index].type === 'tag') {
				stopIndex++;
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
      layout: 'post'
    };
  });

};
