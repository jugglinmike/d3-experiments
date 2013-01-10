(function(window, undefined) {

  "use strict";

  var Chords = Rc.extend({
    dataBind: function(data) {
      return this.base.selectAll("path").data(data);
    },
    insert: function(entering) {
      return entering.append("path");
    },
    events: {
      enter: function(entering) {
        var self = this;

        entering.attr("d", d3.svg.chord().radius(this.options.innerRadius))
            .style("fill", function(d) {
              return self.options.fill(d.target.index);
            })
            .style("opacity", 1);
      }
    }
  });

  var Ticks = Rc.extend({
    dataBind: function(data) {
      return this.base.selectAll("g").data(data);
    },
    insert: function(entering) {
      return entering.append("g");
    },
    events: {
      enter: function(entering) {
        var self = this;
        var tickGroup = entering.selectAll("g")
            .data(this.group)
          .enter().append("g");

        tickGroup.attr("transform", function(d) {
              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                  + "translate(" + self.options.outerRadius + ",0)";
            });

        tickGroup.append("line")
          .attr("x1", 1)
          .attr("y1", 0)
          .attr("x2", 5)
          .attr("y2", 0)
          .style("stroke", "#000");

        tickGroup.append("text")
          .attr("x", 8)
          .attr("dy", ".35em")
          .attr("transform", function(d) {
            return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
          })
          .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
          .text(function(d) { return d.label; });

      }
    },
    // Returns an array of tick angles and labels, given a group.
    group: function(d) {
      var k = (d.endAngle - d.startAngle) / d.value;
      return d3.range(0, d.value, 1000).map(function(v, i) {
        return {
          angle: v * k + d.startAngle,
          label: i % 5 ? null : v / 1000 + "k"
        };
      });
    }
  });

  // Handles
  // A group defining the colored margins that encircle the chart.
  var Handles = Rc.extend({
    dataBind: function(data) {
      return this.base.selectAll("path").data(data);
    },
    insert: function(entering) {
      return entering.append("path");
    },
    events: {
      enter: function(entering) {
        var self = this;
        var path = d3.svg.arc()
          .innerRadius(this.options.innerRadius)
          .outerRadius(this.options.outerRadius);

        entering.style("fill", function(d) { return self.options.fill(d.index); })
            .style("stroke", function(d) { return self.options.fill(d.index); })
            .attr("d", path)
            .on("mouseover", this.fade(.1))
            .on("mouseout", this.fade(1));
      }
    },
    // Returns an event handler for fading a given chord group.
    fade: function(opacity) {
      var self = this;
      return function(g, i) {
        self.base.selectAll(".chords path")
            .filter(function(d) { return d.source.index != i && d.target.index != i; })
          .transition()
            .style("opacity", opacity);
      };
    }
  });

  var dfltOpts = {
    width: 960,
    height: 500,
    container: "body"
  };

  function chord(options) {

    var svg, chordLayout;

    options = _.defaults(options, dfltOpts);
    options.innerRadius = Math.min(options.width, options.height) * 0.41;
    options.outerRadius = options.innerRadius * 1.1;
    options.fill = d3.scale.ordinal()
        .domain(d3.range(4))
        .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

    svg = d3.select(options.container).append("svg")
        .attr("width", options.width)
        .attr("height", options.height)
      .append("g")
        .attr("transform", "translate(" + options.width / 2 + "," + options.height / 2 + ")");
    chordLayout = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)

    var ticks = new Ticks(options, {
      base: svg.append("g").attr("class", "ticks")
    });
    var handles = new Handles(options, {
      base: svg.append("g").attr("class", "events")
    });
    var chords = new Chords(options, {
      base: svg.append("g").attr("class", "chords")
    });

    return function(matrix) {

      chordLayout.matrix(matrix);
      svg.selectAll("g").selectAll("g, path").remove();

      handles.draw(chordLayout.groups);
      ticks.draw(chordLayout.groups);
      chords.draw(chordLayout.chords);

    };
  }

  // Expose "constructor" to global scope
  window.chord = chord;

}(this));
