var assert = require('assert');
var child = require('child_process');
var exec = child.exec;
var spawn = child.spawn;
var fs = require('fs');
var sourdough = require('../lib/index.js');
var path = require('path');

var features = [
  'calc',
  'custom-media',
  'import',
  'import-plain',
  'prefixes',
  'vars'
];

/**
 * Node API tests.
 */

describe('sourdough', function () {
  it('should return a css string', function () {
    assert('string' == typeof sourdough('body {}'));
  });
});

/**
 * Feature tests.
 */

describe('features', function () {
  features.forEach(function (name) {
    it('should add ' + name + ' support', function () {
      var input = read('fixtures/' + name);
      var output = read('fixtures/' + name + '.out', '.css');
      assert.equal(sourdough(input, { root: 'test/fixtures' }).trim(), output.trim());
    });
  });
});

/**
 * CLI tests.
 */

describe('cli', function () {
  var input = read('fixtures/cli/input');
  var output = read('fixtures/cli/input.out', '.css');

  afterEach(function () {
    remove('fixtures/cli/output');
  });

  it('should read from a file and write to a file', function (done) {
    exec('bin/sourdough test/fixtures/cli/input.wcss test/fixtures/cli/output.css', function (err, stdout) {
      if (err) return done(err);
      var res = read('fixtures/cli/output', '.css');
      assert.equal(res, output);
      done();
    });
  });

  it('should read from a file and write to stdout', function (done) {
    exec('bin/sourdough test/fixtures/cli/input.wcss', function (err, stdout) {
      if (err) return done(err);
      assert.equal(stdout, output);
      done();
    });
  });

  it('should read from stdin and write to stdout', function (done) {
    var child = exec('bin/sourdough', function (err, stdout) {
      if (err) return done(err);
      assert.equal(stdout, output);
      done();
    });

    child.stdin.write(new Buffer(input));
    child.stdin.end();
  });

  it('should log on verbose', function (done) {
    exec('bin/sourdough -v test/fixtures/cli/input.wcss test/fixtures/cli/output.css', function (err, stdout) {
      if (err) return done(err);
      assert(-1 != stdout.indexOf('write'));
      done();
    });
  });

  it('should allow configurable import root', function (done) {
    exec('bin/sourdough -i test/fixtures test/fixtures/import.wcss test/fixtures/cli/output.css', function (err, stdout) {
      if (err) return done(err);
      var res = read('fixtures/cli/output', '.css');
      var expected = read('fixtures/import.out', '.css');
      assert.equal(res, expected);
      done();
    });
  });

  it('should log on non-existant file', function (done) {
    exec('bin/sourdough test/fixtures/cli/non-existant.wcss', function (err, stdout, stderr) {
      assert(err);
      assert(err.code == 1);
      assert(-1 != stderr.indexOf('not found'));
      done();
    });
  });

  xit('should print a nice error', function (done) {
    exec('bin/sourdough test/fixtures/cli/error.wcss', function (err, stdout, stderr) {
      assert(err);
      assert(err.code == 1);
      assert(-1 != stderr.indexOf('error'));
      assert(-1 != stderr.indexOf('SyntaxError: Missing closing parentheses'));
      assert(-1 != stderr.indexOf('at '));
      assert(-1 != stderr.indexOf('15'));
      assert(-1 != stderr.indexOf('var('));
      done();
    });
  });
});

/**
 * Read a fixture by `filename`.
 *
 * @param {String} filename
 * @return {String}
 */

function read (filename, ext) {
  var file = resolve(filename, ext);
  return fs.readFileSync(file, 'utf8');
}

/**
 * Remove a fixture by `filename`.
 *
 * @param {String} filename
 */

function remove (filename) {
  var file = resolve(filename, '.css');
  if (!fs.existsSync(file)) return;
  fs.unlinkSync(file);
}

/**
 * Resolve a fixture by `filename`.
 *
 * @param {String} filename
 * @return {String}
 */

function resolve (filename, ext) {
  if (ext === undefined) ext = '.wcss'
  return path.resolve(__dirname, filename + ext);
}
