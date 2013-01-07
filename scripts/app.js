// Reusable Chart (Rc)
// A constructor for reusable D3.js charts
(function(window, undefined) {

  var Rc = window.Rc = function(options) {

    this._handlers = {
      enter: [],
      update: [],
      exit: []
    };

    if (options) {
      // Extend this instance with the supplied options, falling back to the
      // default values when unspecified
      this._options = _.defaults(options, this.defaults);

      if (options.data) {
        this.data = options.data;
      }
    }

    if (!this.data) {
      this.data = [];
    }

    this.initialize.apply(this, arguments);
  };

  Rc.prototype.initialize = function() {};

  // dataBind
  // Given a data object, bind it to a d3 selection.
  Rc.prototype.dataBind = function() {};

  Rc.prototype._insert = function() {};

  Rc.prototype.on = function(eventName, handler) {
    this._handlers[eventName].push(handler);
  };

  Rc.prototype.draw = function(data) {

    var bound, selections;

    if (!data) {
      data = this.data;
    }

    bound = this.dataBind(data);

    selections = {
      enter: this._insert(bound.enter()),
      update: bound,
      exit: bound.exit()
    };

    _.forEach(this._handlers, function(handlers, eventName) {
      var selection = selections[eventName];

      this["_on" + eventName].call(this, selection);

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

    return child;
  };

}(this));

// BarChart (BC)
// A generic bar chart based on the example built in "A Bar Chart, Part 2"
// http://mbostock.github.com/d3/tutorial/bar-2.html
(function(window, undefined) {

  var BC = window.BarChart = Rc.extend({

    defaults: {
      container: "body",
      width: 20,
      height: 80
    },

    initialize: function(options) {

      var self = this;

      this.x = d3.scale.linear()
        .domain([0, 1])
        .range([0, this._options.width]);

      this.y = d3.scale.linear()
        .domain([0, 100])
        .rangeRound([0, this._options.height]);

      this.chart = d3.select(this._options.container).append("svg")
        .attr("class", "chart")
        .attr("width", this._options.width)
        .attr("height", this._options.height);

    },

    dataBind: function(data) {

      return this.chart.selectAll("rect.bar-chart-bar")
        .data(data, function(d) { return d.time; });

    }

  });

  // width
  // If specified, re-set the width of the chart (and return a reference to
  // the chart itself for chaining). Otherwise, simply return the current
  // width of the chart
  BC.prototype.width = function(width) {
    // The method is being invoked as a getter
    if (!arguments.length) {
      return this._options.width;
    }

    // The method is being invoked as a setter
    this.chart.attr("width", width);
    this.x.range([0, width]);
    this._options.width = width;

    return this;
  };

  // height
  // If specified, re-set the height of the chart (and return a reference to
  // the chart itself for chaining). Otherwise, simply return the current
  // height of the chart
  BC.prototype.height = function(height) {
    // The method is being invoked as a getter
    if (!arguments.length) {
      return this._options.height;
    }

    // The method is being invoked as a setter
    this.chart.attr("height", height);
    this.y.rangeRound([0, height]);
    this._options.height = height;

    return this;
  };

  BC.prototype._onenter = function(entering) {
    var self = this;

    entering
      .attr("x", function(d, i) { return self.x((i + 1)/self.data.length) - .5; })
      .attr("y", function(d) { return self._options.height - self.y(d.value) - .5; })
      .attr("width", this._options.width / this.data.length)
      .attr("height", function(d) { return self.y(d.value); })
      .transition().duration(1000)
        .attr("x", function(d, i) { return self.x(i) - .5; });
  };

  BC.prototype._onupdate = function(updating) {
    var self = this;

    updating
      .attr("height", function(d) { return self.y(d.value); })
      .transition().duration(1000)
        .attr("width", this._options.width / this.data.length)
        .attr("y", function(d) { return self._options.height - self.y(d.value) - .5; })
        .attr("x", function(d, i) { return self.x((i + 0)/self.data.length) - .5; });
  };

  BC.prototype._onexit = function(exiting) {
    var self = this;

    exiting
      .transition().duration(1000)
        .attr("x", function(d, i) { return self.x((i - 1)/self.data.length) - .5; })
        .remove();
  };

  // _insert
  // Generate a new element for entering data. This method should not be
  // invoked directly nor overiddent, but it is defined to promote readability.
  BC.prototype._insert = function(entering) {
    return entering
      .insert("rect")
      .classed("bar-chart-bar", true);
  };


}(this));

(function(window, undefined) {

  var DS = window.DataSrc = function() {
    this.maxLength = 33;
    this.data = [];
    this.time = new Date().getTime();
    this.value = 70;
  };

  DS.prototype.next = function() {

    this.value = this.value + 10 * (Math.random() - .5);
    this.value = Math.min(90, this.value);
    this.value = Math.max(10, this.value);
    this.value = Math.floor(this.value);

    this.time++;

    return {
      time: this.time,
      value: this.value
    };
  };

  DS.prototype.push = function(value) {
    if (this.data.length >= this.maxLength) {
      this.data.shift();
    }
    this.data.push(value);
  };

}(this));

(function(window, undefined) {

  var series1 = new DataSrc();

  for (var i = 0; i < 33; ++i) {
    series1.push(series1.next());
  }

  document.addEventListener( "DOMContentLoaded", function() {

    var myChart = new window.BarChart({
      height: 75,
      width: 301,
      data: series1.data,
      container: "body"
    });

    myChart.on("enter", function(entering) {
      entering
        .classed("bocoup-series-1", true)
        .attr("height", 5)
        .attr("fill", "red");
    });

    myChart.draw();
    setInterval(function() {

      series1.push(series1.next());

      myChart.draw();
    }, 1500);
  }, false);

}(this));
