
// Sass - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Version triplet.
 */

exports.version = '0.0.1'

/**
 * Sass grammar tokens.
 */

var tokens = [
  ['indent', /^\n +/],
  ['space', /^ +/],
  ['nl', /^\n/],
  ['js', /^{(.*?)}/],
  ['comment', /^\/\/(.*)/],
  ['string', /^(?:'(.*?)'|"(.*?)")/],
  ['variable', /^([\w\-]+): *([^\n]+)/], 
  ['variable.regular', /^!([\w\-]+) *= *([^\n]+)/], 
  ['property.expand', /^=([\w\-]+) *([^\n]+)/], 
  ['property', /^:([\w\-]+) *([^\n]+)/], 
  ['continuation', /^&(.+)/],
  ['selector', /^(.+)/]
]

/**
 * Vendor-specific expansion prefixes.
 */

exports.expansions = ['-moz-', '-webkit-']

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
      throw new Error("SyntaxError: near `" + str.slice(0, 25).replace('\n', '\\n') + "'")
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
    throw new Error('ParseError: on line ' + line + '; ' + msg)
  }
  function reset() {
    if (indents === 0) 
      return selector = null
    while (lastIndents-- > indents)
      selector = selector.parent
  }
  while (token = tokens.shift())
    switch (token[0]) {
      case 'continuation':
        // TODO: implement
        break
      case 'selector':
        reset()
        selector = new Selector(token[1][1], selector)
        if (!selector.parent) 
          selectors.push(selector)
        break
      case 'property':
        reset()
        if (!selector) error('properties must be nested within a selector')
        var val = token[1][2]
          .replace(/!([\w\-]+)/, function(orig, name){
            return variables[name] || orig
          })
          .replace(/\{(.*?)\}/g, function(_, js){
            with (variables){ return eval(js) }
          })
        selector.properties.push(new Property(token[1][1], val))
        break
      case 'property.expand':
        exports.expansions.forEach(function(prefix){
          tokens.unshift(['property', [, prefix + token[1][1], token[1][2]]])
        })
        break
      case 'variable':
      case 'variable.regular':
        variables[token[1][1]] = token[1][2]
        break
      case 'js':
        with (variables){ eval(token[1][1]) }
        break
      case 'nl':
        ++line, indents = 0
        break
      case 'comment':
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
  return (this.properties.length ?
    this.selector() + ' {\n' + this.properties.join('\n') + '}\n' :
      '') + this.children.join('')
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
