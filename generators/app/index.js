'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var inquirer = require('inquirer');
var walkSync = require('walk-sync');

var util = require('./util');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the gnarly ' + chalk.red('generator-react-new-component') + ' generator!'
    ));
    var log = this.log;

    var prompts = [{
      type: 'input',
      name: 'componentName',
      message: 'What\'s name new component?',
      validate: function (value) {
        if (!util.isCamelized(value)) {
          log(
            chalk.red('\nComponent name use CamelCased! Example: HelloWorld.')
          );
          return false;
        }
        return true;
      }
    }, {
      type: 'list',
      name: 'componentPath',
      message: 'Choices component path:',
      choices: function () {
        var dirs = [];
        var reg = new RegExp('^(client|app|src)/(component|container|view|)(s)?/([a-z|-]*/)*$');
        var entries = walkSync.entries('.', {globs: ['client/**/*', 'app/**/*', 'src/**/*']});
        entries.forEach(function (entry) {
          if (entry.isDirectory() && reg.test(entry.relativePath)) {
            dirs.push(entry.relativePath);
          }
        });
        return dirs;
      },
      store: true,
      // TODO: default no effect
      default: 0
    }, {
      type: 'confirm',
      name: 'isComponentDir',
      message: 'Whether to use folder contains component files?',
      default: true
    }, {
      type: 'list',
      name: 'jsExtension',
      message: 'Choices component file extension:',
      choices: ['js', 'jsx'],
      store: true,
      default: 'jsx'
    }, {
      type: 'confirm',
      name: 'isAddProps',
      message: 'Whether to add props and state?',
      default: true
    }, {
      type: 'list',
      name: 'stylesheetExtension',
      message: 'Choices no need component stylesheet file or extension:',
      choices: [
        {name: 'no need stylesheet file', value: false},
        new inquirer.Separator(),
        'css',
        'less',
        'scss'
      ],
      store: true,
      default: 'css'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function () {
    var fileName = util.hyphenate(this.props.componentName);
    var componentPath = this.props.componentPath;
    var jsName = fileName + '.' + this.props.jsExtension;
    var stylesheetName = fileName + '.' + this.props.stylesheetExtension;
    // var jsFullPath = this.props.componentPath;
    var jsFullPath = '';
    var stylesheetFullPath = '';

    if (this.props.isComponentDir) {
      jsFullPath = path.join(componentPath, fileName, jsName);
      stylesheetFullPath = path.join(componentPath, fileName, stylesheetName);
    } else {
      jsFullPath = path.join(componentPath, jsName);
      stylesheetFullPath = path.join(componentPath, stylesheetName);
    }

    this.fs.copyTpl(
      this.templatePath('componentFile'),
      this.destinationPath(jsFullPath),
      {
        componentName: this.props.componentName,
        isAddProps: this.props.isAddProps,
        needStylesheet: Boolean(this.props.stylesheetExtension),
        stylesheetFile: stylesheetName
      }
    );

    if (Boolean(this.props.stylesheetExtension)) {
      this.fs.copy(
        this.templatePath('stylesheetFile'),
        this.destinationPath(stylesheetFullPath)
      );
    }
  }
});
