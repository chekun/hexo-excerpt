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
<p>block 1</p>
<p>block 2 <span>123</span></p>
<div>block3</div>`.trim()
    },
    {
      path: '',
      title: 'post with > 10 blocks',
      excerpt: '',
      layout: '',
      content: `
<p>block 1</p>
<p>block 2</p>
<p>block 3</p>
<p>block 4</p>
<p>block 5</p>
<p>block 6</p>
<p>block 7</p>
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
<p>block 1</p>
<!-- more -->
<p>block 2 <span>123</span></p>
<div>block3</div>`.trim()
    }
];

hexo.locals.set('posts', posts);

describe('Automatic excerpt generator with excerpt.depth = 5', () => {

  hexo.config.excerpt = {
    depth: 5
  };

  let generatedPosts = hexoExcerptGenerator.call(hexo, hexo.locals.toObject());

  it('post with <= 5 tags should have full content as excerpt', () => {
    generatedPosts[0].data.excerpt.should.equal('<p>block 1</p>\n<p>block 2 <span>123</span></p>\n<div>block3</div>');
    generatedPosts[0].data.more.should.equal('');
  });

  it('post with > 5 tags should have excerpt and more set', () => {
    generatedPosts[1].data.excerpt.should.not.equal('');
    generatedPosts[1].data.excerpt.should.equal('<p>block 1</p>\n<p>block 2</p>\n<p>block 3</p>\n<p>block 4</p>\n<p>block 5</p>');
    generatedPosts[1].data.more.should.equal('\n<p>block 6</p>\n<p>block 7</p>\n<p>block 8</p>\n<p>block 9</p>\n<p>block 10</p>\n<p>block 11</p>');
  });

  it('post with <!-- more --> should return the way it is', () => {
    generatedPosts[2].data.excerpt.should.equal('');
  });

});

describe('Automatic excerpt generator accepts deprecated excerpt_depth = 5', () => {

  hexo.config.excerpt_depth = 5;

  let generatedPosts = hexoExcerptGenerator.call(hexo, hexo.locals.toObject());

  it('post with <= 5 tags should have full content as excerpt', () => {
    generatedPosts[0].data.excerpt.should.equal('<p>block 1</p>\n<p>block 2 <span>123</span></p>\n<div>block3</div>');
    generatedPosts[0].data.more.should.equal('');
  });

  it('post with > 5 tags should have excerpt and more set', () => {
    generatedPosts[1].data.excerpt.should.not.equal('');
    generatedPosts[1].data.excerpt.should.equal('<p>block 1</p>\n<p>block 2</p>\n<p>block 3</p>\n<p>block 4</p>\n<p>block 5</p>');
    generatedPosts[1].data.more.should.equal('\n<p>block 6</p>\n<p>block 7</p>\n<p>block 8</p>\n<p>block 9</p>\n<p>block 10</p>\n<p>block 11</p>');
  });

  it('post with <!-- more --> should return the way it is', () => {
    generatedPosts[2].data.excerpt.should.equal('');
  });

});
