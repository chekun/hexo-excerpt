'use strict';

const HexoExcerpt = require('./lib/hexo-excerpt');

hexo.extend.generator.register('excerpt', HexoExcerpt);
