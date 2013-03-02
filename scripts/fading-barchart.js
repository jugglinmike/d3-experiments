d3.chart("BarChart").extend("FadingBarChart", {

  initialize: function(options) {

    this.layers.bars.on("update:transition", function() {
      this.attr("opacity", function(d, i) { return i/32; });
    });

  }
});
