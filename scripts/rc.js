// Reusable Chart (Rc)
// A constructor for reusable D3.js charts
(function(window, undefined) {

  var Rc = window.Rc = function(options) {

    if (options) {
      // Extend this instance with the supplied options, falling back to the
      // default values when unspecified
      this.options = _.defaults(options, this.defaults);
    }

    this.data = this.options.data || [];
    this.base = this.options.base;

    // Clone all event handlers
    this._handlers = _.clone(this._handlers);
    _.forEach(this._handlers, function(handlers, eventName, _handlers) {
      _handlers[eventName] = _.clone(handlers);
    });

    this.initialize.apply(this, arguments);
  };

  Rc.prototype.initialize = function() {};

  // dataBind
  // Given a data object, bind it to a d3 selection.
  Rc.prototype.dataBind = function() {};

  // insert
  // Given an entering selection, return a selection that has new elements
  // inserted.
  Rc.prototype.insert = function() {};

  Rc.prototype.on = function(eventName, handler) {

    if (!_.has(this, "_handlers")) {
      this._handlers = _.clone(this._handlers) || {};
    }

    if (!this._handlers[eventName]) {
      this._handlers[eventName] = [];
    }

    this._handlers[eventName].push(handler);
  };

  Rc.prototype.draw = function(data) {

    var bound, selections;

    if (!data) {
      data = this.data;
    }

    bound = this.dataBind(data);

    selections = {
      enter: this.insert(bound.enter()),
      update: bound,
      exit: bound.exit()
    };

    _.forEach(this._handlers, function(handlers, eventName) {
      var selection = selections[eventName];

      _.forEach(handlers, function(handler) {
        handler.call(this, selection);
      }, this);

    }, this);
  };

  // Method to correctly set up the prototype chain, for subclasses. Borrowed
  // from Backbone.js
  // http://backbonejs.org/
  Rc.extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass, if
    // supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    _.forEach(protoProps.events, function(handler, eventName) {
      this.on(eventName, handler);
    }, child.prototype);

    return child;
  };

}(this));
