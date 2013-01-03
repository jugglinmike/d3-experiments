(function(window, undefined) {

  var defaultOpts = {
    data: [],
    container: "body",
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

  BC.prototype.onEnter = function(entering) {
    var self = this;

    entering
      .attr("x", function(d, i) { return self.x((i + 1)/self._options.data.length) - .5; })
      .attr("y", function(d) { return self._options.height - self.y(d.value) - .5; })
      .attr("width", this._options.width / this._options.data.length)
      .attr("height", function(d) { return self.y(d.value); })
      .transition()
        .duration(1000)
        .attr("x", function(d, i) { return self.x(i) - .5; });
  };

  BC.prototype.onUpdate = function(updating) {
    var self = this;

    updating.transition()
      .duration(1000)
      .attr("width", this._options.width / this._options.data.length)
      .attr("x", function(d, i) { return self.x((i + 0)/self._options.data.length) - .5; });
  };

  BC.prototype.onExit = function(exiting) {
    var self = this;

    exiting.transition()
      .duration(1000)
        .attr("x", function(d, i) { return self.x((i - 1)/self._options.data.length) - .5; })
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

  BC.prototype.draw = function() {

    var self = this;
    var rect = this.chart.selectAll("rect.bar-chart-bar")
      .data(this._options.data, function(d) { return d.time; });

    this.onEnter(this._insert(rect.enter()));
    this.onUpdate(rect);
    this.onExit(rect.exit());
  }

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

    myChart.draw();
    setInterval(function() {

      series1.push(series1.next());

      myChart.draw();
    }, 1500);
  }, false);

}(this));
