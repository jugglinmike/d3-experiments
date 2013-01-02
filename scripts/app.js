(function(window, undefined) {

  var defaultOpts = {
    container: "body",
    time: 1297110663, // seconds since epoch
    value: 70,
    width: 20,
    height: 80
  };

  var BC = window.BarChart = function(options) {

    var self = this;

    // Ensure that only expected options are set
    options = _.pick(options || {}, _.keys(defaultOpts));
    // Extend this instance with the supplied options, falling back to the
    // default values when unspecified
    this._options = _.defaults(options, defaultOpts);

    // starting dataset
    this.data = d3.range(33).map(function() {
      return self.next();
    });

    this.x = d3.scale.linear()
      .domain([0, 1])
      .range([0, this._options.width]);

    this.y = d3.scale.linear()
      .domain([0, 100])
      .rangeRound([0, this._options.height]);

    this.chart = d3.select(this._options.container).append("svg")
      .attr("class", "chart")
      .attr("width", this._options.width * this.data.length - 1)
      .attr("height", this._options.height);

  };

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
    this._options.height = height;
    return this;
  };

  BC.prototype.next = function() {

    // Alias reference for convenience
    var value = this._options.value;
    value = value + 10 * (Math.random() - .5);
    value = Math.min(90, value);
    value = Math.max(10, value);
    value = Math.floor(value);
    this._options.value = value;

    this._options.time++;

    return {
      time: this._options.time,
      value: this._options.value
    };
  }

  BC.prototype.draw = function() {

    var self = this;
    var rect = this.chart.selectAll("rect")
      .data(this.data, function(d) { return d.time; });

    rect.enter().insert("rect", "line")
        .attr("x", function(d, i) { return self.x(i + 1) - .5; })
        .attr("y", function(d) { return self._options.height - self.y(d.value) - .5; })
        .attr("width", this._options.width)
        .attr("height", function(d) { return self.y(d.value); })
      .transition()
        .duration(1000)
        .attr("x", function(d, i) { return self.x(i) - .5; });

    rect.transition()
        .duration(1000)
        .attr("x", function(d, i) { return self.x(i) - .5; });

    rect.exit().transition()
        .duration(1000)
        .attr("x", function(d, i) { return self.x(i - 1) - .5; })
        .remove();
  }

}(this));

(function(window, undefined) {

  document.addEventListener( "DOMContentLoaded", function() {

    var myChart = new window.BarChart({
      height: 75,
      container: "body"
    });

    myChart.draw();
    setInterval(function() {
      myChart.data.shift();
      myChart.data.push(myChart.next());
      myChart.draw();
    }, 1500);
  }, false);

}(this));
