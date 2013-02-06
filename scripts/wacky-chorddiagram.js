window.WackyChord = d3.chart({

  mixins: {
    chord: window.Chord,
    nsd: window.Barchart
  },

  initialize: function() {
    var colors = ["#000000", "#FFDD89", "#957244", "#F26223"];

    this.chord.layers.ticks.on("enter", function() {
      this.each(function(data, idx, group) {
        d3.select(this).attr("fill", colors[group]);
      });
    });

    this.nsd.layers.bars.on("enter", function() {
      console.log("YO!", this);
      this.attr("transform", function(d, i) {
        console.log(d,i);
        return "translate(300,-200)rotate(" +(i/33)*360+ ")";
      });
    });

  }

});
