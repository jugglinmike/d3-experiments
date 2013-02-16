d3.chart("BarChart", {

  width: function(width) {
    if (!arguments.length) {
      return this.w;
    }
    this.w = width;
    this.base.attr("width", width);
    this.x.range([0, width]);
    return this;
  },

  height: function(height) {
    if (!arguments.length) {
      return this.h;
    }
    this.h = height;
    this.base.attr("height", height);
    this.y.rangeRound([0, height]);
    return this;
  },

  initialize: function(options) {
    var svg,
      chart = this,
      t = 1297110663, // start time (seconds since epoch)
      v = 70, // start value (subscribers)
      data = d3.range(33).map(next); // starting dataset

    function next() {
      return {
        time: ++t,
        value: v = ~~Math.max(10, Math.min(90, v + 10 * (Math.random() - .5)))
      };
    }

    options = options || {};

    this.x = d3.scale.linear()
      .domain([0, data.length]);
    this.y = d3.scale.linear()
      .domain([0, 100])

    this.width(options.width || 600);
    this.height(options.height || 80);

    var svg = this.base
      .attr("class", "chart");

    function onEnter() {
      this.attr("x", function(d, i) { return chart.x(i + 1) - .5; })
          .attr("y", function(d) { return chart.height() - chart.y(d.value) - .5; })
          .attr("width", chart.width() / this.data().length )
          .attr("height", function(d) { return chart.y(d.value); })
    }

    function onEnterTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(i) - .5; });
    }

    function onTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(i) - .5; });
    }

    function onExitTrans() {
      this.duration(1000)
          .attr("x", function(d, i) { return chart.x(i - 1) - .5; })
          .remove();
    }

    // This bar chart manages its own data outside of the framework, so we'll
    // ignore the data passed to the `dataBind` method. It wouldn't take much
    // to make this implementation a little more intuitive, though.
    function dataBind(_) {

      return this.selectAll("rect")
        .data(data, function(d) { return d.time; });
    }

    function insert() {
      return this.append("rect");
    }

    this.layers.bars = svg.layer({
      dataBind: dataBind,
      insert: insert
    });

    this.layers.bars.on("enter", onEnter);
    this.layers.bars.on("enter:transition", onEnterTrans);
    this.layers.bars.on("update:transition", onTrans);
    this.layers.bars.on("exit:transition", onExitTrans);

    this.data = data;
    this.next = next;

  }

});
