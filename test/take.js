var tape = require('tape')
var pull = require('pull-stream')
var reference = require('pull-stream-reference-modules')
var checker = require('pull-stream-protocol-checker')
var reifier = require('pull-stream-protocol-reifier')
var debug = require('debug')
var log = debug('ecoop18-pull-stream-experiments')

tape('pull.take() bug', function (t) {
  var numberOfTests = 0
  var reifier1 = reifier(Infinity, 'SRC', 'TI')
  var reifier2 = reifier(Infinity, 'TO', 'SINK')
  pull(
    pull.once({ 'source-n': 1,
      'source-done': true,
      'source-sync': false,
      'take-test': 1,
      'take-last': false,
      'sink-r': 3,
      'sink-abort': true,
      'sink-answer': true,
      'sink-sync': false,
      'sink-cont': false
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
        reifier1,
        probe1,
        pull.take(args['take-test'], args['take-last'] ? {last: true} : undefined),
        reifier2,
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
      else if (results.length > 0) {
        t.fail('Protocol violations for ' + (results.length) + '/' + numberOfTests + ' tests')
        results.forEach(function (es) {
          es.forEach(function (e) {
            console.error(e.message)
          })
        })
        pull(reifier1.events, pull.log())
        pull(reifier2.events, pull.log())
      } else {
        t.equal(results.length, 0)
        log('All ' + numberOfTests + ' tests successful')
      }
      t.end()
    })
  )
})
