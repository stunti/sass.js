
process.mixin(require('sys'))
require.paths.unshift('spec', './spec/lib/lib', 'lib')
require('jspec')
sass = require('sass')

quit = process.exit
print = puts

readFile = function(path) {
  var result
  require('posix')
    .cat(path, "utf8")
    .addCallback(function(contents){ result = contents })
    .addErrback(function(){ throw new Error("failed to read file `" + path + "'") })
    .wait()
  return result
}

JSpec
  .exec('spec/spec.core.js')
  .run({ reporter: JSpec.reporters.Terminal, fixturePath: 'spec/fixtures', failuresOnly: true })
  .report()
