var randomBars = function(session){

  var data, rawData,
      cols = 15;

  var format = d3.time.format("%Y").parse;

  var margin = { top: 0, right: 10, bottom: 0, left: 10 },
      width = 960 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .2);
  var yScale = d3.scale.linear().range([0, height]);

  var color = d3.scale.ordinal()
                .range(["#aed292", "#ed9391", "#fcde8a"])
                .domain(["ocupados", "parados", "inactivos"]);

  var svgBars = d3.select('#random_bars').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',0)');


  var niceCategory = {
    ocupados: "Ocupados",
    parados: "Parados",
    inactivos: "Inactivos",
  }

  d3.csv("assets/data/df_per.csv?1", function(error, csvData) {
    rawData = csvData;
    data = rawData
            .filter(function(d) { return d.year == '2015'; })
            .filter(function(d) { return d.codigo == session.get('autonomousRegion'); })
            .filter(function(d) { return d.edad == session.get('age'); })
            .filter(function(d) { return d.sexo == session.get('sex'); });

    var levelVariables = ['ocupados', 'parados', 'inactivos'];

    var data_n = data.filter(function(d) { return levelVariables.indexOf(d.situation) != -1; });

    data_n.forEach(function(d) {
      d.count = +d.count;
      d.porcentaje = +d.porcentaje
    });

    xScale.domain(levelVariables);
    yScale.domain([0, d3.max(rawData, function(d) { return d.porcentaje*500; })]);

    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .tickFormat(function(d) { return niceCategory[d]; })
                    .orient('bottom');

    svgBars.selectAll('a.axis')
        .data(data_n)
        .enter()
        .append('a')
          .attr("class", function(d){return 'n1 axis ' + d.situation; })
          .attr('id', function(d) { return d.situation; } )
          .attr("xlink:href", '#bolitas_n2')
          .style('position', 'absolute')
          .style('left', function(d) { return xScale(d.situation) + margin.left + "px"; })
          .style('margin-top', height + margin.top + "px")
          .style('width', xScale.rangeBand() - margin.left + 'px')
          .html(function(d) { return niceCategory[d.situation] + ' ' + (Math.floor(d.porcentaje * 100)) + '%'; });

    var random1 = (Math.random() * .4) + .2,  
        random2 = (Math.random() * .4) + .2,
        random3 = 1 - (random1 + random2);

    var random_data = [random1, random2, random3]

    svgBars.selectAll('.random')
      .data(random_data)
      .enter()
      .append('rect')
      .attr('class', 'random')
      .attr('x', function(d,i) { return xScale.range()[i]; })
      .attr('width', xScale.rangeBand())
      .attr('y', function(d) { return height - yScale(d * 500); })
      .attr('height', height)
      .attr('fill', function(d, i) { return color.range()[i]; });

    svgBars.selectAll('.randomLabel')
      .data(random_data)
      .enter()
      .append('text')
      .attr('class', 'randomLabel')
      .attr('x', function(d,i) { return xScale.range()[i] + xScale.rangeBand()/2; })
      .attr('y', function(d) { return height - yScale(d * 500) + 15; })
      .attr('fill', "#fff")
      .text(function(d,i) { return  levelVariables[i] + " " + Math.round(d * 100) + "%"; });

    var hlines = svgBars.selectAll('.hlines')
      .data(data_n)
      .enter().append('g')
      .attr('class', 'hlines');

    hlines.append("line")
        .attr("class","hline")
        .attr("x1", function(d) { return xScale(d.situation); })
        .attr("y1", function(d,i){return height - yScale(d.porcentaje * 500)})
        .attr("x2", function(d,i){return xScale(d.situation) + xScale.rangeBand()})
        .attr("y2", function(d,i){return height - yScale(d.porcentaje * 500)})
        .style("stroke", "#2c3e50")
        .style("stroke-dasharray", ("4,4"))
        .style("stroke-width", 1.75);
    
    hlines.append("text")
      .attr("class","real-label")
      .attr("x", function(d) { return xScale(d.situation) + (xScale.rangeBand() / 2); })
      .attr("y", function(d,i){return height - yScale(d.porcentaje * 500) - 10})
      .attr("text-anchor", "middle")
      .attr("dy", 3)
      .attr("dx", "0.2em")
      .style("fill", "#424242")
      .text(function(d) { return "Valor real de " + d.situation + " " + d.porcentaje * 100 + "%"; });
    
  });
  
}
