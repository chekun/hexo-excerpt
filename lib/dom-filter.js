'use strict';

const domutils = require('domutils');
const CSSselect = require('css-select');

function Filter(hexo, excludes) {
  this.hexo = hexo;
  this.selectors = excludes.map(this._compile.bind(this));
}

Filter.prototype._compile = function(selector) {
  try {
    return CSSselect.compile(selector);
  } catch (err) {
    this.hexo.log.error('hexo-excerpt: Ignore invalid CSS selector: ' + selector);
    return n => false;
  }
};

Filter.prototype.match = function(node) {
  // not match any
  return !this.selectors.some(s => s(node));
};

Filter.prototype.filter = function(nodes) {
  // remove inner nodes that doesn't match
  domutils.filter(n => !this.match(n), nodes).forEach(node => {
    domutils.removeElement(node);
  });

  // only keep top level nodes that match
  return nodes.filter(this.match.bind(this));
};

module.exports = Filter;
