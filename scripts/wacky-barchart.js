d3.chart("WackyBC", {

  initialize: function(options) {

    this.mixin("bc", "BarChart", options);
    this.base.attr("width", this.bc.base.attr("width"));
    this.base.attr("height", this.bc.base.attr("height"));

    this.bc.layers.bars.on("update:transition", function(updating) {
      updating.attr("height", Math.random()*10 + 20);
    });

  }
});
