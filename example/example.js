var fs = require('fs')
var path = require('path')
var JPEGDecoder = require('jpg-stream/decoder')
var JPEGEncoder = require('jpg-stream/encoder')

var Crop = require('../')

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
