(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    window.ReactQRCode = require("react-qr-code");
    },{"react-qr-code":23}],2:[function(require,module,exports){
    /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */
    
    'use strict';
    /* eslint-disable no-unused-vars */
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    
    function toObject(val) {
        if (val === null || val === undefined) {
            throw new TypeError('Object.assign cannot be called with null or undefined');
        }
    
        return Object(val);
    }
    
    function shouldUseNative() {
        try {
            if (!Object.assign) {
                return false;
            }
    
            // Detect buggy property enumeration order in older V8 versions.
    
            // https://bugs.chromium.org/p/v8/issues/detail?id=4118
            var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
            test1[5] = 'de';
            if (Object.getOwnPropertyNames(test1)[0] === '5') {
                return false;
            }
    
            // https://bugs.chromium.org/p/v8/issues/detail?id=3056
            var test2 = {};
            for (var i = 0; i < 10; i++) {
                test2['_' + String.fromCharCode(i)] = i;
            }
            var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
                return test2[n];
            });
            if (order2.join('') !== '0123456789') {
                return false;
            }
    
            // https://bugs.chromium.org/p/v8/issues/detail?id=3056
            var test3 = {};
            'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
                test3[letter] = letter;
            });
            if (Object.keys(Object.assign({}, test3)).join('') !==
                    'abcdefghijklmnopqrst') {
                return false;
            }
    
            return true;
        } catch (err) {
            // We don't expect any of the above to throw, but better to be safe.
            return false;
        }
    }
    
    module.exports = shouldUseNative() ? Object.assign : function (target, source) {
        var from;
        var to = toObject(target);
        var symbols;
    
        for (var s = 1; s < arguments.length; s++) {
            from = Object(arguments[s]);
    
            for (var key in from) {
                if (hasOwnProperty.call(from, key)) {
                    to[key] = from[key];
                }
            }
    
            if (getOwnPropertySymbols) {
                symbols = getOwnPropertySymbols(from);
                for (var i = 0; i < symbols.length; i++) {
                    if (propIsEnumerable.call(from, symbols[i])) {
                        to[symbols[i]] = from[symbols[i]];
                    }
                }
            }
        }
    
        return to;
    };
    
    },{}],3:[function(require,module,exports){
    // shim for using process in browser
    var process = module.exports = {};
    
    // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.
    
    var cachedSetTimeout;
    var cachedClearTimeout;
    
    function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout () {
        throw new Error('clearTimeout has not been defined');
    }
    (function () {
        try {
            if (typeof setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
            } else {
                cachedSetTimeout = defaultSetTimout;
            }
        } catch (e) {
            cachedSetTimeout = defaultSetTimout;
        }
        try {
            if (typeof clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
            } else {
                cachedClearTimeout = defaultClearTimeout;
            }
        } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
        }
    } ())
    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
        } catch(e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
            } catch(e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
            }
        }
    
    
    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
        } catch (e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
            } catch (e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
            }
        }
    
    
    
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    
    function cleanUpNextTick() {
        if (!draining || !currentQueue) {
            return;
        }
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }
    
    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
    
        var len = queue.length;
        while(len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }
    
    process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
        }
    };
    
    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    process.title = 'browser';
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues
    process.versions = {};
    
    function noop() {}
    
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;
    
    process.listeners = function (name) { return [] }
    
    process.binding = function (name) {
        throw new Error('process.binding is not supported');
    };
    
    process.cwd = function () { return '/' };
    process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
    };
    process.umask = function() { return 0; };
    
    },{}],4:[function(require,module,exports){
    (function (process){(function (){
    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';
    
    var printWarning = function() {};
    
    if (process.env.NODE_ENV !== 'production') {
      var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
      var loggedTypeFailures = {};
      var has = require('./lib/has');
    
      printWarning = function(text) {
        var message = 'Warning: ' + text;
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) { /**/ }
      };
    }
    
    /**
     * Assert that the values match with the type specs.
     * Error messages are memorized and will only be shown once.
     *
     * @param {object} typeSpecs Map of name to a ReactPropType
     * @param {object} values Runtime values that need to be type-checked
     * @param {string} location e.g. "prop", "context", "child context"
     * @param {string} componentName Name of the component for error messages.
     * @param {?Function} getStack Returns the component stack.
     * @private
     */
    function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
      if (process.env.NODE_ENV !== 'production') {
        for (var typeSpecName in typeSpecs) {
          if (has(typeSpecs, typeSpecName)) {
            var error;
            // Prop type validation may throw. In case they do, we don't want to
            // fail the render phase where it didn't fail before. So we log it.
            // After these have been cleaned up, we'll let them throw.
            try {
              // This is intentionally an invariant that gets caught. It's the same
              // behavior as without this statement except with a better message.
              if (typeof typeSpecs[typeSpecName] !== 'function') {
                var err = Error(
                  (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                  'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' +
                  'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.'
                );
                err.name = 'Invariant Violation';
                throw err;
              }
              error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
            } catch (ex) {
              error = ex;
            }
            if (error && !(error instanceof Error)) {
              printWarning(
                (componentName || 'React class') + ': type specification of ' +
                location + ' `' + typeSpecName + '` is invalid; the type checker ' +
                'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
                'You may have forgotten to pass an argument to the type checker ' +
                'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
                'shape all require an argument).'
              );
            }
            if (error instanceof Error && !(error.message in loggedTypeFailures)) {
              // Only monitor this failure once because there tends to be a lot of the
              // same error.
              loggedTypeFailures[error.message] = true;
    
              var stack = getStack ? getStack() : '';
    
              printWarning(
                'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
              );
            }
          }
        }
      }
    }
    
    /**
     * Resets warning cache when testing.
     *
     * @private
     */
    checkPropTypes.resetWarningCache = function() {
      if (process.env.NODE_ENV !== 'production') {
        loggedTypeFailures = {};
      }
    }
    
    module.exports = checkPropTypes;
    
    }).call(this)}).call(this,require('_process'))
    },{"./lib/ReactPropTypesSecret":8,"./lib/has":9,"_process":3}],5:[function(require,module,exports){
    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';
    
    var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
    
    function emptyFunction() {}
    function emptyFunctionWithReset() {}
    emptyFunctionWithReset.resetWarningCache = emptyFunction;
    
    module.exports = function() {
      function shim(props, propName, componentName, location, propFullName, secret) {
        if (secret === ReactPropTypesSecret) {
          // It is still safe when called from React.
          return;
        }
        var err = new Error(
          'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
          'Use PropTypes.checkPropTypes() to call them. ' +
          'Read more at http://fb.me/use-check-prop-types'
        );
        err.name = 'Invariant Violation';
        throw err;
      };
      shim.isRequired = shim;
      function getShim() {
        return shim;
      };
      // Important!
      // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
      var ReactPropTypes = {
        array: shim,
        bigint: shim,
        bool: shim,
        func: shim,
        number: shim,
        object: shim,
        string: shim,
        symbol: shim,
    
        any: shim,
        arrayOf: getShim,
        element: shim,
        elementType: shim,
        instanceOf: getShim,
        node: shim,
        objectOf: getShim,
        oneOf: getShim,
        oneOfType: getShim,
        shape: getShim,
        exact: getShim,
    
        checkPropTypes: emptyFunctionWithReset,
        resetWarningCache: emptyFunction
      };
    
      ReactPropTypes.PropTypes = ReactPropTypes;
    
      return ReactPropTypes;
    };
    
    },{"./lib/ReactPropTypesSecret":8}],6:[function(require,module,exports){
    (function (process){(function (){
    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';
    
    var ReactIs = require('react-is');
    var assign = require('object-assign');
    
    var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
    var has = require('./lib/has');
    var checkPropTypes = require('./checkPropTypes');
    
    var printWarning = function() {};
    
    if (process.env.NODE_ENV !== 'production') {
      printWarning = function(text) {
        var message = 'Warning: ' + text;
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };
    }
    
    function emptyFunctionThatReturnsNull() {
      return null;
    }
    
    module.exports = function(isValidElement, throwOnDirectAccess) {
      /* global Symbol */
      var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.
    
      /**
       * Returns the iterator method function contained on the iterable object.
       *
       * Be sure to invoke the function with the iterable as context:
       *
       *     var iteratorFn = getIteratorFn(myIterable);
       *     if (iteratorFn) {
       *       var iterator = iteratorFn.call(myIterable);
       *       ...
       *     }
       *
       * @param {?object} maybeIterable
       * @return {?function}
       */
      function getIteratorFn(maybeIterable) {
        var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === 'function') {
          return iteratorFn;
        }
      }
    
      /**
       * Collection of methods that allow declaration and validation of props that are
       * supplied to React components. Example usage:
       *
       *   var Props = require('ReactPropTypes');
       *   var MyArticle = React.createClass({
       *     propTypes: {
       *       // An optional string prop named "description".
       *       description: Props.string,
       *
       *       // A required enum prop named "category".
       *       category: Props.oneOf(['News','Photos']).isRequired,
       *
       *       // A prop named "dialog" that requires an instance of Dialog.
       *       dialog: Props.instanceOf(Dialog).isRequired
       *     },
       *     render: function() { ... }
       *   });
       *
       * A more formal specification of how these methods are used:
       *
       *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
       *   decl := ReactPropTypes.{type}(.isRequired)?
       *
       * Each and every declaration produces a function with the same signature. This
       * allows the creation of custom validation functions. For example:
       *
       *  var MyLink = React.createClass({
       *    propTypes: {
       *      // An optional string or URI prop named "href".
       *      href: function(props, propName, componentName) {
       *        var propValue = props[propName];
       *        if (propValue != null && typeof propValue !== 'string' &&
       *            !(propValue instanceof URI)) {
       *          return new Error(
       *            'Expected a string or an URI for ' + propName + ' in ' +
       *            componentName
       *          );
       *        }
       *      }
       *    },
       *    render: function() {...}
       *  });
       *
       * @internal
       */
    
      var ANONYMOUS = '<<anonymous>>';
    
      // Important!
      // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
      var ReactPropTypes = {
        array: createPrimitiveTypeChecker('array'),
        bigint: createPrimitiveTypeChecker('bigint'),
        bool: createPrimitiveTypeChecker('boolean'),
        func: createPrimitiveTypeChecker('function'),
        number: createPrimitiveTypeChecker('number'),
        object: createPrimitiveTypeChecker('object'),
        string: createPrimitiveTypeChecker('string'),
        symbol: createPrimitiveTypeChecker('symbol'),
    
        any: createAnyTypeChecker(),
        arrayOf: createArrayOfTypeChecker,
        element: createElementTypeChecker(),
        elementType: createElementTypeTypeChecker(),
        instanceOf: createInstanceTypeChecker,
        node: createNodeChecker(),
        objectOf: createObjectOfTypeChecker,
        oneOf: createEnumTypeChecker,
        oneOfType: createUnionTypeChecker,
        shape: createShapeTypeChecker,
        exact: createStrictShapeTypeChecker,
      };
    
      /**
       * inlined Object.is polyfill to avoid requiring consumers ship their own
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
       */
      /*eslint-disable no-self-compare*/
      function is(x, y) {
        // SameValue algorithm
        if (x === y) {
          // Steps 1-5, 7-10
          // Steps 6.b-6.e: +0 != -0
          return x !== 0 || 1 / x === 1 / y;
        } else {
          // Step 6.a: NaN == NaN
          return x !== x && y !== y;
        }
      }
      /*eslint-enable no-self-compare*/
    
      /**
       * We use an Error-like object for backward compatibility as people may call
       * PropTypes directly and inspect their output. However, we don't use real
       * Errors anymore. We don't inspect their stack anyway, and creating them
       * is prohibitively expensive if they are created too often, such as what
       * happens in oneOfType() for any type before the one that matched.
       */
      function PropTypeError(message, data) {
        this.message = message;
        this.data = data && typeof data === 'object' ? data: {};
        this.stack = '';
      }
      // Make `instanceof Error` still work for returned errors.
      PropTypeError.prototype = Error.prototype;
    
      function createChainableTypeChecker(validate) {
        if (process.env.NODE_ENV !== 'production') {
          var manualPropTypeCallCache = {};
          var manualPropTypeWarningCount = 0;
        }
        function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
          componentName = componentName || ANONYMOUS;
          propFullName = propFullName || propName;
    
          if (secret !== ReactPropTypesSecret) {
            if (throwOnDirectAccess) {
              // New behavior only for users of `prop-types` package
              var err = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
                'Use `PropTypes.checkPropTypes()` to call them. ' +
                'Read more at http://fb.me/use-check-prop-types'
              );
              err.name = 'Invariant Violation';
              throw err;
            } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
              // Old behavior for people using React.PropTypes
              var cacheKey = componentName + ':' + propName;
              if (
                !manualPropTypeCallCache[cacheKey] &&
                // Avoid spamming the console because they are often not actionable except for lib authors
                manualPropTypeWarningCount < 3
              ) {
                printWarning(
                  'You are manually calling a React.PropTypes validation ' +
                  'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' +
                  'and will throw in the standalone `prop-types` package. ' +
                  'You may be seeing this warning due to a third-party PropTypes ' +
                  'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
                );
                manualPropTypeCallCache[cacheKey] = true;
                manualPropTypeWarningCount++;
              }
            }
          }
          if (props[propName] == null) {
            if (isRequired) {
              if (props[propName] === null) {
                return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
              }
              return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
            }
            return null;
          } else {
            return validate(props, propName, componentName, location, propFullName);
          }
        }
    
        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);
    
        return chainedCheckType;
      }
    
      function createPrimitiveTypeChecker(expectedType) {
        function validate(props, propName, componentName, location, propFullName, secret) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== expectedType) {
            // `propValue` being instance of, say, date/regexp, pass the 'object'
            // check, but we can offer a more precise error message here rather than
            // 'of type `object`'.
            var preciseType = getPreciseType(propValue);
    
            return new PropTypeError(
              'Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'),
              {expectedType: expectedType}
            );
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createAnyTypeChecker() {
        return createChainableTypeChecker(emptyFunctionThatReturnsNull);
      }
    
      function createArrayOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
          }
          var propValue = props[propName];
          if (!Array.isArray(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
          }
          for (var i = 0; i < propValue.length; i++) {
            var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createElementTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!isValidElement(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createElementTypeTypeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          if (!ReactIs.isValidElementType(propValue)) {
            var propType = getPropType(propValue);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createInstanceTypeChecker(expectedClass) {
        function validate(props, propName, componentName, location, propFullName) {
          if (!(props[propName] instanceof expectedClass)) {
            var expectedClassName = expectedClass.name || ANONYMOUS;
            var actualClassName = getClassName(props[propName]);
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createEnumTypeChecker(expectedValues) {
        if (!Array.isArray(expectedValues)) {
          if (process.env.NODE_ENV !== 'production') {
            if (arguments.length > 1) {
              printWarning(
                'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
                'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
              );
            } else {
              printWarning('Invalid argument supplied to oneOf, expected an array.');
            }
          }
          return emptyFunctionThatReturnsNull;
        }
    
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          for (var i = 0; i < expectedValues.length; i++) {
            if (is(propValue, expectedValues[i])) {
              return null;
            }
          }
    
          var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
            var type = getPreciseType(value);
            if (type === 'symbol') {
              return String(value);
            }
            return value;
          });
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
        }
        return createChainableTypeChecker(validate);
      }
    
      function createObjectOfTypeChecker(typeChecker) {
        function validate(props, propName, componentName, location, propFullName) {
          if (typeof typeChecker !== 'function') {
            return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
          }
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
          }
          for (var key in propValue) {
            if (has(propValue, key)) {
              var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
              if (error instanceof Error) {
                return error;
              }
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createUnionTypeChecker(arrayOfTypeCheckers) {
        if (!Array.isArray(arrayOfTypeCheckers)) {
          process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
          return emptyFunctionThatReturnsNull;
        }
    
        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          if (typeof checker !== 'function') {
            printWarning(
              'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
              'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
            );
            return emptyFunctionThatReturnsNull;
          }
        }
    
        function validate(props, propName, componentName, location, propFullName) {
          var expectedTypes = [];
          for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
            var checker = arrayOfTypeCheckers[i];
            var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
            if (checkerResult == null) {
              return null;
            }
            if (checkerResult.data && has(checkerResult.data, 'expectedType')) {
              expectedTypes.push(checkerResult.data.expectedType);
            }
          }
          var expectedTypesMessage = (expectedTypes.length > 0) ? ', expected one of type [' + expectedTypes.join(', ') + ']': '';
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`' + expectedTypesMessage + '.'));
        }
        return createChainableTypeChecker(validate);
      }
    
      function createNodeChecker() {
        function validate(props, propName, componentName, location, propFullName) {
          if (!isNode(props[propName])) {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function invalidValidatorError(componentName, location, propFullName, key, type) {
        return new PropTypeError(
          (componentName || 'React class') + ': ' + location + ' type `' + propFullName + '.' + key + '` is invalid; ' +
          'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
        );
      }
    
      function createShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
          }
          for (var key in shapeTypes) {
            var checker = shapeTypes[key];
            if (typeof checker !== 'function') {
              return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
            }
            var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
        return createChainableTypeChecker(validate);
      }
    
      function createStrictShapeTypeChecker(shapeTypes) {
        function validate(props, propName, componentName, location, propFullName) {
          var propValue = props[propName];
          var propType = getPropType(propValue);
          if (propType !== 'object') {
            return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
          }
          // We need to check all keys in case some are required but missing from props.
          var allKeys = assign({}, props[propName], shapeTypes);
          for (var key in allKeys) {
            var checker = shapeTypes[key];
            if (has(shapeTypes, key) && typeof checker !== 'function') {
              return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
            }
            if (!checker) {
              return new PropTypeError(
                'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
                '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
                '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  ')
              );
            }
            var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
            if (error) {
              return error;
            }
          }
          return null;
        }
    
        return createChainableTypeChecker(validate);
      }
    
      function isNode(propValue) {
        switch (typeof propValue) {
          case 'number':
          case 'string':
          case 'undefined':
            return true;
          case 'boolean':
            return !propValue;
          case 'object':
            if (Array.isArray(propValue)) {
              return propValue.every(isNode);
            }
            if (propValue === null || isValidElement(propValue)) {
              return true;
            }
    
            var iteratorFn = getIteratorFn(propValue);
            if (iteratorFn) {
              var iterator = iteratorFn.call(propValue);
              var step;
              if (iteratorFn !== propValue.entries) {
                while (!(step = iterator.next()).done) {
                  if (!isNode(step.value)) {
                    return false;
                  }
                }
              } else {
                // Iterator will provide entry [k,v] tuples rather than values.
                while (!(step = iterator.next()).done) {
                  var entry = step.value;
                  if (entry) {
                    if (!isNode(entry[1])) {
                      return false;
                    }
                  }
                }
              }
            } else {
              return false;
            }
    
            return true;
          default:
            return false;
        }
      }
    
      function isSymbol(propType, propValue) {
        // Native Symbol.
        if (propType === 'symbol') {
          return true;
        }
    
        // falsy value can't be a Symbol
        if (!propValue) {
          return false;
        }
    
        // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
        if (propValue['@@toStringTag'] === 'Symbol') {
          return true;
        }
    
        // Fallback for non-spec compliant Symbols which are polyfilled.
        if (typeof Symbol === 'function' && propValue instanceof Symbol) {
          return true;
        }
    
        return false;
      }
    
      // Equivalent of `typeof` but with special handling for array and regexp.
      function getPropType(propValue) {
        var propType = typeof propValue;
        if (Array.isArray(propValue)) {
          return 'array';
        }
        if (propValue instanceof RegExp) {
          // Old webkits (at least until Android 4.0) return 'function' rather than
          // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
          // passes PropTypes.object.
          return 'object';
        }
        if (isSymbol(propType, propValue)) {
          return 'symbol';
        }
        return propType;
      }
    
      // This handles more types than `getPropType`. Only used for error messages.
      // See `createPrimitiveTypeChecker`.
      function getPreciseType(propValue) {
        if (typeof propValue === 'undefined' || propValue === null) {
          return '' + propValue;
        }
        var propType = getPropType(propValue);
        if (propType === 'object') {
          if (propValue instanceof Date) {
            return 'date';
          } else if (propValue instanceof RegExp) {
            return 'regexp';
          }
        }
        return propType;
      }
    
      // Returns a string that is postfixed to a warning about an invalid type.
      // For example, "undefined" or "of type array"
      function getPostfixForTypeWarning(value) {
        var type = getPreciseType(value);
        switch (type) {
          case 'array':
          case 'object':
            return 'an ' + type;
          case 'boolean':
          case 'date':
          case 'regexp':
            return 'a ' + type;
          default:
            return type;
        }
      }
    
      // Returns class name of the object, if any.
      function getClassName(propValue) {
        if (!propValue.constructor || !propValue.constructor.name) {
          return ANONYMOUS;
        }
        return propValue.constructor.name;
      }
    
      ReactPropTypes.checkPropTypes = checkPropTypes;
      ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
      ReactPropTypes.PropTypes = ReactPropTypes;
    
      return ReactPropTypes;
    };
    
    }).call(this)}).call(this,require('_process'))
    },{"./checkPropTypes":4,"./lib/ReactPropTypesSecret":8,"./lib/has":9,"_process":3,"object-assign":2,"react-is":21}],7:[function(require,module,exports){
    (function (process){(function (){
    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    if (process.env.NODE_ENV !== 'production') {
      var ReactIs = require('react-is');
    
      // By explicitly using `prop-types` you are opting into new development behavior.
      // http://fb.me/prop-types-in-prod
      var throwOnDirectAccess = true;
      module.exports = require('./factoryWithTypeCheckers')(ReactIs.isElement, throwOnDirectAccess);
    } else {
      // By explicitly using `prop-types` you are opting into new production behavior.
      // http://fb.me/prop-types-in-prod
      module.exports = require('./factoryWithThrowingShims')();
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"./factoryWithThrowingShims":5,"./factoryWithTypeCheckers":6,"_process":3,"react-is":21}],8:[function(require,module,exports){
    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';
    
    var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
    
    module.exports = ReactPropTypesSecret;
    
    },{}],9:[function(require,module,exports){
    module.exports = Function.call.bind(Object.prototype.hasOwnProperty);
    
    },{}],10:[function(require,module,exports){
    var mode = require('./mode');
    
    function QR8bitByte(data) {
        this.mode = mode.MODE_8BIT_BYTE;
        this.data = data;
    }
    
    QR8bitByte.prototype = {
    
        getLength : function(buffer) {
            return this.data.length;
        },
        
        write : function(buffer) {
            for (var i = 0; i < this.data.length; i++) {
                // not JIS ...
                buffer.put(this.data.charCodeAt(i), 8);
            }
        }
    };
    
    module.exports = QR8bitByte;
    
    
    },{"./mode":17}],11:[function(require,module,exports){
    function QRBitBuffer() {
        this.buffer = new Array();
        this.length = 0;
    }
    
    QRBitBuffer.prototype = {
    
        get : function(index) {
            var bufIndex = Math.floor(index / 8);
            return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
        },
        
        put : function(num, length) {
            for (var i = 0; i < length; i++) {
                this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
            }
        },
        
        getLengthInBits : function() {
            return this.length;
        },
        
        putBit : function(bit) {
        
            var bufIndex = Math.floor(this.length / 8);
            if (this.buffer.length <= bufIndex) {
                this.buffer.push(0);
            }
        
            if (bit) {
                this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
            }
        
            this.length++;
        }
    };
    
    module.exports = QRBitBuffer;
    
    },{}],12:[function(require,module,exports){
    module.exports = {
        L : 1,
        M : 0,
        Q : 3,
        H : 2
    };
    
    
    },{}],13:[function(require,module,exports){
    var math = require('./math');
    
    function QRPolynomial(num, shift) {
    
        if (num.length == undefined) {
            throw new Error(num.length + "/" + shift);
        }
    
        var offset = 0;
    
        while (offset < num.length && num[offset] == 0) {
            offset++;
        }
    
        this.num = new Array(num.length - offset + shift);
        for (var i = 0; i < num.length - offset; i++) {
            this.num[i] = num[i + offset];
        }
    }
    
    QRPolynomial.prototype = {
    
        get : function(index) {
            return this.num[index];
        },
        
        getLength : function() {
            return this.num.length;
        },
        
        multiply : function(e) {
        
            var num = new Array(this.getLength() + e.getLength() - 1);
        
            for (var i = 0; i < this.getLength(); i++) {
                for (var j = 0; j < e.getLength(); j++) {
                    num[i + j] ^= math.gexp(math.glog(this.get(i) ) + math.glog(e.get(j) ) );
                }
            }
        
            return new QRPolynomial(num, 0);
        },
        
        mod : function(e) {
        
            if (this.getLength() - e.getLength() < 0) {
                return this;
            }
        
            var ratio = math.glog(this.get(0) ) - math.glog(e.get(0) );
        
            var num = new Array(this.getLength() );
            
            for (var i = 0; i < this.getLength(); i++) {
                num[i] = this.get(i);
            }
            
            for (var i = 0; i < e.getLength(); i++) {
                num[i] ^= math.gexp(math.glog(e.get(i) ) + ratio);
            }
        
            // recursive call
            return new QRPolynomial(num, 0).mod(e);
        }
    };
    
    module.exports = QRPolynomial;
    
    },{"./math":16}],14:[function(require,module,exports){
    var BitByte = require('./8BitByte');
    var RSBlock = require('./RSBlock');
    var BitBuffer = require('./BitBuffer');
    var util = require('./util');
    var Polynomial = require('./Polynomial');
    
    function QRCode(typeNumber, errorCorrectLevel) {
        this.typeNumber = typeNumber;
        this.errorCorrectLevel = errorCorrectLevel;
        this.modules = null;
        this.moduleCount = 0;
        this.dataCache = null;
        this.dataList = [];
    }
    
    // for client side minification
    var proto = QRCode.prototype;
    
    proto.addData = function(data) {
        var newData = new BitByte(data);
        this.dataList.push(newData);
        this.dataCache = null;
    };
    
    proto.isDark = function(row, col) {
        if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
            throw new Error(row + "," + col);
        }
        return this.modules[row][col];
    };
    
    proto.getModuleCount = function() {
        return this.moduleCount;
    };
    
    proto.make = function() {
        // Calculate automatically typeNumber if provided is < 1
        if (this.typeNumber < 1 ){
            var typeNumber = 1;
            for (typeNumber = 1; typeNumber < 40; typeNumber++) {
                var rsBlocks = RSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);
    
                var buffer = new BitBuffer();
                var totalDataCount = 0;
                for (var i = 0; i < rsBlocks.length; i++) {
                    totalDataCount += rsBlocks[i].dataCount;
                }
    
                for (var i = 0; i < this.dataList.length; i++) {
                    var data = this.dataList[i];
                    buffer.put(data.mode, 4);
                    buffer.put(data.getLength(), util.getLengthInBits(data.mode, typeNumber) );
                    data.write(buffer);
                }
                if (buffer.getLengthInBits() <= totalDataCount * 8)
                    break;
            }
            this.typeNumber = typeNumber;
        }
        this.makeImpl(false, this.getBestMaskPattern() );
    };
    
    proto.makeImpl = function(test, maskPattern) {
        
        this.moduleCount = this.typeNumber * 4 + 17;
        this.modules = new Array(this.moduleCount);
        
        for (var row = 0; row < this.moduleCount; row++) {
            
            this.modules[row] = new Array(this.moduleCount);
            
            for (var col = 0; col < this.moduleCount; col++) {
                this.modules[row][col] = null;//(col + row) % 3;
            }
        }
    
        this.setupPositionProbePattern(0, 0);
        this.setupPositionProbePattern(this.moduleCount - 7, 0);
        this.setupPositionProbePattern(0, this.moduleCount - 7);
        this.setupPositionAdjustPattern();
        this.setupTimingPattern();
        this.setupTypeInfo(test, maskPattern);
        
        if (this.typeNumber >= 7) {
            this.setupTypeNumber(test);
        }
    
        if (this.dataCache == null) {
            this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
        }
    
        this.mapData(this.dataCache, maskPattern);
    };
    
    proto.setupPositionProbePattern = function(row, col)  {
        
        for (var r = -1; r <= 7; r++) {
            
            if (row + r <= -1 || this.moduleCount <= row + r) continue;
            
            for (var c = -1; c <= 7; c++) {
                
                if (col + c <= -1 || this.moduleCount <= col + c) continue;
                
                if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
                        || (0 <= c && c <= 6 && (r == 0 || r == 6) )
                        || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
                    this.modules[row + r][col + c] = true;
                } else {
                    this.modules[row + r][col + c] = false;
                }
            }		
        }		
    };
    
    proto.getBestMaskPattern = function() {
    
        var minLostPoint = 0;
        var pattern = 0;
    
        for (var i = 0; i < 8; i++) {
            
            this.makeImpl(true, i);
    
            var lostPoint = util.getLostPoint(this);
    
            if (i == 0 || minLostPoint >  lostPoint) {
                minLostPoint = lostPoint;
                pattern = i;
            }
        }
    
        return pattern;
    };
    
    proto.createMovieClip = function(target_mc, instance_name, depth) {
    
        var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
        var cs = 1;
    
        this.make();
    
        for (var row = 0; row < this.modules.length; row++) {
            
            var y = row * cs;
            
            for (var col = 0; col < this.modules[row].length; col++) {
    
                var x = col * cs;
                var dark = this.modules[row][col];
            
                if (dark) {
                    qr_mc.beginFill(0, 100);
                    qr_mc.moveTo(x, y);
                    qr_mc.lineTo(x + cs, y);
                    qr_mc.lineTo(x + cs, y + cs);
                    qr_mc.lineTo(x, y + cs);
                    qr_mc.endFill();
                }
            }
        }
        
        return qr_mc;
    };
    
    proto.setupTimingPattern = function() {
        
        for (var r = 8; r < this.moduleCount - 8; r++) {
            if (this.modules[r][6] != null) {
                continue;
            }
            this.modules[r][6] = (r % 2 == 0);
        }
    
        for (var c = 8; c < this.moduleCount - 8; c++) {
            if (this.modules[6][c] != null) {
                continue;
            }
            this.modules[6][c] = (c % 2 == 0);
        }
    };
    
    proto.setupPositionAdjustPattern = function() {
    
        var pos = util.getPatternPosition(this.typeNumber);
        
        for (var i = 0; i < pos.length; i++) {
        
            for (var j = 0; j < pos.length; j++) {
            
                var row = pos[i];
                var col = pos[j];
                
                if (this.modules[row][col] != null) {
                    continue;
                }
                
                for (var r = -2; r <= 2; r++) {
                
                    for (var c = -2; c <= 2; c++) {
                    
                        if (r == -2 || r == 2 || c == -2 || c == 2
                                || (r == 0 && c == 0) ) {
                            this.modules[row + r][col + c] = true;
                        } else {
                            this.modules[row + r][col + c] = false;
                        }
                    }
                }
            }
        }
    };
    
    proto.setupTypeNumber = function(test) {
    
        var bits = util.getBCHTypeNumber(this.typeNumber);
    
        for (var i = 0; i < 18; i++) {
            var mod = (!test && ( (bits >> i) & 1) == 1);
            this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
        }
    
        for (var i = 0; i < 18; i++) {
            var mod = (!test && ( (bits >> i) & 1) == 1);
            this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
        }
    };
    
    proto.setupTypeInfo = function(test, maskPattern) {
    
        var data = (this.errorCorrectLevel << 3) | maskPattern;
        var bits = util.getBCHTypeInfo(data);
    
        // vertical		
        for (var i = 0; i < 15; i++) {
    
            var mod = (!test && ( (bits >> i) & 1) == 1);
    
            if (i < 6) {
                this.modules[i][8] = mod;
            } else if (i < 8) {
                this.modules[i + 1][8] = mod;
            } else {
                this.modules[this.moduleCount - 15 + i][8] = mod;
            }
        }
    
        // horizontal
        for (var i = 0; i < 15; i++) {
    
            var mod = (!test && ( (bits >> i) & 1) == 1);
            
            if (i < 8) {
                this.modules[8][this.moduleCount - i - 1] = mod;
            } else if (i < 9) {
                this.modules[8][15 - i - 1 + 1] = mod;
            } else {
                this.modules[8][15 - i - 1] = mod;
            }
        }
    
        // fixed module
        this.modules[this.moduleCount - 8][8] = (!test);
    };
    
    proto.mapData = function(data, maskPattern) {
        
        var inc = -1;
        var row = this.moduleCount - 1;
        var bitIndex = 7;
        var byteIndex = 0;
        
        for (var col = this.moduleCount - 1; col > 0; col -= 2) {
    
            if (col == 6) col--;
    
            while (true) {
    
                for (var c = 0; c < 2; c++) {
                    
                    if (this.modules[row][col - c] == null) {
                        
                        var dark = false;
    
                        if (byteIndex < data.length) {
                            dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
                        }
    
                        var mask = util.getMask(maskPattern, row, col - c);
    
                        if (mask) {
                            dark = !dark;
                        }
                        
                        this.modules[row][col - c] = dark;
                        bitIndex--;
    
                        if (bitIndex == -1) {
                            byteIndex++;
                            bitIndex = 7;
                        }
                    }
                }
                                
                row += inc;
    
                if (row < 0 || this.moduleCount <= row) {
                    row -= inc;
                    inc = -inc;
                    break;
                }
            }
        }
    };
    
    QRCode.PAD0 = 0xEC;
    QRCode.PAD1 = 0x11;
    
    QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
        
        var rsBlocks = RSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
        
        var buffer = new BitBuffer();
        
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            buffer.put(data.mode, 4);
            buffer.put(data.getLength(), util.getLengthInBits(data.mode, typeNumber) );
            data.write(buffer);
        }
    
        // calc num max data.
        var totalDataCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
        }
    
        if (buffer.getLengthInBits() > totalDataCount * 8) {
            throw new Error("code length overflow. ("
                + buffer.getLengthInBits()
                + ">"
                +  totalDataCount * 8
                + ")");
        }
    
        // end code
        if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
            buffer.put(0, 4);
        }
    
        // padding
        while (buffer.getLengthInBits() % 8 != 0) {
            buffer.putBit(false);
        }
    
        // padding
        while (true) {
            
            if (buffer.getLengthInBits() >= totalDataCount * 8) {
                break;
            }
            buffer.put(QRCode.PAD0, 8);
            
            if (buffer.getLengthInBits() >= totalDataCount * 8) {
                break;
            }
            buffer.put(QRCode.PAD1, 8);
        }
    
        return QRCode.createBytes(buffer, rsBlocks);
    };
    
    QRCode.createBytes = function(buffer, rsBlocks) {
    
        var offset = 0;
        
        var maxDcCount = 0;
        var maxEcCount = 0;
        
        var dcdata = new Array(rsBlocks.length);
        var ecdata = new Array(rsBlocks.length);
        
        for (var r = 0; r < rsBlocks.length; r++) {
    
            var dcCount = rsBlocks[r].dataCount;
            var ecCount = rsBlocks[r].totalCount - dcCount;
    
            maxDcCount = Math.max(maxDcCount, dcCount);
            maxEcCount = Math.max(maxEcCount, ecCount);
            
            dcdata[r] = new Array(dcCount);
            
            for (var i = 0; i < dcdata[r].length; i++) {
                dcdata[r][i] = 0xff & buffer.buffer[i + offset];
            }
            offset += dcCount;
            
            var rsPoly = util.getErrorCorrectPolynomial(ecCount);
            var rawPoly = new Polynomial(dcdata[r], rsPoly.getLength() - 1);
    
            var modPoly = rawPoly.mod(rsPoly);
            ecdata[r] = new Array(rsPoly.getLength() - 1);
            for (var i = 0; i < ecdata[r].length; i++) {
                var modIndex = i + modPoly.getLength() - ecdata[r].length;
                ecdata[r][i] = (modIndex >= 0)? modPoly.get(modIndex) : 0;
            }
    
        }
        
        var totalCodeCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) {
            totalCodeCount += rsBlocks[i].totalCount;
        }
    
        var data = new Array(totalCodeCount);
        var index = 0;
    
        for (var i = 0; i < maxDcCount; i++) {
            for (var r = 0; r < rsBlocks.length; r++) {
                if (i < dcdata[r].length) {
                    data[index++] = dcdata[r][i];
                }
            }
        }
    
        for (var i = 0; i < maxEcCount; i++) {
            for (var r = 0; r < rsBlocks.length; r++) {
                if (i < ecdata[r].length) {
                    data[index++] = ecdata[r][i];
                }
            }
        }
    
        return data;
    };
    
    module.exports = QRCode;
    
    
    },{"./8BitByte":10,"./BitBuffer":11,"./Polynomial":13,"./RSBlock":15,"./util":18}],15:[function(require,module,exports){
    // ErrorCorrectLevel
    var ECL = require('./ErrorCorrectLevel');
    
    function QRRSBlock(totalCount, dataCount) {
        this.totalCount = totalCount;
        this.dataCount  = dataCount;
    }
    
    QRRSBlock.RS_BLOCK_TABLE = [
    
        // L
        // M
        // Q
        // H
    
        // 1
        [1, 26, 19],
        [1, 26, 16],
        [1, 26, 13],
        [1, 26, 9],
        
        // 2
        [1, 44, 34],
        [1, 44, 28],
        [1, 44, 22],
        [1, 44, 16],
    
        // 3
        [1, 70, 55],
        [1, 70, 44],
        [2, 35, 17],
        [2, 35, 13],
    
        // 4		
        [1, 100, 80],
        [2, 50, 32],
        [2, 50, 24],
        [4, 25, 9],
        
        // 5
        [1, 134, 108],
        [2, 67, 43],
        [2, 33, 15, 2, 34, 16],
        [2, 33, 11, 2, 34, 12],
        
        // 6
        [2, 86, 68],
        [4, 43, 27],
        [4, 43, 19],
        [4, 43, 15],
        
        // 7		
        [2, 98, 78],
        [4, 49, 31],
        [2, 32, 14, 4, 33, 15],
        [4, 39, 13, 1, 40, 14],
        
        // 8
        [2, 121, 97],
        [2, 60, 38, 2, 61, 39],
        [4, 40, 18, 2, 41, 19],
        [4, 40, 14, 2, 41, 15],
        
        // 9
        [2, 146, 116],
        [3, 58, 36, 2, 59, 37],
        [4, 36, 16, 4, 37, 17],
        [4, 36, 12, 4, 37, 13],
        
        // 10		
        [2, 86, 68, 2, 87, 69],
        [4, 69, 43, 1, 70, 44],
        [6, 43, 19, 2, 44, 20],
        [6, 43, 15, 2, 44, 16],
    
        // 11
        [4, 101, 81],
        [1, 80, 50, 4, 81, 51],
        [4, 50, 22, 4, 51, 23],
        [3, 36, 12, 8, 37, 13],
    
        // 12
        [2, 116, 92, 2, 117, 93],
        [6, 58, 36, 2, 59, 37],
        [4, 46, 20, 6, 47, 21],
        [7, 42, 14, 4, 43, 15],
    
        // 13
        [4, 133, 107],
        [8, 59, 37, 1, 60, 38],
        [8, 44, 20, 4, 45, 21],
        [12, 33, 11, 4, 34, 12],
    
        // 14
        [3, 145, 115, 1, 146, 116],
        [4, 64, 40, 5, 65, 41],
        [11, 36, 16, 5, 37, 17],
        [11, 36, 12, 5, 37, 13],
    
        // 15
        [5, 109, 87, 1, 110, 88],
        [5, 65, 41, 5, 66, 42],
        [5, 54, 24, 7, 55, 25],
        [11, 36, 12],
    
        // 16
        [5, 122, 98, 1, 123, 99],
        [7, 73, 45, 3, 74, 46],
        [15, 43, 19, 2, 44, 20],
        [3, 45, 15, 13, 46, 16],
    
        // 17
        [1, 135, 107, 5, 136, 108],
        [10, 74, 46, 1, 75, 47],
        [1, 50, 22, 15, 51, 23],
        [2, 42, 14, 17, 43, 15],
    
        // 18
        [5, 150, 120, 1, 151, 121],
        [9, 69, 43, 4, 70, 44],
        [17, 50, 22, 1, 51, 23],
        [2, 42, 14, 19, 43, 15],
    
        // 19
        [3, 141, 113, 4, 142, 114],
        [3, 70, 44, 11, 71, 45],
        [17, 47, 21, 4, 48, 22],
        [9, 39, 13, 16, 40, 14],
    
        // 20
        [3, 135, 107, 5, 136, 108],
        [3, 67, 41, 13, 68, 42],
        [15, 54, 24, 5, 55, 25],
        [15, 43, 15, 10, 44, 16],
    
        // 21
        [4, 144, 116, 4, 145, 117],
        [17, 68, 42],
        [17, 50, 22, 6, 51, 23],
        [19, 46, 16, 6, 47, 17],
    
        // 22
        [2, 139, 111, 7, 140, 112],
        [17, 74, 46],
        [7, 54, 24, 16, 55, 25],
        [34, 37, 13],
    
        // 23
        [4, 151, 121, 5, 152, 122],
        [4, 75, 47, 14, 76, 48],
        [11, 54, 24, 14, 55, 25],
        [16, 45, 15, 14, 46, 16],
    
        // 24
        [6, 147, 117, 4, 148, 118],
        [6, 73, 45, 14, 74, 46],
        [11, 54, 24, 16, 55, 25],
        [30, 46, 16, 2, 47, 17],
    
        // 25
        [8, 132, 106, 4, 133, 107],
        [8, 75, 47, 13, 76, 48],
        [7, 54, 24, 22, 55, 25],
        [22, 45, 15, 13, 46, 16],
    
        // 26
        [10, 142, 114, 2, 143, 115],
        [19, 74, 46, 4, 75, 47],
        [28, 50, 22, 6, 51, 23],
        [33, 46, 16, 4, 47, 17],
    
        // 27
        [8, 152, 122, 4, 153, 123],
        [22, 73, 45, 3, 74, 46],
        [8, 53, 23, 26, 54, 24],
        [12, 45, 15, 28, 46, 16],
    
        // 28
        [3, 147, 117, 10, 148, 118],
        [3, 73, 45, 23, 74, 46],
        [4, 54, 24, 31, 55, 25],
        [11, 45, 15, 31, 46, 16],
    
        // 29
        [7, 146, 116, 7, 147, 117],
        [21, 73, 45, 7, 74, 46],
        [1, 53, 23, 37, 54, 24],
        [19, 45, 15, 26, 46, 16],
    
        // 30
        [5, 145, 115, 10, 146, 116],
        [19, 75, 47, 10, 76, 48],
        [15, 54, 24, 25, 55, 25],
        [23, 45, 15, 25, 46, 16],
    
        // 31
        [13, 145, 115, 3, 146, 116],
        [2, 74, 46, 29, 75, 47],
        [42, 54, 24, 1, 55, 25],
        [23, 45, 15, 28, 46, 16],
    
        // 32
        [17, 145, 115],
        [10, 74, 46, 23, 75, 47],
        [10, 54, 24, 35, 55, 25],
        [19, 45, 15, 35, 46, 16],
    
        // 33
        [17, 145, 115, 1, 146, 116],
        [14, 74, 46, 21, 75, 47],
        [29, 54, 24, 19, 55, 25],
        [11, 45, 15, 46, 46, 16],
    
        // 34
        [13, 145, 115, 6, 146, 116],
        [14, 74, 46, 23, 75, 47],
        [44, 54, 24, 7, 55, 25],
        [59, 46, 16, 1, 47, 17],
    
        // 35
        [12, 151, 121, 7, 152, 122],
        [12, 75, 47, 26, 76, 48],
        [39, 54, 24, 14, 55, 25],
        [22, 45, 15, 41, 46, 16],
    
        // 36
        [6, 151, 121, 14, 152, 122],
        [6, 75, 47, 34, 76, 48],
        [46, 54, 24, 10, 55, 25],
        [2, 45, 15, 64, 46, 16],
    
        // 37
        [17, 152, 122, 4, 153, 123],
        [29, 74, 46, 14, 75, 47],
        [49, 54, 24, 10, 55, 25],
        [24, 45, 15, 46, 46, 16],
    
        // 38
        [4, 152, 122, 18, 153, 123],
        [13, 74, 46, 32, 75, 47],
        [48, 54, 24, 14, 55, 25],
        [42, 45, 15, 32, 46, 16],
    
        // 39
        [20, 147, 117, 4, 148, 118],
        [40, 75, 47, 7, 76, 48],
        [43, 54, 24, 22, 55, 25],
        [10, 45, 15, 67, 46, 16],
    
        // 40
        [19, 148, 118, 6, 149, 119],
        [18, 75, 47, 31, 76, 48],
        [34, 54, 24, 34, 55, 25],
        [20, 45, 15, 61, 46, 16]
    ];
    
    QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
        
        var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
        
        if (rsBlock == undefined) {
            throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
        }
    
        var length = rsBlock.length / 3;
        
        var list = new Array();
        
        for (var i = 0; i < length; i++) {
    
            var count = rsBlock[i * 3 + 0];
            var totalCount = rsBlock[i * 3 + 1];
            var dataCount  = rsBlock[i * 3 + 2];
    
            for (var j = 0; j < count; j++) {
                list.push(new QRRSBlock(totalCount, dataCount) );	
            }
        }
        
        return list;
    }
    
    QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
    
        switch(errorCorrectLevel) {
        case ECL.L :
            return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
        case ECL.M :
            return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
        case ECL.Q :
            return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
        case ECL.H :
            return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
        default :
            return undefined;
        }
    }
    
    module.exports = QRRSBlock;
    
    },{"./ErrorCorrectLevel":12}],16:[function(require,module,exports){
    var QRMath = {
    
        glog : function(n) {
        
            if (n < 1) {
                throw new Error("glog(" + n + ")");
            }
            
            return QRMath.LOG_TABLE[n];
        },
        
        gexp : function(n) {
        
            while (n < 0) {
                n += 255;
            }
        
            while (n >= 256) {
                n -= 255;
            }
        
            return QRMath.EXP_TABLE[n];
        },
        
        EXP_TABLE : new Array(256),
        
        LOG_TABLE : new Array(256)
    
    };
        
    for (var i = 0; i < 8; i++) {
        QRMath.EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i++) {
        QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4]
            ^ QRMath.EXP_TABLE[i - 5]
            ^ QRMath.EXP_TABLE[i - 6]
            ^ QRMath.EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i++) {
        QRMath.LOG_TABLE[QRMath.EXP_TABLE[i] ] = i;
    }
    
    module.exports = QRMath;
    
    },{}],17:[function(require,module,exports){
    module.exports = {
        MODE_NUMBER :		1 << 0,
        MODE_ALPHA_NUM : 	1 << 1,
        MODE_8BIT_BYTE : 	1 << 2,
        MODE_KANJI :		1 << 3
    };
    
    },{}],18:[function(require,module,exports){
    var Mode = require('./mode');
    var Polynomial = require('./Polynomial');
    var math = require('./math');
    
    var QRMaskPattern = {
        PATTERN000 : 0,
        PATTERN001 : 1,
        PATTERN010 : 2,
        PATTERN011 : 3,
        PATTERN100 : 4,
        PATTERN101 : 5,
        PATTERN110 : 6,
        PATTERN111 : 7
    };
    
    var QRUtil = {
    
        PATTERN_POSITION_TABLE : [
            [],
            [6, 18],
            [6, 22],
            [6, 26],
            [6, 30],
            [6, 34],
            [6, 22, 38],
            [6, 24, 42],
            [6, 26, 46],
            [6, 28, 50],
            [6, 30, 54],		
            [6, 32, 58],
            [6, 34, 62],
            [6, 26, 46, 66],
            [6, 26, 48, 70],
            [6, 26, 50, 74],
            [6, 30, 54, 78],
            [6, 30, 56, 82],
            [6, 30, 58, 86],
            [6, 34, 62, 90],
            [6, 28, 50, 72, 94],
            [6, 26, 50, 74, 98],
            [6, 30, 54, 78, 102],
            [6, 28, 54, 80, 106],
            [6, 32, 58, 84, 110],
            [6, 30, 58, 86, 114],
            [6, 34, 62, 90, 118],
            [6, 26, 50, 74, 98, 122],
            [6, 30, 54, 78, 102, 126],
            [6, 26, 52, 78, 104, 130],
            [6, 30, 56, 82, 108, 134],
            [6, 34, 60, 86, 112, 138],
            [6, 30, 58, 86, 114, 142],
            [6, 34, 62, 90, 118, 146],
            [6, 30, 54, 78, 102, 126, 150],
            [6, 24, 50, 76, 102, 128, 154],
            [6, 28, 54, 80, 106, 132, 158],
            [6, 32, 58, 84, 110, 136, 162],
            [6, 26, 54, 82, 110, 138, 166],
            [6, 30, 58, 86, 114, 142, 170]
        ],
    
        G15 : (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
        G18 : (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
        G15_MASK : (1 << 14) | (1 << 12) | (1 << 10)	| (1 << 4) | (1 << 1),
    
        getBCHTypeInfo : function(data) {
            var d = data << 10;
            while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
                d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) ) ); 	
            }
            return ( (data << 10) | d) ^ QRUtil.G15_MASK;
        },
    
        getBCHTypeNumber : function(data) {
            var d = data << 12;
            while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
                d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) ) ); 	
            }
            return (data << 12) | d;
        },
    
        getBCHDigit : function(data) {
    
            var digit = 0;
    
            while (data != 0) {
                digit++;
                data >>>= 1;
            }
    
            return digit;
        },
    
        getPatternPosition : function(typeNumber) {
            return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
        },
    
        getMask : function(maskPattern, i, j) {
            
            switch (maskPattern) {
                
            case QRMaskPattern.PATTERN000 : return (i + j) % 2 == 0;
            case QRMaskPattern.PATTERN001 : return i % 2 == 0;
            case QRMaskPattern.PATTERN010 : return j % 3 == 0;
            case QRMaskPattern.PATTERN011 : return (i + j) % 3 == 0;
            case QRMaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0;
            case QRMaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 == 0;
            case QRMaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 == 0;
            case QRMaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 == 0;
    
            default :
                throw new Error("bad maskPattern:" + maskPattern);
            }
        },
    
        getErrorCorrectPolynomial : function(errorCorrectLength) {
    
            var a = new Polynomial([1], 0);
    
            for (var i = 0; i < errorCorrectLength; i++) {
                a = a.multiply(new Polynomial([1, math.gexp(i)], 0) );
            }
    
            return a;
        },
    
        getLengthInBits : function(mode, type) {
    
            if (1 <= type && type < 10) {
    
                // 1 - 9
    
                switch(mode) {
                case Mode.MODE_NUMBER 	: return 10;
                case Mode.MODE_ALPHA_NUM 	: return 9;
                case Mode.MODE_8BIT_BYTE	: return 8;
                case Mode.MODE_KANJI  	: return 8;
                default :
                    throw new Error("mode:" + mode);
                }
    
            } else if (type < 27) {
    
                // 10 - 26
    
                switch(mode) {
                case Mode.MODE_NUMBER 	: return 12;
                case Mode.MODE_ALPHA_NUM 	: return 11;
                case Mode.MODE_8BIT_BYTE	: return 16;
                case Mode.MODE_KANJI  	: return 10;
                default :
                    throw new Error("mode:" + mode);
                }
    
            } else if (type < 41) {
    
                // 27 - 40
    
                switch(mode) {
                case Mode.MODE_NUMBER 	: return 14;
                case Mode.MODE_ALPHA_NUM	: return 13;
                case Mode.MODE_8BIT_BYTE	: return 16;
                case Mode.MODE_KANJI  	: return 12;
                default :
                    throw new Error("mode:" + mode);
                }
    
            } else {
                throw new Error("type:" + type);
            }
        },
    
        getLostPoint : function(qrCode) {
            
            var moduleCount = qrCode.getModuleCount();
            
            var lostPoint = 0;
            
            // LEVEL1
            
            for (var row = 0; row < moduleCount; row++) {
    
                for (var col = 0; col < moduleCount; col++) {
    
                    var sameCount = 0;
                    var dark = qrCode.isDark(row, col);
    
                    for (var r = -1; r <= 1; r++) {
    
                        if (row + r < 0 || moduleCount <= row + r) {
                            continue;
                        }
    
                        for (var c = -1; c <= 1; c++) {
    
                            if (col + c < 0 || moduleCount <= col + c) {
                                continue;
                            }
    
                            if (r == 0 && c == 0) {
                                continue;
                            }
    
                            if (dark == qrCode.isDark(row + r, col + c) ) {
                                sameCount++;
                            }
                        }
                    }
    
                    if (sameCount > 5) {
                        lostPoint += (3 + sameCount - 5);
                    }
                }
            }
    
            // LEVEL2
    
            for (var row = 0; row < moduleCount - 1; row++) {
                for (var col = 0; col < moduleCount - 1; col++) {
                    var count = 0;
                    if (qrCode.isDark(row,     col    ) ) count++;
                    if (qrCode.isDark(row + 1, col    ) ) count++;
                    if (qrCode.isDark(row,     col + 1) ) count++;
                    if (qrCode.isDark(row + 1, col + 1) ) count++;
                    if (count == 0 || count == 4) {
                        lostPoint += 3;
                    }
                }
            }
    
            // LEVEL3
    
            for (var row = 0; row < moduleCount; row++) {
                for (var col = 0; col < moduleCount - 6; col++) {
                    if (qrCode.isDark(row, col)
                            && !qrCode.isDark(row, col + 1)
                            &&  qrCode.isDark(row, col + 2)
                            &&  qrCode.isDark(row, col + 3)
                            &&  qrCode.isDark(row, col + 4)
                            && !qrCode.isDark(row, col + 5)
                            &&  qrCode.isDark(row, col + 6) ) {
                        lostPoint += 40;
                    }
                }
            }
    
            for (var col = 0; col < moduleCount; col++) {
                for (var row = 0; row < moduleCount - 6; row++) {
                    if (qrCode.isDark(row, col)
                            && !qrCode.isDark(row + 1, col)
                            &&  qrCode.isDark(row + 2, col)
                            &&  qrCode.isDark(row + 3, col)
                            &&  qrCode.isDark(row + 4, col)
                            && !qrCode.isDark(row + 5, col)
                            &&  qrCode.isDark(row + 6, col) ) {
                        lostPoint += 40;
                    }
                }
            }
    
            // LEVEL4
            
            var darkCount = 0;
    
            for (var col = 0; col < moduleCount; col++) {
                for (var row = 0; row < moduleCount; row++) {
                    if (qrCode.isDark(row, col) ) {
                        darkCount++;
                    }
                }
            }
            
            var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
            lostPoint += ratio * 10;
    
            return lostPoint;		
        }
    };
    
    module.exports = QRUtil;
    
    },{"./Polynomial":13,"./math":16,"./mode":17}],19:[function(require,module,exports){
    (function (process){(function (){
    /** @license React v16.13.1
     * react-is.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';
    
    
    
    if (process.env.NODE_ENV !== "production") {
      (function() {
    'use strict';
    
    // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.
    var hasSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
    // (unstable) APIs that have been removed. Can we remove the symbols?
    
    var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
    var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
    var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
    var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
    var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
    var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;
    
    function isValidElementType(type) {
      return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
    }
    
    function typeOf(object) {
      if (typeof object === 'object' && object !== null) {
        var $$typeof = object.$$typeof;
    
        switch ($$typeof) {
          case REACT_ELEMENT_TYPE:
            var type = object.type;
    
            switch (type) {
              case REACT_ASYNC_MODE_TYPE:
              case REACT_CONCURRENT_MODE_TYPE:
              case REACT_FRAGMENT_TYPE:
              case REACT_PROFILER_TYPE:
              case REACT_STRICT_MODE_TYPE:
              case REACT_SUSPENSE_TYPE:
                return type;
    
              default:
                var $$typeofType = type && type.$$typeof;
    
                switch ($$typeofType) {
                  case REACT_CONTEXT_TYPE:
                  case REACT_FORWARD_REF_TYPE:
                  case REACT_LAZY_TYPE:
                  case REACT_MEMO_TYPE:
                  case REACT_PROVIDER_TYPE:
                    return $$typeofType;
    
                  default:
                    return $$typeof;
                }
    
            }
    
          case REACT_PORTAL_TYPE:
            return $$typeof;
        }
      }
    
      return undefined;
    } // AsyncMode is deprecated along with isAsyncMode
    
    var AsyncMode = REACT_ASYNC_MODE_TYPE;
    var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
    var ContextConsumer = REACT_CONTEXT_TYPE;
    var ContextProvider = REACT_PROVIDER_TYPE;
    var Element = REACT_ELEMENT_TYPE;
    var ForwardRef = REACT_FORWARD_REF_TYPE;
    var Fragment = REACT_FRAGMENT_TYPE;
    var Lazy = REACT_LAZY_TYPE;
    var Memo = REACT_MEMO_TYPE;
    var Portal = REACT_PORTAL_TYPE;
    var Profiler = REACT_PROFILER_TYPE;
    var StrictMode = REACT_STRICT_MODE_TYPE;
    var Suspense = REACT_SUSPENSE_TYPE;
    var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated
    
    function isAsyncMode(object) {
      {
        if (!hasWarnedAboutDeprecatedIsAsyncMode) {
          hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint
    
          console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
        }
      }
    
      return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
    }
    function isConcurrentMode(object) {
      return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
    }
    function isContextConsumer(object) {
      return typeOf(object) === REACT_CONTEXT_TYPE;
    }
    function isContextProvider(object) {
      return typeOf(object) === REACT_PROVIDER_TYPE;
    }
    function isElement(object) {
      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function isForwardRef(object) {
      return typeOf(object) === REACT_FORWARD_REF_TYPE;
    }
    function isFragment(object) {
      return typeOf(object) === REACT_FRAGMENT_TYPE;
    }
    function isLazy(object) {
      return typeOf(object) === REACT_LAZY_TYPE;
    }
    function isMemo(object) {
      return typeOf(object) === REACT_MEMO_TYPE;
    }
    function isPortal(object) {
      return typeOf(object) === REACT_PORTAL_TYPE;
    }
    function isProfiler(object) {
      return typeOf(object) === REACT_PROFILER_TYPE;
    }
    function isStrictMode(object) {
      return typeOf(object) === REACT_STRICT_MODE_TYPE;
    }
    function isSuspense(object) {
      return typeOf(object) === REACT_SUSPENSE_TYPE;
    }
    
    exports.AsyncMode = AsyncMode;
    exports.ConcurrentMode = ConcurrentMode;
    exports.ContextConsumer = ContextConsumer;
    exports.ContextProvider = ContextProvider;
    exports.Element = Element;
    exports.ForwardRef = ForwardRef;
    exports.Fragment = Fragment;
    exports.Lazy = Lazy;
    exports.Memo = Memo;
    exports.Portal = Portal;
    exports.Profiler = Profiler;
    exports.StrictMode = StrictMode;
    exports.Suspense = Suspense;
    exports.isAsyncMode = isAsyncMode;
    exports.isConcurrentMode = isConcurrentMode;
    exports.isContextConsumer = isContextConsumer;
    exports.isContextProvider = isContextProvider;
    exports.isElement = isElement;
    exports.isForwardRef = isForwardRef;
    exports.isFragment = isFragment;
    exports.isLazy = isLazy;
    exports.isMemo = isMemo;
    exports.isPortal = isPortal;
    exports.isProfiler = isProfiler;
    exports.isStrictMode = isStrictMode;
    exports.isSuspense = isSuspense;
    exports.isValidElementType = isValidElementType;
    exports.typeOf = typeOf;
      })();
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"_process":3}],20:[function(require,module,exports){
    /** @license React v16.13.1
     * react-is.production.min.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    
    'use strict';var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
    Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
    function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;
    exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isAsyncMode=function(a){return A(a)||z(a)===l};exports.isConcurrentMode=A;exports.isContextConsumer=function(a){return z(a)===k};exports.isContextProvider=function(a){return z(a)===h};exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return z(a)===n};exports.isFragment=function(a){return z(a)===e};exports.isLazy=function(a){return z(a)===t};
    exports.isMemo=function(a){return z(a)===r};exports.isPortal=function(a){return z(a)===d};exports.isProfiler=function(a){return z(a)===g};exports.isStrictMode=function(a){return z(a)===f};exports.isSuspense=function(a){return z(a)===p};
    exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};exports.typeOf=z;
    
    },{}],21:[function(require,module,exports){
    (function (process){(function (){
    'use strict';
    
    if (process.env.NODE_ENV === 'production') {
      module.exports = require('./cjs/react-is.production.min.js');
    } else {
      module.exports = require('./cjs/react-is.development.js');
    }
    
    }).call(this)}).call(this,require('_process'))
    },{"./cjs/react-is.development.js":19,"./cjs/react-is.production.min.js":20,"_process":3}],22:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
    
    var _propTypes = require("prop-types");
    
    var _propTypes2 = _interopRequireDefault(_propTypes);
    
    var _react = React;
    
    var _react2 = _interopRequireDefault(_react);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
    
    var propTypes = {
      bgColor: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]).isRequired,
      bgD: _propTypes2.default.string.isRequired,
      fgColor: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]).isRequired,
      fgD: _propTypes2.default.string.isRequired,
      size: _propTypes2.default.number.isRequired,
      title: _propTypes2.default.string,
      viewBoxSize: _propTypes2.default.number.isRequired,
      xmlns: _propTypes2.default.string
    };
    
    var defaultProps = {
      title: undefined,
      xmlns: "http://www.w3.org/2000/svg"
    };
    
    var QRCodeSvg = (0, _react.forwardRef)(function (_ref, ref) {
      var bgColor = _ref.bgColor,
          bgD = _ref.bgD,
          fgD = _ref.fgD,
          fgColor = _ref.fgColor,
          size = _ref.size,
          title = _ref.title,
          viewBoxSize = _ref.viewBoxSize,
          props = _objectWithoutProperties(_ref, ["bgColor", "bgD", "fgD", "fgColor", "size", "title", "viewBoxSize"]);
    
      return _react2.default.createElement(
        "svg",
        _extends({}, props, { height: size, ref: ref, viewBox: "0 0 " + viewBoxSize + " " + viewBoxSize, width: size }),
        title ? _react2.default.createElement(
          "title",
          null,
          title
        ) : null,
        _react2.default.createElement("path", { d: bgD, fill: bgColor }),
        _react2.default.createElement("path", { d: fgD, fill: fgColor })
      );
    });
    
    QRCodeSvg.displayName = "QRCodeSvg";
    QRCodeSvg.propTypes = propTypes;
    QRCodeSvg.defaultProps = defaultProps;
    
    exports.default = QRCodeSvg;
    },{"prop-types":7,"react":"react"}],23:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.QRCode = undefined;
    
    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
    
    var _QRCode = require("qr.js/lib/QRCode");
    
    var _QRCode2 = _interopRequireDefault(_QRCode);
    
    var _ErrorCorrectLevel = require("qr.js/lib/ErrorCorrectLevel");
    
    var _ErrorCorrectLevel2 = _interopRequireDefault(_ErrorCorrectLevel);
    
    var _propTypes = require("prop-types");
    
    var _propTypes2 = _interopRequireDefault(_propTypes);
    
    var _react = React;
    
    var _react2 = _interopRequireDefault(_react);
    
    var _QRCodeSvg = require("./QRCodeSvg");
    
    var _QRCodeSvg2 = _interopRequireDefault(_QRCodeSvg);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } // A `qr.js` doesn't handle error level of zero (M) so we need to do it right, thus the deep require.
    
    
    var propTypes = {
      bgColor: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]),
      fgColor: _propTypes2.default.oneOfType([_propTypes2.default.object, _propTypes2.default.string]),
      level: _propTypes2.default.string,
      size: _propTypes2.default.number,
      value: _propTypes2.default.string.isRequired
    };
    
    var defaultProps = {
      bgColor: "#FFFFFF",
      fgColor: "#000000",
      level: "L",
      size: 256
    };
    
    var QRCode = (0, _react.forwardRef)(function (_ref, ref) {
      var bgColor = _ref.bgColor,
          fgColor = _ref.fgColor,
          level = _ref.level,
          size = _ref.size,
          value = _ref.value,
          props = _objectWithoutProperties(_ref, ["bgColor", "fgColor", "level", "size", "value"]);
    
      // Use type === -1 to automatically pick the best type.
      var qrcode = new _QRCode2.default(-1, _ErrorCorrectLevel2.default[level]);
      qrcode.addData(value);
      qrcode.make();
      var cells = qrcode.modules;
      return _react2.default.createElement(_QRCodeSvg2.default, _extends({}, props, {
        bgColor: bgColor,
        bgD: cells.map(function (row, rowIndex) {
          return row.map(function (cell, cellIndex) {
            return !cell ? "M " + cellIndex + " " + rowIndex + " l 1 0 0 1 -1 0 Z" : "";
          }).join(" ");
        }).join(" "),
        fgColor: fgColor,
        fgD: cells.map(function (row, rowIndex) {
          return row.map(function (cell, cellIndex) {
            return cell ? "M " + cellIndex + " " + rowIndex + " l 1 0 0 1 -1 0 Z" : "";
          }).join(" ");
        }).join(" "),
        ref: ref,
        size: size,
        viewBoxSize: cells.length
      }));
    });
    
    exports.QRCode = QRCode;
    QRCode.displayName = "QRCode";
    QRCode.propTypes = propTypes;
    QRCode.defaultProps = defaultProps;
    
    exports.default = QRCode;
    },{"./QRCodeSvg":22,"prop-types":7,"qr.js/lib/ErrorCorrectLevel":12,"qr.js/lib/QRCode":14,"react":"react"}]},{},[1]);
    