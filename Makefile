
all: test
	
test: spec/spec.rhino.js
	@jspec run --rhino
	