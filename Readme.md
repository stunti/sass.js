
# Sass.js

  JavaScript implementation of Sass. Great for node.js and other
  frameworks supporting the CommonJS module system.
  
## Usage

With sass.js in the load path you can then use:

    var sass = require('sass')
    sass.render('... string of sass ...')
    // => '... string of css ...'
    
## Comments

    // foo
    body
      // bar
      a
        :color #fff
        
compiles to

    body a {
      color: #fff;}
      
## Variables

    !red = #ff0000
    body
      :color !red
     
compile to

    body {
      color: #ff0000;}

## Selector Continuations

    a
      :color #fff
      &:hover
        :color #000
      &.active
        :background #888
        &:hover
          :color #fff
          
compiles to

    a {
      color: #fff;}

    a:hover {
      color: #000;}

    a.active {
      background: #888;}

    a.active:hover {
      color: #fff;}
      
## Literal JavaScript

    type: "solid"
    size: 1
    input
      :border { parseInt(size) + 1 }px {type} #000
      
compiles to

    input {
      border: 2px "solid" #000;}
      
## Property Expansion

    div
      =border-radius 5px
      
compiles to

    div {
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;}
    
## Testing

Update Git submodules and execute:
    $ make test
or
    $ node spec/node.js
or
    $ jspec --node
  
## License 

(The MIT License)

Copyright (c) 2009 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.