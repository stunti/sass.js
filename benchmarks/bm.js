
exports.benchmark = function(label, times, fn) {
  var start = Number(new Date)
  for (var i = 0; i < times; ++i) fn()
  require('sys').puts(label + ' ran ' + times + ' times and took ' + (Number(new Date) - start) + ' milliseconds')
}