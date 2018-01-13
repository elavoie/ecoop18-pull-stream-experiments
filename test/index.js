var tape = require('tape')
var pull = require('pull-stream')
var reference = require('pull-stream-reference-modules')
var checker = require('pull-stream-protocol-checker')
var helpers = require('../src')
var debug = require('debug')
var log = debug('ecoop18-pull-stream-experiments')

tape('Testing pull.count()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      count: [0, 1, 2],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-index': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true, false],
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.filter(function (args) {
      return args['sink-index'] === args['sink-r']
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        pull.count.call(null, args.count),
        probe,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-index'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe.terminate()) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.values()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      values: [[], [0], [0, 1]],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-index': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true], // MISSING: sink-answer: false
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.filter(function (args) {
      return args['sink-index'] === args['sink-r']
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        pull.values.call(null, args.values),
        probe,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-index'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe.terminate()) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.empty()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-index': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true], // MISSING: sink-answer: false
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.filter(function (args) {
      return args['sink-index'] === args['sink-r']
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        pull.empty(),
        probe,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-index'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe.terminate()) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.error()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      error: [new Error('Source Error')],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-index': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true], // MISSING: sink-answer: false
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.filter(function (args) {
      return args['sink-index'] === args['sink-r']
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        pull.error(args.error),
        probe,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-index'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe.terminate()) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.infinite()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-index': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true, false],
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.filter(function (args) {
      return args['sink-index'] === args['sink-r']
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        pull.infinite(),
        probe,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-index'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe.terminate()) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.keys()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      keys: [{}, {'a': 1}, {'a': 1, 'b': 2}, [], [0], [0, 1]],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-index': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true], // MISSING: sink-answer: false
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.filter(function (args) {
      return args['sink-index'] === args['sink-r']
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        pull.keys(args.keys),
        probe,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-index'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe.terminate()) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.once()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      once: [1, 'test', new Error(''), function () {}, null, false, true],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-index': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true], // MISSING: sink-answer: false
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.filter(function (args) {
      return args['sink-index'] === args['sink-r']
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        pull.once(args.once),
        probe,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-index'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe.terminate()) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.collect()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2, 3, 4, 5, 6],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        probe,
        pull.collect(function (err, values) {
          if (args['source-done'] instanceof Error) {
            if (err !== args['source-done']) t.fail('Did not receive expected error')
          }
          cb(null, probe.terminate())
        })
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.concat()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2, 3, 4, 5, 6],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        pull.map(function (x) { return String(x) }),
        probe,
        pull.concat(function (err, string) {
          if (args['source-done'] instanceof Error) {
            if (err !== args['source-done']) t.fail('Did not receive expected error')
          }
          log(string)
          cb(null, probe.terminate())
        })
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.drain()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2, 3, 4, 5, 6],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        probe,
        pull.drain(null, function (err) {
          if (args['source-done'] instanceof Error) {
            if (err !== args['source-done']) t.fail('Did not receive expected error')
          }
          cb(null, probe.terminate())
        })
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.log()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        probe,
        pull.log(function (err) {
          if (args['source-done'] instanceof Error) {
            if (err !== args['source-done']) t.fail('Did not receive expected error')
          }
          cb(null, probe.terminate())
        })
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.onEnd()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        probe,
        pull.onEnd(function (err) {
          if (args['source-done'] instanceof Error) {
            if (err !== args['source-done']) t.fail('Did not receive expected error')
          }
          cb(null, probe.terminate())
        })
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.reduce()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        probe,
        pull.reduce(
          function (acc, x) { return acc + x },
          0,
          function (err, total) {
            if (args['source-done'] instanceof Error) {
              if (err !== args['source-done']) t.fail('Did not receive expected error')
            }
            cb(null, probe.terminate())
          }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.map()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true],
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe1 = checker(true, true, false)
      var probe2 = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        probe1,
        pull.map(function (x) { return x }),
        probe2,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-r'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe1.terminate().concat(probe2.terminate())) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.asyncMap()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false],
      'asyncMap-index': [Infinity, 1, 2],
      'asyncMap-abort': [true, new Error('asyncMap Error')],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true],
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe1 = checker(true, true, false)
      var probe2 = checker(true, true, false)
      var i = 1
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        probe1,
        pull.asyncMap(function (x, cb) {
          if (i === args['asyncMap-index']) return cb(args['asyncMap-abort'])
          else return cb(false, x)
        }),
        probe2,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-r'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe1.terminate().concat(probe2.terminate())) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.filter()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true],
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe1 = checker(true, true, false)
      var probe2 = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        probe1,
        pull.filter(function (x) { return (x % 2) === 0 }),
        probe2,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-r'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe1.terminate().concat(probe2.terminate())) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.filterNot()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true],
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe1 = checker(true, true, false)
      var probe2 = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        probe1,
        pull.filterNot(function (x) { return (x % 2) === 0 }),
        probe2,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-r'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe1.terminate().concat(probe2.terminate())) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.unique()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2, 10],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true],
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe1 = checker(true, true, false)
      var probe2 = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        pull.map(function (x) { return x % 2 }),
        probe1,
        pull.unique(),
        probe2,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-r'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe1.terminate().concat(probe2.terminate())) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.nonUnique()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2, 10],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true],
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe1 = checker(true, true, false)
      var probe2 = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        pull.map(function (x) { return x % 2 }),
        probe1,
        pull.nonUnique(),
        probe2,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-r'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe1.terminate().concat(probe2.terminate())) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.take()', function (t) {
  var numberOfTests = 0
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2, 10],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false],
      'take-test': [0, 1, 2, 10, 12, function (x) { return x % 2 !== 1 }],
      'take-last': [false, true],
      'sink-r': [1, 2, 3, 4, 5, 6],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true],
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe1 = checker(true, true, false)
      var probe2 = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        pull.map(function (x) { return x % 2 }),
        probe1,
        pull.take(args['take-test'], args['take-last'] ? {last: true} : undefined),
        probe2,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-r'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe1.terminate().concat(probe2.terminate())) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})

tape('Testing pull.flatten()', function (t) {
  var numberOfTests = 0
  var values = [[], [1], [2, 3, 4]]
  pull(
    helpers.combinations({
      'source-n': [0, 1, 2],
      'source-done': [true, new Error('Source Error')],
      'source-sync': [true, false],
      'values-permutation': [
        [0, 1, 2],
        [0, 2, 1],
        [1, 0, 2],
        [1, 2, 0],
        [2, 0, 1],
        [2, 1, 0]
      ],
      'values-as-stream': [true, false],
      'sink-r': [1, 2, 3, 4],
      'sink-abort': [true, new Error('Sink Error')],
      'sink-answer': [true],
      'sink-sync': [true, false],
      'sink-cont': [false]
    }),
    pull.through(function (args) {
      log(args)
    }),
    pull.asyncMap(function (args, cb) {
      var probe1 = checker(true, true, false)
      var probe2 = checker(true, true, false)
      pull(
        reference.source.call(null,
          args['source-n'],
          args['source-done'],
          args['source-sync']
        ),
        pull.map(function (i) {
          var ary = values[args['values-permutation'][i - 1]]
          return args['values-as-stream'] ? pull.values(ary) : ary
        }),
        probe1,
        pull.flatten(),
        probe2,
        reference.sink.call(null,
          args['sink-r'],
          args['sink-r'],
          args['sink-abort'],
          args['sink-answer'],
          args['sink-sync'],
          args['sink-cont'],
          function () { cb(null, probe1.terminate().concat(probe2.terminate())) }
        )
      )
    }),
    pull.through(function () { numberOfTests++ }),
    pull.filter(function (errors) { return errors.length > 0 }),
    pull.collect(function (err, results) {
      if (err) t.fail(err)
      else if (results.length > 0) t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
      else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})
