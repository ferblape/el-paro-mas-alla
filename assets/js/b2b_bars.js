var margin = { top: 80, right: 10, bottom: 10, left: 10 },
    width = 460 - margin.left - margin.right,
    height = 440 - margin.top - margin.bottom,
    padding = 25;
    
var parseDate = d3.time.format("%Y").parse;
var xScale = d3.scale.linear().range([0, width/2 - padding]);
var yScale = d3.scale.ordinal().rangeRoundBands([0, height - margin.top], .2);

d3.csv("assets/data/epa_0615.csv" ,function(error, data) {

  data.forEach(function(d) {
    d.value = +d.value;
    // d.year = parseDate(d.year);
    d.year = +d.year
  });

  var years = d3.set(
            data.map(function(d){ return +d.year; })
          ).values();
  years.sort(function(a, b){ return d3.ascending(a, b); });

  var parados = data.filter(function(d) { return (d.variable == "parados" || d.variable == "parados_sepe") && d.ccaa == "Nacional"; });

  parados.sort(function(a, b){ return d3.ascending(a.year, b.year); });
  
  xScale.domain([0, d3.max(parados.filter(function(d) { return d.variable == "parados"; }), function(d) { return d.value;})])
  yScale.domain(years)

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('right');
  
  var svgBars = d3.select("#bars")
    .append("svg")
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  svgBars.append('g')
      .attr("class", "y axis")
      .attr("transform", "translate(" + (width/2 - padding) + "," + margin.top + ")")
      .call(yAxis);

  svgBars.selectAll('rect.sepe-bars')
    .data(parados.filter(function(d) { return d.variable == "parados_sepe"; }))
    .enter()
    .append('rect')
    .attr('x', function(d) { return (width/2 - padding) - xScale(d.value); })
    .attr('width', function(d) { return xScale(d.value); })
    .attr('y', function(d) { return yScale(d.year) + margin.top; })
    .attr('height', yScale.rangeBand())
    .attr('fill', '#83d3c9')
    .attr('opacity', .5);

  svgBars.selectAll('rect.epa-bars')
    .data(parados.filter(function(d) { return d.variable == "parados"; }))
    .enter()
    .append('rect')
    .attr('x', function(d) { return width/2 + padding; })
    .attr('width', function(d) { return xScale(d.value); })
    .attr('y', function(d) { return yScale(d.year) + margin.top; })
    .attr('height', yScale.rangeBand())
    .attr('fill', '#83d3c9')
    .attr('opacity', .8);

  var barsTitle = svgBars.append('g')
      .attr("class", "bars-title");
      
  barsTitle.selectAll('text.title')
  .append(text)
  .text('pepepepepepepepeppepe')



  // .append("g")
  // .attr('class', 'sepe-bars')
  // .append('g')
  // .attr('class', 'epa-bars')
  // .attr('transform', 'translate(' + width/2 + ',0)' );

  var year_2015 = parados.filter(function(d) { return d.year == years[0]; })



});