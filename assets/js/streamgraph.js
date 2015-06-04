var n = 20, // number of layers
    m = 200, // number of samples per layer
    stack = d3.layout.stack().offset("wiggle"),
    layers0 = stack(d3.range(n).map(function() { return bumpLayer(m); })),
    layers1 = stack(d3.range(n).map(function() { return bumpLayer(m); }));

console.log(layers0)
var width = 960,
    height = 500;

var x = d3.scale.linear()
    .domain([0, m - 1])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, d3.max(layers0.concat(layers1), function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
    .range([height, 0]);

var color = d3.scale.linear()
    .range(["#aad", "#556"]);

var area = d3.svg.area()
    .x(function(d) { return x(d.x); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.selectAll("path")
    .data(layers0)
  .enter().append("path")
    .attr("d", area)
    .style("fill", function() { return color(Math.random()); });

function transition() {
  d3.selectAll("path")
      .data(function() {
        var d = layers1;
        layers1 = layers0;
        return layers0 = d;
      })
    .transition()
      .duration(2500)
      .attr("d", area);
}

// Inspired by Lee Byron's test data generator.
function bumpLayer(n) {

  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = 0;
  for (i = 0; i < 5; ++i) bump(a);
  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
}


d3.csv("assets/data/epa_0615_per.csv", function(error, data) {
  var format = d3.time.format("%Y").parse;
  
  data.forEach(function(d) {
    d.value = +d.value;
    d.porcentaje = +d.porcentaje;
  })

  var plot = ["menores", "inactivos", "ocupados", "parados"]
  
  data = data.filter(function(d) { return d.ccaa != "Nacional"; })
  data = data.filter(function(d) { return d.year == "2015"; })
  // data = data.filter(function(d) { return plot.indexOf(d.variable) != -1 });

  // data.sort(function(a,b){
  //   return format(a.year) - format(b.year)
  // });

  var ccaa = d3.set(
                data.map(function(d){ return d.ccaa; })
              ).values()

  var variables = d3.set(
        data.map(function(d){ return d.variable; })
      ).values();

  var m = ccaa.length;
  var n = variables.length;
  console.log(data)

  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0).domain(ccaa);
  var yScale = d3.scale.linear().range([height, 0]);
  var colora = d3.scale.ordinal().domain(variables).range(["#c5c8e3", "#ffdf4d", "#81bb5f", "#e85c63"]);


  var dataStream = d3.nest()
                    .key(function(d) { return d.variable; })
                    .entries(data);

  var stack = d3.layout.stack()
    .offset("zero") // just make one change here
    .values(function (d) { return d.values; })
    .x(function (d) { return xScale(d.ccaa)})
    .y(function (d) { return d.porcentaje; });

  var layers = stack(dataStream);

  
  var area = d3.svg.area()
    .x(function(d) { return xScale(d.ccaa); })
    .y0(function(d) { return yScale(d.y0); })
    .y1(function(d) { return yScale(d.y0 + d.y); });

  yScale.domain([0, d3.max(dataStream, function (c) { 
      return d3.max(c.values, function (d) { return d.y0 + d.y; });
    })]);

  var svg = d3.select("#streamgraph").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.selectAll("path")
      .data(layers)
    .enter().append("path")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d) { console.log(d); return colora(d.key); });



});
