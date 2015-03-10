var test = require('tap').test
var fgrep = require('../fgrep.js')
var glob = require('glob')
process.chdir(__dirname)
var corpus = glob.sync('fixtures/*.html')


test('limit=2 nocase=true', function (t) {
  var expect = require('./tempest-nocase.json')
  var actual = {}
  fgrep('tempest', corpus, { limit: 2, nocase: true })
    .on('data', function (match) {
      actual[match.filename] = actual[match.filename] || []
      actual[match.filename].push(match)
    })
    .on('end', function () {
      t.same(actual, expect)
      t.end()
    })
})

test('limit=2', function (t) {
  var expect = require('./tempest.json')
  var actual = {}
  fgrep('tempest', corpus, { limit: 2 })
    .on('data', function (match) {
      actual[match.filename] = actual[match.filename] || []
      actual[match.filename].push(match)
    })
    .on('end', function () {
      t.same(actual, expect)
      t.end()
    })
})

test('limit=1', function (t) {
  var expect = require('./tempest.json')
  var actual = {}
  fgrep('tempest', corpus, { limit: 1 })
    .on('data', function (match) {
      actual[match.filename] = actual[match.filename] || []
      actual[match.filename].push(match)
    })
    .on('end', function () {
      t.same(actual, expect)
      t.end()
    })
})

test('limit=20 nocase=true', function (t) {
  var expect = require('./tempest-nocase.json')
  var actual = {}
  fgrep('tempest', corpus, { limit: 20, nocase: true })
    .on('data', function (match) {
      actual[match.filename] = actual[match.filename] || []
      actual[match.filename].push(match)
    })
    .on('end', function () {
      t.same(actual, expect)
      t.end()
    })
})

test('limit=20', function (t) {
  var expect = require('./tempest.json')
  var actual = {}
  fgrep('tempest', corpus, { limit: 20 })
    .on('data', function (match) {
      actual[match.filename] = actual[match.filename] || []
      actual[match.filename].push(match)
    })
    .on('end', function () {
      t.same(actual, expect)
      t.end()
    })
})
