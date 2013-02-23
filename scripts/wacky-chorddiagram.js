d3.chart("WackyChord", {

  initialize: function() {
    var colors = ["#000000", "#FFDD89", "#957244", "#F26223"];
    var radius = 200;

    var chord = this.chord = this.base.append("g").mixin("Chord");
    var bc = this.bc = this.base.append("g").mixin("BarChart", { opt: 2 });

    this.base.attr("width", chord.base.attr("width"));
    this.base.attr("height", chord.base.attr("height"));

    chord.setRadius(radius);
    chord.layers.ticks.on("enter", function() {
      this.each(function(data, idx, group) {
        d3.select(this).attr("fill", colors[group]);
      });
    });

    bc.base.attr("transform", "translate(480,130),rotate(180)");
    bc.width(400);
    bc.layers.bars.on("enter", function() {
      this.attr("opacity", 0);
    });
    bc.layers.bars.on("enter:transition", function() {
      this.duration(1000).attr("opacity", 1);
    });
    bc.layers.bars.on("exit:transition", function() {
      this.attr("x", null);
      this.attr("width", 0);
    });
    bc.layers.bars.on("update:transition", function() {
      this.attr("x", null);
      this.duration(1000).attr("opacity", 1);
      this.attr("transform", function(d, i) {
        return "rotate(" + (-360*i/bc.data.length) + ",0," + (-radius/1.65) + ")";
      });
    });

  }

});
