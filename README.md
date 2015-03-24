# sourdough-preprocessor

[Sourdough](https://github.com/sourdough-css/) preprocessor.

A preprocessor based on:
  - [css-whitespace](https://github.com/reworkcss/css-whitespace)
  - [postcss](https://github.com/postcss/postcss)
  - postcss-calc
  - postcss-custom-media
  - postcss-custom-properties
  - postcss-import

## Installation

```
npm install sourdough-preprocessor
```

## Usage

```
sourdough input.css output.css
```

## API

#### Command Line

```
Usage: sourdough [<input>] [<output>]

Options:

  -c, --compress             compress output
  -h, --help                 output usage information
  -i, --import-root [path]   the root directory for imported css files
  -v, --verbose              log verbose output for debugging
  -V, --version              output the version number
  -w, --watch                watch the input file for changes

Examples:

  # pass an input and output file:
  $ sourdough input.css output.css

  # watch the input file for changes:
  $ sourdough --watch input.css output.css

  # unix-style piping to stdin and stdout:
  $ cat input.css | sourdough | grep background-color
```

#### Node.js

```js
var preprocessor = require('sourdough-preprocessor');
var fs = require('fs');

var css = fs.readFileSync('src/components/index.css', 'utf8');

var bundle = preprocessor(css, {
  from: 'src/components/index.css',
  map: { inline: true }
});

fs.writeFileSync('build/bundle.css', bundle);
```

## Acknowledgements

Based on [SUIT CSS Preprocessor](https://github.com/suitcss/preprocessor) by Nicolas Gallagher.
