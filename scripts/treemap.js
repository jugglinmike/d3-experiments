// TreeMap
// A generic treemap based on the example built for d3.js
// http://mbostock.github.com/d3/talk/20111018/treemap.html
(function(window, undefined) {

  var TM = window.TreeMap = Rc.extend({

    defaults: {
      container: "body",
      width: 400,
      height: 300
    },

    initialize: function(options) {

      var self = this;

      this.map = d3.layout.treemap()
        .round(false)
        .size([this.options.width, this.options.height])
        .sticky(true)
        .value(function(d) { return d.size; });

      this.x = d3.scale.linear().range([0, this.options.width]);
      this.y = d3.scale.linear().range([0, this.options.height]);
      this.color = d3.scale.category20c();

      this.chart = d3.select(this.options.container)
        .append("div")
          .attr("class", "chart")
          .style("width", this.options.width + "px")
          .style("height", this.options.height + "px")
          .append("svg:svg")
            .attr("width", this.options.width)
            .attr("height", this.options.height)
            .append("svg:g")
              .attr("transform", "translate(.5, .5)");

      d3.select(window).on("click", function() { self.zoom(self.root); });
    },

    insert: function(entering) {
      return entering.append("svg:g");
    },

    dataBind: function(data) {
      var nodes = this.map.nodes(data)
        .filter(function(d) { return !d.children; });

      this.node = this.root = data;

      return this.chart.selectAll("g").data(nodes);
    },

    events: {
      enter: function(entering) {
        var self = this;

        entering
          .attr("class", "cell")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
          .on("click", function(d) {
            if (self.node === d.parent) {
              self.zoom(self.root);
            } else {
              self.zoom(d.parent);
            }
          });

        entering.append("svg:rect")
          .attr("width", function(d) { return d.dx - 1; })
          .attr("height", function(d) { return d.dy - 1; })
          .style("fill", function(d) { return self.color(d.parent.name); });

        entering.append("svg:text")
          .attr("x", function(d) { return d.dx / 2; })
          .attr("y", function(d) { return d.dy / 2; })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.name; })
          .style("opacity", function(d) {
            d.w = this.getComputedTextLength();
            return d.dx > d.w ? 1 : 0;
          });
      }
    },

    zoom: function(d) {
      var self = this;
      var kx = this.options.width / d.dx;
      var ky = this.options.height / d.dy;
      var t;

      this.x.domain([d.x, d.x + d.dx]);
      this.y.domain([d.y, d.y + d.dy]);

      t = this.chart.selectAll("g.cell").transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .attr("transform", function(d) {
          return "translate(" + self.x(d.x) + "," + self.y(d.y) + ")";
        });

      t.select("rect")
        .attr("width", function(d) { return kx * d.dx - 1; })
        .attr("height", function(d) { return ky * d.dy - 1; })

      t.select("text")
        .attr("x", function(d) { return kx * d.dx / 2; })
        .attr("y", function(d) { return ky * d.dy / 2; })
        .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

      this.node = d;
      d3.event.stopPropagation();
    }

  });

}(this));
