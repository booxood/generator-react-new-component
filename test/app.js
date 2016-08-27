'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-react-new-component:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({someOption: true})
      .withPrompts({
        componentName: 'Hello',
        componentPath: 'src/',
        isComponentDir: true,
        jsExtension: 'jsx',
        isAddProps: true,
        stylesheetExtension: 'scss'
      })
      .on('end', done);
  });

  it('creates files and folder', function () {
    assert.file([
      'src/hello/hello.jsx',
      'src/hello/hello.scss'
    ]);
  });

  it('Add PropTypes', function () {
    assert.fileContent('src/hello/hello.jsx', /import React, { Component, PropTypes } from 'react'/);
  });
});

describe('generator-react-new-component:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({someOption: true})
      .withPrompts({
        componentName: 'HelloWorld',
        componentPath: 'src/',
        isComponentDir: false,
        jsExtension: 'js',
        isAddProps: false,
        stylesheetExtension: 'css'
      })
      .on('end', done);
  });

  it('creates files and no folder', function () {
    assert.file([
      'src/hello-world.js',
      'src/hello-world.css'
    ]);
  });

  it('No PropTypes', function () {
    assert.fileContent('src/hello-world.js', /import React, { Component } from 'react'/);
  });
});
