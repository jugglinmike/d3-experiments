d3.chart("WackyBC", {

  initialize: function(options) {

    this.mixin("BarChart", options);
    this.base.attr("width", this.BarChart.base.attr("width"));
    this.base.attr("height", this.BarChart.base.attr("height"));

    this.BarChart.layers.bars.on("update:transition", function(updating) {
      updating.attr("height", Math.random()*10 + 20);
    });

  }
});
