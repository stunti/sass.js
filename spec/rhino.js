
load('/Library/Ruby/Gems/1.8/gems/jspec-3.0.0/lib/jspec.js')
load('lib/sass.js')

JSpec
.exec('spec/spec.core.js')
.run({ reporter: JSpec.reporters.Terminal })
.report()