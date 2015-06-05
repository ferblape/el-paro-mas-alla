var Lines = function(session){

  var margin = {top: 80, right: 200, bottom: 70, left: 40},
    //width = 1200 - margin.left - margin.right,
    width = d3.select('#one').node().getBoundingClientRect().width - margin.left,
    height = 600 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%Y").parse;

  var x = d3.time.scale()
      .range([0, width-80]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
              .range(["#708259", "#3EB79E", "#3EA889", "#C8E99C", "#C8E99C", "#C8E99C", "#A4BF81", "#C8E99C", "#C8E99C", "#3F9975", "#BD2D28", "#BD2D28", "#BD2D28", "#BD2D28", "#BD2D28", "#BD2D28", "#E3BA22", "#E3BA22"])
              .domain(["ocupados", "c_propia", "asal_indef", "asal_temp", "asal_parc_inv", "asal_comp", "parados", "para_b_4mas_a", "para_b_2a4a", "para_b_1a2a", "para_b_6ma1a", "para_b_menos6m", "inactivos", "inac_desanim"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSubdivide(0)
      .tickSize(0-width);

  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.porcentaje); });

  var svgLines = d3.select('#line_chart').append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var line_charts = {
    ocupados:   ["ocupados", "asal_indef", "asal_temp", "asal_temp_parc", "asal_temp_parc_inv", "asal_temp_comp", "asal_indef_parc", "asal_indef_parc_inv", "asal_indef_comp"],
    parados:    ["parados", "para_b_4mas_a", "para_b_2a4a", "para_b_1a2a", "para_b_6ma1a", "para_b_menos6m"],
    inactivos:  ["inactivos", "inac_desanim", "inactivos"],
  };

  var niceCategory = {
    ocupados: "Ocupados",
    c_propia: "Cuenta propia",
    asal_temp: "Contrato temporal",
    asal_indef: "Contrato indefinido",
    asal_parc: "J. parcial",
    asal_parc_inv: "J. parcial involuntaria",
    asal_comp: "J. completa",
    parados: "Parados",
    para_b_4mas_a: "4 años o más",
    para_b_2a4a: "de 2 a 4 años",
    para_b_1a2a: "de 1 a 2 años",
    para_b_6ma1a: "de 6 meses a 1 año",
    para_b_menos6m: "menos de 6 meses",
    inactivos: "Inactivos",
    inac_desanim: "Inactivos desanimados"
  }

  d3.csv("assets/data/df_agrupado_new.csv?987", function(error, rawData) {

    // Format the data
    rawData.forEach(function(d) {
      d.year = parseDate(d.year);
      d.porcentaje = +d.porcentaje;
      d.count = +d.count;
    });


    
    var situations = d3.set(rawData.map(function(d) { return d.situation; })).values();

    // Set up the domains
    x.domain(d3.extent(rawData, function(d) { return d.year; }));
    y.domain([0, 1]);
   
   console.log(situations)
    var fuera = ["total", "asalariados", "activos"]
    data = rawData.filter(function(d) { return fuera.indexOf(d.situation) == -1; })

    data.sort(function(a,b){
      return a.year - b.year
    });

    var data_ccaa = data.filter(function(d) { return d.codigo == session.get('autonomousRegion'); });
        console.log(data_ccaa)

    var nested_data_ccaa = d3.nest()
                        .key(function(d) { return d.situation; })
                        .entries(data_ccaa);

    

    var data_esp = data
                    .filter(function(d) { return d.codigo === "0"; });

    var nested_data_esp = d3.nest()
                        .key(function(d) { return d.situation; })
                        .entries(data_esp);

    console.log(nested_data_esp);

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
  var lines_ccaa = svgLines.selectAll(".lines.ccaa")
      .data(nested_data_ccaa)
    .enter().append("g")
      .attr("class", "lines ccaa");


  lines_ccaa.append("path")
      .attr("class", "line ccaa")
      .attr("id", function(d){ return d.key;})
      .attr("d", function(d) { return line(d.values); })
      .style('fill', 'none')
      .style("opacity", function(d) {
        if (d.key === "parados" || d.key === "ocupados" || d.key === "inactivos") {
          return 1;
        } else {
          return 0;
        }
       })
      .style("stroke", function(d) { return d3.rgb(color(d.key)).darker(.5); })
      .style("stroke-width", function(d) {return d.key !== "ocupados" ? 2 : 3});

  var lines_esp = svgLines.selectAll(".lines.esp")
      .data(nested_data_esp)
    .enter().append("g")
      .attr("class", "lines esp");

  lines_esp.append("path")
      .attr("class", "line esp")
      .attr("id", function(d){ return d.key;})
      .attr("d", function(d) { console.log(d);return line(d.values); })
      .style('fill', 'none')
      .style("opacity", function(d) {
        if (d.key === "parados" || d.key === "ocupados" || d.key === "inactivos") {
          return 1;
        } else {
          return 0;
        }
       })
      .style("stroke", function(d) { return d3.rgb(color(d.key)).darker(.5); })
      .style("stroke-width", 2)
      .style("stroke-dasharray", ("8,8"));


  // Add the legend.

  var legendScale = d3.scale.ordinal()
                      .rangeBands([-margin.top, height + margin.top], 0.1)
                      .domain(color.domain()); 

  console.log(nested_data_ccaa);
  console.log(legendScale.domain().length);
  console.log(nested_data_ccaa.length);

  var legend = svgLines.selectAll(".legend")
      .data(nested_data_ccaa)
      .enter().append("g")
      .attr('transform', 'translate(' + (width-20) + ',' + 0 + ')')
      .attr("class", "legend");

  legend.append("rect")
    .attr("id", function(d){ return d.key})
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("x", 0)
    .attr("y", function(d,i) {return legendScale(d.key)})
    .attr("width", 150)
    .attr("height", legendScale.rangeBand())
    .attr("class", "legend")
    .attr('text-anchor', "middle")
    .style("fill", function(d) {return color(d.key)})
    .style("stroke", function(d) { return d3.hsl(color(d.key)).darker(1.2); })
    .style("stroke-width", function(d) {
        if (d.key === "parados" || d.key === "ocupados" || d.key === "inactivos") {
          return 3;
        } else {
          return 0;
        }
       })
    .on("click", function(d){
        // Determine if current line is visible 
        var active   = d.active ? false : true; 
        var newOpacity = active ? 1 : 0;
        var newStroke = active ? 3 : 0;
        // Hide or show the elements based on the ID
        d3.selectAll("#"+d.key+".line")
            .transition().duration(200)
            .style("opacity", newOpacity);
        legend.selectAll("#"+d.key)
            .transition().duration(200)
            .style("stroke-width", newStroke);
        // Update whether or not the elements are active
        d.active = active;
    });             
               

  legend.append("text")
    // .filter(function(d) {return d.name !== "CAD-Europa";})
    .attr("x", 75)
    .attr("y", function(d,i) {return legendScale(d.key)+(legendScale.rangeBand()/2)})
    .attr("class", "legend")
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("dy", ".3em")
    .style("font-size", "70%")
    // .attr('vertical-align', 'middle')

    .text(function(d) {return niceCategory[d.key]})
    .on("click", function(d){
        // Determine if current line is visible 
        var active   = d.active ? false : true; 
        var newOpacity = active ? 1 : 0;
        var newStroke = active ? 3 : 0;

        // Hide or show the elements based on the ID
        d3.selectAll("#"+d.key+".line")
            .transition().duration(200)
            .style("opacity", newOpacity);
        legend.selectAll("#"+d.key)
            .transition().duration(200)
            .style("stroke-width", newStroke);
        // Update whether or not the elements are active
        d.active = active;
    }); 

  });
}
