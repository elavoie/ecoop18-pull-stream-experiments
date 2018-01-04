function combinations (dict) {
  function checkArgs () {
    for (var i = 0; i < values.length; ++i) {
      if (!(values[i] instanceof Array)) {
        throw new Error("Invalid values in dict at key '" + keys[i] + "': should be an array")
      }
    }
  }

  function next () {
    for (var i = 0; i < indexes.length; ++i) {
      if (i !== indexes.length - 1 && indexes[i] + 1 >= values[i].length) {
        indexes[i] = 0
      } else {
        indexes[i]++
        break
      }
    }
  }

  function done () {
    var mostSignificant = indexes.length - 1
    return indexes[mostSignificant] >= values[mostSignificant].length
  }

  function current () {
    var combination = {}
    for (var i = 0; i < indexes.length; ++i) {
      combination[keys[i]] = values[i][indexes[i]]
    }
    return combination
  }

  var keys = Object.keys(dict)
  var values = Object.values(dict)
  var indexes = values.slice().map(function (x) { return 0 })

  checkArgs(values)

  return function output (abort, x) {
    if (abort && x) return x(true)
    else if (!done()) {
      var c = current()
      next()
      return x(false, c)
    } else if (x) return x(true)
  }
}

module.exports = {
  combinations: combinations
}
