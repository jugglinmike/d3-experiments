(function(window, undefined) {

  var BC = window.BarChart = function() {

    this.time = 1297110663; // start time (seconds since epoch)
    this.value = 70; // start value (subscribers)
    var self = this;
    // starting dataset
    this.data = d3.range(33).map(function() {
      return self.next();
    });
    this.width = 20;
    this.height = 80;

    this.x = d3.scale.linear()
      .domain([0, 1])
      .range([0, this.width]);

    this.y = d3.scale.linear()
      .domain([0, 100])
      .rangeRound([0, this.height]);

    this.chart = d3.select("body").append("svg")
      .attr("class", "chart")
      .attr("width", this.width * this.data.length - 1)
      .attr("height", this.height);

  };

  BC.prototype.next = function() {
    this.time++;
    this.value = this.value + 10 * (Math.random() - .5);
    this.value = Math.min(90, this.value);
    this.value = Math.max(10, this.value);
    this.value = Math.floor(this.value);

    return {
      time: this.time,
      value: this.value
    };
  }

  BC.prototype.draw = function() {

    var self = this;
    var rect = this.chart.selectAll("rect")
      .data(this.data, function(d) { return d.time; });

    rect.enter().insert("rect", "line")
        .attr("x", function(d, i) { return self.x(i + 1) - .5; })
        .attr("y", function(d) { return self.height - self.y(d.value) - .5; })
        .attr("width", this.width)
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

    var myChart = new window.BarChart();

    myChart.draw();
    setInterval(function() {
      myChart.data.shift();
      myChart.data.push(myChart.next());
      myChart.draw();
    }, 1500);
  }, false);

}(this));
