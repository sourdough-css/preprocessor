# sourdough-preprocessor

[![Build Status](https://travis-ci.org/sourdough-css/preprocessor.svg?branch=master)](https://travis-ci.org/sourdough-css/preprocessor)

[Sourdough](https://github.com/sourdough-css/) preprocessor.

A preprocessor based on:
  - [postcss](https://github.com/postcss/postcss)
  - [sugarss](https://github.com/postcss/sugarss)
  - postcss-calc
  - postcss-custom-media
  - postcss-custom-properties
  - postcss-import

## Installation

Install [node.js](http://nodejs.org) (comes with npm).

```
npm install sourdough-preprocessor
```

## Usage

```
sourdough input.sss output.css
```

## API

#### Command Line

```
Usage: sourdough [<input>] [<output>]

Options:

  -h, --help                 output usage information
  -i, --import-root [path]   the root directory for imported css files
  -v, --verbose              log verbose output for debugging
  -V, --version              output the version number
  -w, --watch                watch the input file for changes

Examples:

  # pass an input and output file:
  $ sourdough input.sss output.css

  # watch the input file for changes:
  $ sourdough --watch input.sss output.css

  # unix-style piping to stdin and stdout:
  $ cat input.sss | sourdough | grep background-color
```

#### Node.js

```js
var preprocessor = require('sourdough-preprocessor');
var fs = require('fs');

var css = fs.readFileSync('src/components/index.sss', 'utf8');

var bundle = preprocessor(css, {
  from: 'src/components/index.sss',
  map: { inline: true }
});

fs.writeFileSync('build/bundle.css', bundle);
```

## Acknowledgements

Based on [SUIT CSS Preprocessor](https://github.com/suitcss/preprocessor) by Nicolas Gallagher.
Watch function based on [postcss-cli](https://github.com/postcss/postcss-cli)
