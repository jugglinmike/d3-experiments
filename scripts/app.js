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
