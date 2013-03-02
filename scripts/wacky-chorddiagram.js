d3.chart("WackyChord", {

  initialize: function() {
    var colors = ["#000000", "#FFDD89", "#957244", "#F26223"];
    var radius = 200;
    var barHeight = radius / 3;
    var barWidth = radius * 2;

    var chord = this.chord = this.mixin(this.base.append("g"), "Chord");
    var bc = this.bc = this.mixin(this.base.append("g"), "FadingBarChart", { opt: 2 });

    this.base.attr("width", chord.base.attr("width"));
    this.base.attr("height", chord.base.attr("height"));

    chord.setRadius(radius);
    chord.layers.ticks.on("enter", function() {
      this.each(function(data, idx, group) {
        d3.select(this).attr("fill", colors[group]);
      });
    });

    bc.width(barWidth);
    bc.height(barHeight);
    bc.base.attr("transform",
      "translate(" +
        (this.base.attr("width")/2) +
        "," +
        (this.base.attr("height")/2 + radius - barHeight) +
      ")");
    bc.layers.bars.on("exit:transition", function() {
      this.attr("x", null);
      this.attr("width", 0);
    });
    bc.layers.bars.on("update:transition", function() {
      this.attr("x", null);
      this.attr("transform", function(d, i) {
        return "rotate(" + (-360*i/bc.data.length) + ",0," + (barHeight-radius) + ")";
      });
    });
  }

});
