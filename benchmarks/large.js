
require.paths.unshift('lib', 'benchmarks')
bm = require('bm')
sass = require('sass')

readFile = function(path) {
  var result
  require('posix')
    .cat(path, "utf8")
    .addCallback(function(contents){ result = contents })
    .addErrback(function(){ throw new Error("failed to read file `" + path + "'") })
    .wait()
  return result
}

contents = readFile('benchmarks/large.sass')

bm.benchmark('large', 1000, function(){
  sass.render(contents)  
})