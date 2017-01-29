'use strict';

var reporters = require('../../').reporters;
var Dot = reporters.Dot;
var Base = reporters.Base;

describe('Dot reporter', function () {
  var stdout;
  var stdoutWrite;
  var runner;
  var useColors;

  beforeEach(function () {
    stdout = [];
    runner = {};
    stdoutWrite = process.stdout.write;
    process.stdout.write = function (string) {
      stdout.push(string);
    };
    useColors = Base.useColors;
    Base.useColors = false;
  });

  afterEach(function () {
    Base.useColors = useColors;
  });

  describe('on start', function () {
    it('should return a new line', function () {
      runner.on = function (event, callback) {
        if (event === 'start') {
          callback();
        }
      };
      Dot.call({epilogue: function () {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '\n'
      ];
      stdout.should.deepEqual(expectedArray);
    });
  });
  describe('on pending', function () {
    it('should return a new line and a coma', function () {
      runner.on = function (event, callback) {
        if (event === 'pending') {
          callback();
        }
      };
      Dot.call({epilogue: function () {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '\n  ',
        Base.symbols.comma
      ];
      stdout.should.deepEqual(expectedArray);
    });
  });
  describe('on pass', function () {
    describe('if test speed is fast', function () {
      it('should return a new line and a dot', function () {
        var test = {
          duration: 1,
          slow: function () { return 2; }
        };
        runner.on = function (event, callback) {
          if (event === 'pass') {
            callback(test);
          }
        };
        Dot.call({epilogue: function () {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [
          '\n  ',
          Base.symbols.dot
        ];
        stdout.should.deepEqual(expectedArray);
      });
    });
    describe('if test speed is slow', function () {
      it('should return a new line and a dot', function () {
        var test = {
          duration: 2,
          slow: function () { return 1; }
        };
        runner.on = function (event, callback) {
          if (event === 'pass') {
            callback(test);
          }
        };
        Dot.call({epilogue: function () {}}, runner);
        process.stdout.write = stdoutWrite;
        var expectedArray = [
          '\n  ',
          Base.symbols.dot
        ];
        stdout.should.deepEqual(expectedArray);
      });
    });
  });
  describe('on fail', function () {
    it('should return a new line and a exclamation mark', function () {
      var test = {
        test: {
          err: 'some error'
        }
      };
      runner.on = function (event, callback) {
        if (event === 'fail') {
          callback(test);
        }
      };
      Dot.call({epilogue: function () {}}, runner);
      process.stdout.write = stdoutWrite;
      var expectedArray = [
        '\n  ',
        Base.symbols.bang
      ];
      stdout.should.deepEqual(expectedArray);
    });
  });
  describe('on end', function () {
    it('should call the epilogue', function () {
      runner.on = function (event, callback) {
        if (event === 'end') {
          callback();
        }
      };
      var epilogueCalled = false;
      var epilogue = function () {
        epilogueCalled = true;
      };
      Dot.call({epilogue: epilogue}, runner);
      process.stdout.write = stdoutWrite;
      epilogueCalled.should.be.true();
    });
  });
});
