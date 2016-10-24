'use strict';

let excerpt = require('./lib/hexo-excerpt');

hexo.extend.generator.register('excerpt', excerpt);
