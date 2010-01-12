
// Sass - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Sass grammar tokens.
 */

var tokens = [
  ['indent', /^\n +/],
  ['space', /^ +/],
  ['nl', /^\n/],
  [',', /^,/],
  ['&', /^&/],
  ['js', /^{(.*?)}/],
  ['string', /^(?:'(.*?)'|"(.*?)")/],
  ['variable', /^([\w\-]+): *([^\n]+)/], 
  ['property', /^:([\w\-]+) *([^\n]+)/], 
  ['selector', /^([\w\-\.:]+)/]
]

/**
 * Tokenize the given _str_.
 *
 * @param  {string} str
 * @return {array}
 * @api private
 */

function tokenize(str) {
  var token, captures, stack = []
  while (str.length) {
    for (var i = 0, len = tokens.length; i < len; ++i)
      if (captures = tokens[i][1].exec(str)) {
        token = [tokens[i][0], captures],
        str = str.replace(tokens[i][1], '')
        break
      }
    if (token)
      stack.push(token),
      token = null
    else 
      throw "SyntaxError: near `" + str.slice(0, 25).replace('\n', '\\n') + "'"
  }
  return stack
}

/**
 * Parse the given _tokens_, returning
 * and array of top-level selectors.
 *
 * @param  {array} tokens
 * @return {array}
 * @api private
 */

function parse(tokens) {
  var token, selector,
      variables = {},
      line = 1,
      lastIndents = 0,
      indents = 0,
      selectors = []
  function error(msg) {
    throw 'ParseError: near line ' + line + '; ' + msg
  }
  while (token = tokens.shift())
    switch (token[0]) {
      case 'selector':
        selector = new Selector(token[1][1], selector)
        if (!selector.parent) 
          selectors.push(selector)
        require('sys').p('on ' + selector.string)
        while (lastIndents-- > indents)
          require('sys').p('  reset to ' + selector.parent.string),
          selector = selector.parent
        break
      case 'property':
        var val = token[1][2]
          .replace(/!([\w\-]+)/, function(orig, name){
            return variables[name] || orig
          })
          .replace(/\{(.*?)\}/g, function(_, js){
            with (variables){ return eval(js) }
          })
        require('sys').p('  adding ' + token[1][1] + ' to ' + selector.string)
        selector.properties.push(new Property(token[1][1], val))
        break
      case 'variable':
        variables[token[1][1]] = token[1][2]
        break
      case 'js':
        with (variables){ eval(token[1][1]) }
        break
      case 'nl':
        ++line, indents = 0
        break
      case 'indent':
        ++line
        lastIndents = indents,
        indents = (token[1][0].length - 1) / 2
        if (indents > lastIndents &&
            indents - 1 > lastIndents)
              error('invalid indentation, to much nesting')
    }
  return selectors
}

/**
 * Compile _selectors_ to a string of css.
 *
 * @param  {array} selectors
 * @return {string}
 * @api private
 */

function compile(selectors) {
  return selectors.join('\n')
}

/**
 * Render a string of _sass_.
 *
 * @param  {string} sass
 * @return {string}
 * @api public
 */

exports.render = function(sass) {
  return compile(parse(tokenize(sass)))
}

// --- Selector

/**
 * Initialize a selector with _string_ and
 * optional _parent_.
 *
 * @param  {string} string
 * @param  {Selector} parent
 * @api private
 */

function Selector(string, parent) {
  this.string = string
  this.parent = parent
  this.properties = []
  this.children = []
  if (parent)
    parent.children.push(this)
}

/**
 * Return selector string.
 *
 * @return {string}
 * @api private
 */

Selector.prototype.selector = function() {
  var selector = this.string
  if (this.parent)
    selector = this.parent.selector() + ' ' + selector
  return selector
}

/**
 * Return selector and nested selectors as CSS.
 *
 * @return {string}
 * @api private
 */

Selector.prototype.toString = function() {
  var str = ''
  if (this.properties.length) {
    str = this.selector() + ' {\n'
    for (var i = 0, len = this.properties.length; i < len; ++i)
      str += this.properties[i] + '\n'
    str += '}\n'
  }
  for (var i = 0, len = this.children.length; i < len; ++i)
    str += this.children[i]
  return str
}

// --- Property

/**
 * Initialize property with _name_ and _val_.
 *
 * @param  {string} name
 * @param  {string} val
 * @api private
 */

function Property(name, val) {
  this.name = name
  this.val = val
}

/**
 * Return CSS string representing a property.
 *
 * @return {string}
 * @api private
 */

Property.prototype.toString = function() {
  return '  ' + this.name + ': ' + this.val + ';'
}
