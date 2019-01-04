# hexo-excerpt

[![Build Status](https://travis-ci.org/chekun/hexo-excerpt.svg?branch=master)](https://travis-ci.org/chekun/hexo-excerpt)  [![NPM version](https://badge.fury.io/js/hexo-excerpt.svg)](http://badge.fury.io/js/hexo-excerpt) [![Coverage Status](https://img.shields.io/coveralls/chekun/hexo-excerpt.svg)](https://coveralls.io/r/chekun/hexo-excerpt?branch=master)

Automatic excerpt generator for [Hexo!](http://hexo.io/).

[Hexo-excerpt: https://chekun.me/post/hexo-excerpt](https://chekun.me/post/hexo-excerpt)

## Installation

``` bash
$ npm install hexo-excerpt --save
```

> This Plugin use es6 syntax, make sure your node support it.

## Features

- <!-- more --> still works!
- If you're lazy as I am, the plugin generate the excerpt for you, without breaking your sentences or codes!
- If no <!-- more --> tag is specified, the post will be updated with excerpt and more variables.
- CSS selector can be used to filter generated excerpt.

## How?

This plugin runs through all your posts, if your post has more than the configured number of direct tags, then they will be the excerpt, otherwise the whole post will be used.

## Configuration

You can specify the size of the excerpt by setting depth in your config, which defaults to 10.

You can also exclude certain tags from the generated excerpt using css selectors.
Tags matching any of the selectors will be excluded.

The default behaviour is to only show an excerpt if it would not be the whole post. Set `hideWholePostExcerpts` to `false` to override that and show whole post excerpts.

``` yaml
excerpt:
  depth: 10
  excerpt_excludes: []
  more_excludes: []
  hideWholePostExcerpts: true
```

## License

MIT
