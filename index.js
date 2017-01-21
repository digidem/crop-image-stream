var through2 = require('through2')
var block = require('block-stream2')
var pumpify = require('pumpify')

// color space component counts
var COMPONENTS = {
  'rgb': 3,
  'rgba': 4,
  'cmyk': 4,
  'gray': 1,
  'graya': 2,
  'indexed': 1
}

module.exports = Crop

function Crop (opts) {
  opts = opts || {}
  var x = opts.x || 0
  var y = opts.y || 0
  var width = opts.width
  var height = opts.height
  var index = 0
  var pixelBytes
  var destroyed
  var stream = pumpify()

  stream.once('pipe', function (src) {
    src.once('format', onFormat)
  })

  return stream

  function onFormat (format) {
    if (!format) {
      onError(new Error('No format specified on input stream'))
    }
    if (!format.width) {
      onError(new Error('No width specified on input stream'))
    }
    if (!format.height) {
      onError(new Error('No height specified on input stream'))
    }
    if (!format.colorSpace || !COMPONENTS[format.colorSpace]) {
      onError(new Error('Invalid colorSpace on input stream'))
    }
    if (x >= format.width || y >= format.height) {
      onError(new Error('Crop area is outside of image'))
    }
    width = Math.min(format.width - x, width)
    height = Math.min(format.height - y, height)
    stream.format = {width: width, height: height, colorSpace: format.colorSpace}
    stream.emit('format', Object.assign({}, stream.format))
    pixelBytes = COMPONENTS[format.colorSpace]
    stream.setPipeline(block(format.width * pixelBytes), through2(write))
  }

  function onError (err) {
    if (destroyed) return
    destroyed = true
    stream.destroy(err)
  }

  function write (chunk, enc, next) {
    if (index < y || index > y + height) {
      index++
      return next()
    }
    index++
    var row = chunk.slice(x * pixelBytes, (x + width) * pixelBytes)
    next(null, row)
  }
}
