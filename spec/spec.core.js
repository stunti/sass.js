
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
    describe ':key val'
      it 'should define a property'
        assert('properties')
      end
      
      describe 'when nested'
        it 'should traverse correctly'
          assert('properties.nested')
        end
      end
    end
    
    describe 'key: val'
      it 'should define a variable'
        assert('variables')
      end
    end
  end
end