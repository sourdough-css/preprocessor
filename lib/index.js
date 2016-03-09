/**
 * Module dependencies
 */

var path = require('path')
var postcss = require('postcss')
var sugarss = require('sugarss')
var autoprefixer = require('autoprefixer')
var customProperties = require('postcss-custom-properties')
var customMedia = require('postcss-custom-media')
var customSelectors = require('postcss-custom-selectors')
var calc = require('postcss-calc')
var importer = require('postcss-import')
var mediaRanges = require('postcss-media-minmax')
var colorFunctions = require('postcss-color-function')
var nested = require('postcss-nested')

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

function preprocessor (css, options) {
  if (typeof css !== 'string') {
    throw new Error('sourdough-preprocessor: did not receive a String')
  }

  options = options || {}
  options.parser = sugarss

  var browserConfig = options.browsers || [
    'Explorer >= 9',
    'last 5 Chrome versions',
    'last 2 Firefox versions',
    'last 2 Safari versions',
    'last 2 iOS versions',
    'Android 4'
  ]

  var post = postcss()

  // Transform .css files to sss syntax
  function cssToSss (css, file) {
    if (path.extname(file) === '.css') {
      return postcss().process(css, { stringifier: sugarss }).then(function (result) {
        return result.css
      })
    } else {
      return css
    }
  }

  // Plugins
  post.use(importer({ transform: cssToSss, root: options.root, onImport: options.onImport }))
  post.use(customProperties())
  post.use(customMedia())
  post.use(mediaRanges())
  post.use(customSelectors())
  post.use(calc())
  post.use(colorFunctions())
  post.use(nested())
  post.use(autoprefixer(browserConfig))

  return post.process(css, options)
}
