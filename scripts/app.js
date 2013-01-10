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

    var myTreeMap = new window.TreeMap({
      container: "body"
    });

    d3.json("data/flare.json", function(data) {
      myTreeMap.draw(data);
    });

    // From http://mkweb.bcgsc.ca/circos/guide/tables/
    var matrix = [
      [11975,  5871, 8916, 2868],
      [ 1951, 10048, 2060, 6171],
      [ 8010, 16145, 8090, 8045],
      [ 1013,   990,  940, 6907]
    ];
    var myChord = chord({ container: "body" });

    myChord(matrix);

    setInterval(function() {
      matrix.forEach(function(row, idx) {
        row.forEach(function(_, jdx) {
          row[idx] = Math.random() * 3000 * (jdx + 1);
        });
      });
      myChord(matrix);
    }, 1500);

  }, false);

}(this));
