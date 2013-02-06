window.WackyBC = d3.chart({

  mixins: {
    barchart: window.Barchart
  },

  initialize: function(options) {

    this.barchart.layers.bars.on("update:transition", function(updating) {
      updating.attr("height", Math.random()*10 + 20);
    });

  }
});
