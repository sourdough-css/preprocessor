/**
 * Module dependencies
 */

var autoprefixer = require('autoprefixer-core')
var postcss = require('postcss')
var whitespace = require('css-whitespace')
var customProperties = require("postcss-custom-properties")
var customMedia = require("postcss-custom-media")
var customSelectors = require("postcss-custom-selectors")
var calc = require("postcss-calc")
var importer = require("postcss-import")
var path = require('path')

/**
 * Module export
 */

module.exports = preprocessor

/**
 * Process CSS
 *
 * @param {String} css
 * @return {String}
 */

function preprocessor(css, options) {
  if (typeof css !== 'string') {
    throw new Error('sourdough-preprocessor: did not receive a String')
  }

  options = options || {}

  var browserConfig = options.browsers || [
    'Explorer >= 9',
    'last 5 Chrome versions',
    'last 2 Firefox versions',
    'last 2 Safari versions',
    'last 2 iOS versions',
    'Android 4'
  ];

  post = postcss()

  // Whitespace util to allow importing of plain css

  function transformWhitespace(css, file) {
    return path.extname(file) === '.styl' ? whitespace(css) : css
  }

  // Plugins

  css = whitespace(css)

  post.use(importer({ transform: transformWhitespace, root: options.root }))
  post.use(customProperties())
  post.use(customMedia())
  post.use(customSelectors())
  post.use(calc())
  post.use(autoprefixer(browserConfig).postcss)

  css = post.process(css, options).css

  return css;
}
