'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var inquirer = require('inquirer');
var walkSync = require('walk-sync');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the gnarly ' + chalk.red('generator-react-new-component') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'componentName',
      message: 'What\'s name new component?',
      validate: function () {
        return true;
      }
    }, {
      type: 'list',
      name: 'componentPath',
      message: 'Choices component path:',
      choices: function () {
        var dirs = [];
        var reg = new RegExp('^(client|app|src)/(component|container)(s)?/([a-z]*/)*$');
        var entries = walkSync.entries('.', {globs: ['client/**/*', 'app/**/*', 'src/**/*']});
        entries.forEach(function (entry) {
          if (entry.isDirectory() && reg.test(entry.relativePath)) {
            dirs.push(entry.relativePath);
          }
        });
        return dirs;
      },
      store: true,
      default: 'client/components/'
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
    var jsName = this.props.componentName + '.' + this.props.jsExtension;
    var stylesheetName = this.props.componentName + '.' + this.props.stylesheetExtension;
    var jsFullPath = this.props.componentPath;
    var stylesheetFullPath = this.props.componentPath;

    if (this.props.isComponentDir) {
      jsFullPath += '/' + this.props.componentName + '/' + jsName;
      stylesheetFullPath += '/' + this.props.componentName + '/' + stylesheetName;
    } else {
      jsFullPath += jsName;
      stylesheetFullPath += stylesheetName;
    }

    this.fs.copyTpl(
      this.templatePath('componentFile'),
      this.destinationPath(jsFullPath),
      {
        componentName: this.props.componentName,
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
