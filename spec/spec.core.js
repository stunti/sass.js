
describe 'Sass'
  before
    sass = function(name) {
      return (new Sass(fixture(name + '.sass'))).render()
    }
  end
  
  describe '.version'
    it 'should be a triplet'
      Sass.version.should.match(/^\d+\.\d+\.\d+$/)
    end
  end
  
  describe '.render()'
    it 'should render a selector and property'
      sass('property').should.include 'body {\n  color: #fff;\n}'
    end
    
    it 'should throw an error when a property has no parent selector'
      -{ sass('property.invalid') }.should.throw_error 'property :color is not nested within a selector'
    end
    
    it 'should render a selector and properties'
      sass('properties').should.include 'body {\n  background: black;\n  font-size: 13px;\n  color: #fff;\n}'
    end
  end
end