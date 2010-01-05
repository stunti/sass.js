
all: test
	
test: spec/rhino.js
	@jspec run --rhino
	