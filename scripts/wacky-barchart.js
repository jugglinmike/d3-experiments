window.WackyBC = d3.chart({

  initialize: function(options) {

    this.mixin("barchart", new window.Barchart(options));
    this.base.attr("width", this.barchart.base.attr("width"));
    this.base.attr("height", this.barchart.base.attr("height"));

    this.barchart.layers.bars.on("update:transition", function(updating) {
      updating.attr("height", Math.random()*10 + 20);
    });

  }
});
