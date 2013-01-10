(function(window, undefined) {

function chord(options) {

  var width = 960,
      height = 500,
      innerRadius = Math.min(width, height) * .41,
      outerRadius = innerRadius * 1.1;
  var svg = d3.select(options.container).append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  var chordLayout = d3.layout.chord()
      .padding(.05)
      .sortSubgroups(d3.descending)
  var fill = d3.scale.ordinal()
      .domain(d3.range(4))
      .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

  var Ticks = Rc.extend({
    dataBind: function(data) {
      return this.base.selectAll("g").data(data);
    },
    insert: function(entering) {
      return entering.append("g");
    },
    events: {
      enter: function(entering) {
        var tickGroup = entering.selectAll("g")
            .data(this.group)
          .enter().append("g");

        tickGroup.attr("transform", function(d) {
              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                  + "translate(" + outerRadius + ",0)";
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

  var Handles = Rc.extend({
    dataBind: function(data) {
      return this.base.selectAll("path").data(data);
    },
    insert: function(entering) {
      return entering.append("path");
    },
    events: {
      enter: function(entering) {
        entering.style("fill", function(d) { return fill(d.index); })
            .style("stroke", function(d) { return fill(d.index); })
            .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
            .on("mouseover", this.fade(.1))
            .on("mouseout", this.fade(1));
      }
    },
    // Returns an event handler for fading a given chord group.
    fade: function(opacity) {
      return function(g, i) {
        svg.selectAll(".chords path")
            .filter(function(d) { return d.source.index != i && d.target.index != i; })
          .transition()
            .style("opacity", opacity);
      };
    }
  });

  var Chords = Rc.extend({
    dataBind: function(data) {
      return this.base.selectAll("path").data(data);
    },
    insert: function(entering) {
      return entering.append("path");
    },
    events: {
      enter: function(entering) {
        entering.attr("d", d3.svg.chord().radius(innerRadius))
            .style("fill", function(d) { return fill(d.target.index); })
            .style("opacity", 1);
      }
    }
  });

  var ticks = new Ticks({ base: svg.append("g").attr("class", "ticks") });
  var handles = new Handles({ base: svg.append("g").attr("class", "events") });
  var chords = new Chords({ base: svg.append("g").attr("class", "chords") });

  return function(matrix) {

    chordLayout.matrix(matrix);
    svg.selectAll("g").selectAll("g, path").remove();

    handles.draw(chordLayout.groups);
    ticks.draw(chordLayout.groups);
    chords.draw(chordLayout.chords);

  }

}

window.chord = chord;

}(this));
