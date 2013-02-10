window.Chord = d3.chart({

  width: function(width) {
    if (arguments.length === 0) {
      return this._w;
    }
    this._w = width;
    this.setRadius();
    return this;
  },

  height: function(height) {
    if (arguments.length === 0) {
      return this._h;
    }
    this._h = height;
    this.setRadius();
    return this;
  },

  radius: function() {
    return { inner: this.innerRadius, outer: this.outerRadius };
  },
  setRadius: function(radius) {
    radius = radius || (Math.min(this.width(), this.height()) * 0.41);
    this.outerRadius = radius;
    this.innerRadius = radius / 1.1;
    return this;
  },

  initialize: function(options) {

    options = options || {};

    var chart = this;
    this.width(options.width || 960);
    this.height(options.height || 500);
    this.setRadius();

    var fill = d3.scale.ordinal()
        .domain(d3.range(4))
        .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

    this.base.attr("width", this.width())
        .attr("height", this.height())
        .attr("transform", "translate(" + this.width() / 2 + "," + this.height() / 2 + ")");

    this.layers.handles = chart.base.append("g").layer({
      dataBind: function(chord) {
        return this.selectAll("path").data(chord.groups);
      },
      insert: function() {
        return this.append("path");
      }
    });
    this.layers.handles.on("enter", function() {
      this.style("fill", function(d) { return fill(d.index); })
          .style("stroke", function(d) { return fill(d.index); })
          .attr("d", d3.svg.arc().innerRadius(chart.radius().inner).outerRadius(chart.radius().outer))
          .on("mouseover", chart.fade(.1))
          .on("mouseout", chart.fade(1));
    });

    this.layers.ticks = this.base.append("g").layer({
      dataBind: function(chord) {
        return this.selectAll("g")
            .data(chord.groups)
          .enter().append("g").selectAll("g")
            .data(chart.groupTicks);
      },
      insert: function() {
        return this.append("g");
      }
    });
    this.layers.ticks.on("enter", function() {
      this.attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + chart.radius().outer + ",0)";
          });
      this.append("line")
          .attr("x1", 1)
          .attr("y1", 0)
          .attr("x2", 5)
          .attr("y2", 0)
          .style("stroke", "#000");

      this.append("text")
          .attr("x", 8)
          .attr("dy", ".35em")
          .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
          .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
          .text(function(d) { return d.label; });
    });

    this.layers.chords = chart.base.append("g").attr("class", "chord").layer({
      dataBind: function(chord) {
        return this.selectAll("path").data(chord.chords);
      },
      insert: function() {
        return this.append("path");
      }
    });
    this.layers.chords.on("enter", function() {
      this.attr("d", d3.svg.chord().radius(chart.radius().inner))
          .style("fill", function(d) { return fill(d.target.index); })
          .style("opacity", 1);
    });
  },

  transform: function(matrix) {
    var chordLayout = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);

    return chordLayout;
  },

  // Returns an array of tick angles and labels, given a group.
  groupTicks: function(d) {
    var k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, 1000).map(function(v, i) {
      return {
        angle: v * k + d.startAngle,
        label: i % 5 ? null : v / 1000 + "k"
      };
    });
  },

  // Returns an event handler for fading a given chord group.
  fade: function(opacity) {
    var chart = this;
    return function(g, i) {
      chart.base.selectAll(".chord path")
          .filter(function(d) { return d.source.index != i && d.target.index != i; })
        .transition()
          .style("opacity", opacity);
    };
  }
});
