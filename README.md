# crop-image-stream

[![npm](https://img.shields.io/npm/v/crop-image-stream.svg)](https://www.npmjs.com/package/crop-image-stream)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?maxAge=2592000)](http://standardjs.com/)

> Crop an image stream

Crops a raw image stream, returns a cropped raw image stream, compatible with [`pixel-stream`](https://github.com/devongovett/pixel-stream). Everything is streams, so you can crop giant images without a memory overhead, only one line of the input image is held in memory at a time.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Install

```
npm i --save crop-image-stream
```

## Usage

See [examples](./example).

```js
var fs = require('fs')
var path = require('path')
var JPEGDecoder = require('jpg-stream/decoder')
var JPEGEncoder = require('jpg-stream/encoder')

var Crop = require('crop-image-stream')

var inputFilename = path.join(__dirname, 'dramatic_chipmunk.jpg')
var outputFilename = path.join(__dirname, 'dramatic_chipmunk_crop.jpg')

var cropOpts = {
  x: 575,
  y: 20,
  width: 275,
  height: 200
}

fs.createReadStream(inputFilename)
  .pipe(new JPEGDecoder())
  .pipe(Crop(cropOpts))
  .pipe(new JPEGEncoder())
  .pipe(fs.createWriteStream(outputFilename))
```

## API

```js
var Crop = require('crop-image-stream')
```

### Crop(opts)

Where:

- `opts.x` - X coordinate of left side of crop area, measured from the left of the original image. Default `0`
- `opts.y` - Y coordinate of top of crop area, measured from the top of the original image. Default `0`
- `opts.width` - Width of crop area. Default input image width. If `opts.x + opts.width > inputImageWidth`, the crop area width will be `inputImageWidth - opts.x`
- `opts.height` - Height of crop area. Default input image height. If `opts.y + opts.height > inputImageHeight`, the crop area height will be `inputImageHeight - opts.y`

You must pipe a stream of raw image data that emits a `format` event with `format = {height: inputImageHeight, width: inputImageWidth, colorSpace: inputImageColorSpace`. Returns a stream of raw image data which will also emit a `format` event. Compatible with [`pixel-stream`](https://github.com/devongovett/pixel-stream) but does not support frames (animated images).

## Contribute

PRs accepted.

Small note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © Digital Democracy
