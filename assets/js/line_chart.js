var Lines = function(session){

  var margin = {top: 80, right: 140, bottom: 70, left: 60},
    width = 750 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y").parse;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
              .range(["#BD2D28", "#E3BA22", "#708259", "#E6842A", "#137B80", "#8E6C8A", "#b9c1ab"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSubdivide(0)
      .tickSize(0-width);


  var line = d3.svg.line()
      .interpolate("linear")
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.porcentaje); });

  var svgLines = d3.select('#line_chart').append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("assets/data/df_per.csv", function(error, rawData) {

    // Format the data
    rawData.forEach(function(d) {
      d.year = parseDate(d.year);
      d.porcentaje = +d.porcentaje;
      d.count = +d.count;
    });
    
    var situations = d3.set(rawData.map(function(d) { return d.situation; })).values();

    // Set up the domains
    color.domain(situations)
    x.domain(d3.extent(rawData, function(d) { return d.year; }));
    y.domain([0, 1]);
   

    data = rawData
              .filter(function(d) { return d.codigo == session.get('autonomousRegion'); })
              .filter(function(d) { return d.edad == session.get('age'); });

    data.sort(function(a,b){
      return a.year - b.year
    });

    var nested_data = d3.nest()
                        .key(function(d) { return d.situation; })
                        .entries(data);

    // Draw the axis  
    svgLines.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + 5) + ")")
        .call(xAxis);

    svgLines.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "yTitle")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-3em")
        .style("text-anchor", "end")
        .style("fill", "black")
        .text("%"); 

    // Draw the lines
    var lines = svgLines.selectAll(".lines")
        .data(nested_data)
      .enter().append("g")
        .attr("class", "lines");


  lines.append("path")
      .attr("class", "line total")
      .attr("id", function(d){ return d.situation;})
      .attr("d", function(d) { console.log(d.values);return line(d.values); })
      .style('fill', 'none')
      // .style("opacity", function(d) {
      //   if (d.situation === "parados" || d.situation === "ocupados") {
      //     return 1;
      //   } else {
      //     return 0;
      //   }
      //  })
      .style("stroke", function(d) { return d3.rgb(color(d.situation)).darker(.5); })
      .style("stroke-width", function(d) {return d.situation !== "ocupados" ? 3 : 4})
      .style("stroke-dasharray",  function(d) {return d.situation !== "ocupados" ? ("0,0") : ("10,10");});

  });
}