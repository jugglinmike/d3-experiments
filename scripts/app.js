(function(window, undefined) {
  var chart,
    time = 1297110663, // start time (seconds since epoch)
    value = 70, // start value (subscribers)
    data = d3.range(33).map(next); // starting dataset

  function next() {
    return {
      time: ++time,
      value: value = ~~Math.max(10, Math.min(90, value + 10 * (Math.random() - .5)))
    };
  }

  var width = 20,
    height = 80;

  var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0, 100])
    .rangeRound([0, height]);

  var chart = d3.select("body").append("svg")
    .attr("class", "chart")
    .attr("width", width * data.length - 1)
    .attr("height", height);

  function redraw() {

    var rect = chart.selectAll("rect")
      .data(data, function(d) { return d.time; });

    rect.enter().insert("rect", "line")
        .attr("x", function(d, i) { return x(i + 1) - .5; })
        .attr("y", function(d) { return height - y(d.value) - .5; })
        .attr("width", width)
        .attr("height", function(d) { return y(d.value); })
      .transition()
        .duration(1000)
        .attr("x", function(d, i) { return x(i) - .5; });

    rect.transition()
        .duration(1000)
        .attr("x", function(d, i) { return x(i) - .5; });

    rect.exit().transition()
        .duration(1000)
        .attr("x", function(d, i) { return x(i - 1) - .5; })
        .remove();
  }

  document.addEventListener( "DOMContentLoaded", function() {

    chart = d3.select("body").append("svg")
        .attr("class", "chart")
        .attr("width", width * data.length - 1)
        .attr("height", height);

    redraw();
    setInterval(function() {
      data.shift();
      data.push(next());
      redraw();
    }, 1500);
  }, false);

}(this));
