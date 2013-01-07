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

    // insert
    // Generate a new element for entering data. This method should not be
    // invoked directly nor overiddent, but it is defined to promote readability.
    insert: function(entering) {
      return entering
        .insert("rect")
        .classed("bar-chart-bar", true);
    },

    dataBind: function(data) {

      return this.chart.selectAll("rect.bar-chart-bar")
        .data(data, function(d) { return d.time; });

    },

    events: {
      enter: function(entering) {
        var self = this;

        entering
          .attr("x", function(d, i) { return self.x((i + 1)/self.data.length) - .5; })
          .attr("y", function(d) { return self._options.height - self.y(d.value) - .5; })
          .attr("width", this._options.width / this.data.length)
          .attr("height", function(d) { return self.y(d.value); })
          .transition().duration(1000)
            .attr("x", function(d, i) { return self.x(i) - .5; });
      },
      update: function(updating) {
        var self = this;

        updating
          .attr("height", function(d) { return self.y(d.value); })
          .transition().duration(1000)
            .attr("width", this._options.width / this.data.length)
            .attr("y", function(d) { return self._options.height - self.y(d.value) - .5; })
            .attr("x", function(d, i) { return self.x((i + 0)/self.data.length) - .5; });
      },
      exit: function(exiting) {
        var self = this;

        exiting
          .transition().duration(1000)
            .attr("x", function(d, i) { return self.x((i - 1)/self.data.length) - .5; })
            .remove();
      }
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

}(this));
