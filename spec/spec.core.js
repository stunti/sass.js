
describe 'Sass'
  before
    render = function(path, options) {
      return sass.render(fixture(path + '.sass'), options)
    }
    
    expected = function(path) {
      return fixture(path + '.css')
    }
    
    assert = function(path, options) {
      render(path, options).should.eql expected(path)
    }
  end
  
  describe '.version'
    it 'should be a triplet'
      sass.version.should.match(/^\d+\.\d+\.\d+$/)
    end
  end
  
  describe '.render()'
    it 'should support complex selectors'
      assert('selectors')
    end
    
    describe '// ...'
      it 'should be a sass-specific comment'
        assert('comment')
      end
    end
    
    describe '& ...'
      it 'should continue a selector'
        //require('sys').puts(render('continuation'))
        //assert('continuation')
      end
    end
  
    describe '{...}'
      it 'should have access to variables'
        assert('literal')
      end
    end
    
    describe ':key val'
      it 'should define a property'
        assert('properties')
      end
      
      describe 'when nested'
        it 'should traverse correctly'
          assert('properties.nested')
        end
      end
      
      describe 'when at the top level'
        it 'should throw an error'
          try { assert('properties.invalid') }
          catch (e) {
            e.message.should.eql 'ParseError: on line 1; properties must be nested within a selector'
          }
        end
      end
    end
    
    describe '=:key val'
      it 'should expand to -{moz, webkit}-border-radius'
        assert('properties.expand')
      end
    end
    
    describe '!key = val'
      it 'should define a variable'
        assert('variables.regular')
      end
    end
    
    describe 'key: val'
      it 'should define a variable'
        assert('variables')
      end
      
      describe 'when nested'
        describe 'incorrectly'
          it 'should throw an error'
            try { assert('properties.nested.invalid') }
            catch (e) {
              e.message.should.eql 'ParseError: on line 3; invalid indentation, to much nesting'
            }
          end
        end
      end
    end
    
  end
end