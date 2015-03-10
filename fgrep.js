var util = require('util')
var Readable = require('stream').Readable
var byline = require('byline')
var path = require('path')
var fs = require('fs')

module.exports = FGrep

util.inherits(FGrep, Readable)

function FGrep (test, files, options) {
  if (!(this instanceof FGrep))
    return new FGrep(test, files, options)

  options = options || {}
  if (!Array.isArray(files))
    files = [files]
  this.files = files
  this.index = -1
  this.limit = options.limit || 10
  this.nocase = options.nocase || false
  if (this.nocase)
    test = test.toLowerCase()
  this.test = test
  this.current = new Array(this.limit)
  this.processing = Object.create(null)

  Readable.call(this, { objectMode: true })

  for (var i = 0; i < this.limit; i ++)
    this._process()
}

FGrep.prototype._read = function () {
  for (var i in this.processing)
    this.processing[i].resume()
}

FGrep.prototype._process = function () {
  var filename = this.files[++this.index]
  if (!filename) {
    // if we're processing anything else, just return.
    // otherwise, push null for EOF
    for (var i in this.processing)
      return

    this.push(null)
    return
  }

  var fstream = fs.createReadStream(filename)
  var stream = byline(fstream)
  if (this.processing[filename]) {
    var er = new Error('file specified multiple times: ' + filename)
    return this.emit('error', er)
  }

  this.processing[filename] = stream
  var self = this
  var lineNumber = 0
  stream.on('data', function (line) {
    line += ''
    lineNumber ++

    var l = self.nocase ? line.toLowerCase() : line
    if (l.indexOf(self.test) !== -1) {
      var match = {
        filename: filename,
        lineNumber: lineNumber,
        line: line
      }

      if (!self.push(match)) {
        for (var i in self.processing)
          self.processing[i].pause()
      }
    }
  })

  fstream.on('error', function (er) {
    delete self.processing[filename]
    self.emit('error', er)
  })

  stream.on('end', function () {
    delete self.processing[filename]
    self._process()
  })
}
