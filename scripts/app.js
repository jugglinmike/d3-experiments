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
      .attr("width", this._options.width * this._options.data.length - 1)
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

  BC.prototype.draw = function() {

    var self = this;
    var rect = this.chart.selectAll("rect")
      .data(this._options.data, function(d) { return d.time; });

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

  var dataSrc = {
    time: 1297110663, // seconds since epoch
    value: 70,
    next: function() {

      dataSrc.value = dataSrc.value + 10 * (Math.random() - .5);
      dataSrc.value = Math.min(90, dataSrc.value);
      dataSrc.value = Math.max(10, dataSrc.value);
      dataSrc.value = Math.floor(dataSrc.value);

      dataSrc.time++;

      return {
        time: dataSrc.time,
        value: dataSrc.value
      };
    }
  };

  var data = d3.range(33).map(function() {
    return dataSrc.next();
  });

  document.addEventListener( "DOMContentLoaded", function() {

    var myChart = new window.BarChart({
      height: 75,
      data: data,
      container: "body"
    });

    myChart.draw();
    setInterval(function() {

      data.shift();
      data.push(dataSrc.next());

      myChart.draw();
    }, 1500);
  }, false);

}(this));
