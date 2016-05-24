'use strict';

const should = require('chai').should();
const hexoExcerptGenerator = require('../lib/hexo-excerpt');

let fakeHexoLocals = {
  posts: [
    {
      path: '',
      title: 'post with <= 10 blocks',
      excerpt: '',
      content: `
<p>block 1</p>
<p>block 2 <span>123</span></p>
<div>block3</div>`.trim()
    },
    {
      path: '',
      title: 'post with > 10 blocks',
      excerpt: '',
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
<p>block 11</p>
      `.trim()
    },
    {
      path: '',
      title: 'post with user defined more seperator',
      excerpt: '',
      content: `
<p>block 1</p>
<!-- more -->
<p>block 2 <span>123</span></p>
<div>block3</div>`.trim()
    }
  ]
};

describe('Automatic excerpt generator', () => {

  let generatedPosts = hexoExcerptGenerator(fakeHexoLocals);

  it('post with <= 10 tags should have no excerpt', () => {
    generatedPosts[0].data.excerpt.should.equal('');
  });

  it('post with > 10 tags should have excerpt', () => {
    generatedPosts[1].data.excerpt.should.not.equal('');
    generatedPosts[1].data.excerpt.should.equal('<p>block 1</p>\n<p>block 2</p>\n<p>block 3</p>\n<p>block 4</p>\n<p>block 5</p>\n');
  });

  it('post with <!-- more --> should return the way it is', () => {
    generatedPosts[2].data.excerpt.should.equal('');
  });

});
