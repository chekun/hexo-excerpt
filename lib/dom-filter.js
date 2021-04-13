'use strict';

const domutils = require('domutils');
const CSSselect = require('css-select');

class Filter {
  constructor(hexo, excludes) {
    this.hexo = hexo;
    this.selectors = excludes.map(this._compile.bind(this));
  }

  _compile(selector) {
    try {
      return CSSselect.compile(selector);
    } catch (err) {
      this.hexo.log.error('hexo-excerpt: Ignore invalid CSS selector: ' + selector);
      return () => false;
    }
  }

  match(node) {
    // not match any
    return !this.selectors.some(s => s(node));
  }

  filter(nodes) {
    // remove inner nodes that doesn't match
    domutils.filter(n => !this.match(n), nodes)
      .forEach(node => domutils.removeElement(node));

    // only keep top level nodes that match
    return nodes.filter(this.match.bind(this));
  }
}

module.exports = Filter;
