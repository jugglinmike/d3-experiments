(function(window, undefined) {

  var myBarChart = d3.select("body").chart("BarChart");

  myBarChart.draw();
  setInterval(function() {
    myBarChart.data.shift();
    myBarChart.data.push(myBarChart.next());
    myBarChart.draw();
  }, 1500);

  var myBarChart2 = d3.select("body").chart("BarChart");

  myBarChart2.layers.bars.on("update:transition", function() {
    this.attr("opacity", function(d, i) { return i/32; });
  });

  myBarChart2.draw();
  setInterval(function() {
    myBarChart2.data.shift();
    myBarChart2.data.push(myBarChart2.next());
    myBarChart2.draw();
  }, 1500);

  var myWackyBarChart = d3.select("body").chart("WackyBC");

  myWackyBarChart.draw();
  setInterval(function() {
    myWackyBarChart.bc.data.shift();
    myWackyBarChart.bc.data.push(myBarChart.next());
    myWackyBarChart.draw();
  }, 1500);

  var myChord = d3.select("body").chart("Chord");
  // From http://mkweb.bcgsc.ca/circos/guide/tables/
  var matrix = [
    [11975,  5871, 8916, 2868],
    [ 1951, 10048, 2060, 6171],
    [ 8010, 16145, 8090, 8045],
    [ 1013,   990,  940, 6907]
  ];

  myChord.draw(matrix);

  var myChord2 = d3.select("body").chart("Chord");

  myChord2.layers.ticks.on("enter", function(entering) {
    entering.attr("fill", "#a00");
  });
  myChord2.draw(matrix);

  var myWackyChord = d3.select("body").chart("WackyChord");
  myWackyChord.draw(matrix);
  setInterval(function() {
    myWackyChord.bc.data.shift();
    myWackyChord.bc.data.push(myWackyChord.bc.next());
    myWackyChord.draw();
  }, 1500);

}(this));
