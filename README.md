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

## How?

This plugin runs through all your posts, if your post has more than 10 direct tags, then the first 10 tags will be the excerpt, otherwise, excerpt will be not applied!

## License

MIT