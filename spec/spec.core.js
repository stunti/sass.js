
describe 'Sass'
  before
    render = function(path, options) {
      sass.render(fixture(path + '.sass'), options)
    }
  end
  
  describe '.version'
    it 'should be a triplet'
      sass.version.should.match(/^\d+\.\d+\.\d+$/)
    end
  end
  
  describe '.render()'
    
  end
end