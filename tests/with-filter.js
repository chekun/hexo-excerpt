'use strict';

const should = require('chai').should();
const Hexo = require('hexo');
const hexoExcerptGenerator = require('../lib/hexo-excerpt');

const hexo = new Hexo(__dirname, {
  silent: true
});

let posts = [
    {
      path: '',
      title: 'post with <= 10 blocks',
      excerpt: '',
      layout: '',
      content: `
<p class="also">block 1</p>
<p>block 2 <span class="also">123</span></p>
<div class="ignore">block3</div>`.trim()
    },
    {
      path: '',
      title: 'post with > 10 blocks',
      excerpt: '',
      layout: '',
      content: `
<p>block 1</p>
<p>block 2</p>
<p class="also">block 3</p>
<p>block 4 <span class="also">abc</span></p>
<p class="ignore">block 5</p>
<p>block 6</p>
<p class="ignore">block 7</p>
<p>block 8</p>
<p>block 9</p>
<p>block 10</p>
<p>block 11</p>`.trim()
    },
    {
      path: '',
      title: 'post with user defined more seperator',
      excerpt: '',
      layout: '',
      content: `
<p class="ignore">block 1</p>
<!-- more -->
<p>block 2 <span>123</span></p>
<div>block3</div>`.trim()
    }
];

hexo.locals.set('posts', posts);

describe('Automatic excerpt generator with CSS selector', () => {
  hexo.config.excerpt = {
    depth: 5,
    excerpt_excludes: [
      '.ignore',
      'span.also',
      '.invalid.'
    ],
    more_excludes: [
      '.ignore'
    ]
  };

  let generatedPosts = hexoExcerptGenerator.call(hexo, hexo.locals.toObject());

  it('tags matching selectors should not be included in excerpt', () => {
    generatedPosts[0].data.excerpt.should.equal('<p class="also">block 1</p>\n<p>block 2 </p>\n');
    generatedPosts[0].data.more.should.equal('');
  });

  it('top level tags should be equal to depth after filtering', () => {
    generatedPosts[1].data.excerpt.should.not.equal('');
    generatedPosts[1].data.excerpt.should.equal('<p>block 1</p>\n<p>block 2</p>\n<p class="also">block 3</p>\n<p>block 4 </p>\n\n<p>block 6</p>');
    generatedPosts[1].data.more.should.equal('\n\n<p>block 8</p>\n<p>block 9</p>\n<p>block 10</p>\n<p>block 11</p>');
  });

  it('post with <!-- more --> should return the way it is', () => {
    generatedPosts[2].data.excerpt.should.equal('');
  });

});
