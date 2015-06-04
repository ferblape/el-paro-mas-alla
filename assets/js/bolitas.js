var Balls = function(){
  var format = d3.time.format("%Y").parse;

  var margin = { top: 20, right: 10, bottom: 20, left: 10 },
      width = 960 - margin.left - margin.right,
      height = 440 - margin.top - margin.bottom;

  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .2);
  var yScale = d3.scale.linear().range([0, height - margin.bottom]);

  var color = d3.scale.ordinal()
                .range(["#aed292", "#ed9391", "#fcde8a", "#e9ea92", "#dedf54"])
                .domain(["ocupados", "parados", "inactivos", "asal_temp", "asal_indef"]);

  var svg1 = d3.select('#bolitas_n1').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',0)');

  var svg2 = d3.select('#bolitas_n2').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var niveles = {ocupados: ["asal_indef", "asal_temp"],
                 asal_temp: ["asal_temp_parc", "asal_temp_parc_inv", "asal_temp_comp"],
                 asal_indef: ["asal_indef_parc", "asal_indef_parc_inv", "asal_indef_comp"],
                 parados: ["para_b_4mas_a", "para_b_2a4a", "para_b_1a2a", "para_b_6ma1a", "para_b_menos6m"],
                 inactivos: ["inac_desanim", "inactivos"] 
                };

  var niceCategory = {ocupados: "Ocupados",
                      asal_temp: "Contrato temporal",
                      asal_indef: "Contrato indefinido",
                      asal_temp_parc: "Jornada parcial",
                      asal_temp_parc_inv: "Jornada parcial involuntaria",
                      asal_temp_comp: "Jornada completa",
                      asal_indef_parc: "Jornada parcial",
                      asal_indef_parc_inv: "Jornada parcial involuntaria",
                      asal_indef_comp: "Jornada completa",
                      parados: "Parados",
                      para_b_4mas_a: "4 años o más",
                      para_b_2a4a: "de 2 a 4 años",
                      para_b_1a2a: "de 1 a 2 años",
                      para_b_6ma1a: "de 6 meses a 1 año",
                      para_b_menos6m: "menos de 6 meses",
                      inactivos: "Inactivos",
                      inac_desanim: "Inactivos desanimados"
                    }



  d3.csv("assets/data/df_per.csv", function(error, data) {
    data = data
            .filter(function(d) { return d.year == "2015"; })
            .filter(function(d) { return d.ccaa == "Andalucía"; })
            .filter(function(d) { return d.edad == "de 30 a 34 años"; });
    
    var n1 = ["ocupados", "parados", "inactivos"];
    var data_n1 = data.filter(function(d) { return n1.indexOf(d.situation) != -1; });

    data_n1.forEach(function(d) {
      d.count = +d.count;
      d.porcentaje = +d.porcentaje
    });

    xScale.domain(n1);
    yScale.domain([0, d3.max(data_n1, function(d) { return d.count/1000; })]);

    var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .tickFormat(function(d) { return niceCategory[d]; })
                    .orient('bottom');

    d3.select('#bolitas_n1').selectAll('a.axis')
        .data(n1)
        .enter()
        .append('a')
          .attr("class", function(d){return 'axis ' + d; })
          .attr('id', function(d) { return d; } )
          .attr("xlink:href", '#bolitas_n2')
          .style('position', 'absolute')
          .style('left', function(d) { return xScale(d) + margin.left + "px"; })
          .style('margin-top', height + margin.top + "px")
          .style('width', xScale.rangeBand() - margin.left + 'px')
          .html(function(d) { return niceCategory[d]; });
   

    
    // generar nuevos datos, un array tan largo como número de bolas quiera, para cada n1 generar un data set   
    n1.forEach(function(situation) {
      var n = data_n1.filter(function(s) { return s.situation == situation; })
      var n_data = new Array(Math.round(n[0].count/1000,0))

      var cols = 15
      var rows = n_data.length/cols

      

      var xBarScale = d3.scale.linear().domain([0,cols]).range([xScale(situation),xScale(situation) + xScale.rangeBand()]).clamp(true);
      var yBarScale = d3.scale.linear().domain([0,rows]).range([height, height - yScale(n_data.length)]).clamp(true);

      svg1.selectAll('circle.n1.' + situation)
          .data(n_data)
          .enter()
          .append('circle')
          .attr('class', 'n1 ' + situation)
          .attr('cx', xScale(situation) + (xScale.rangeBand() / 2))
          .attr('cy', 3)
          .attr('r', xScale.rangeBand()/(cols*2.3))
          .attr('fill', color(situation) )
        .transition()
          .duration(2000)
          .delay(function(d,i) { return 5*i; })
          .attr("cx", function(d,i){return xBarScale(i%cols);})
          .attr("cy", function(d,i){return yBarScale(Math.floor(i/cols));})
      
    });



    d3.select("#ocupados")
      .on("click",function(){
        document.location.href = '#bolitas_n2';

        var selected_circles = d3.selectAll("circle.ocupados");
        var previous_position = xScale("ocupados") + (xScale.rangeBand() / 2)

        selected_circles
        .transition()
          .duration(2000)
          .delay(function(d,i) { return 2*i; })
          .attr('cy', height + 40)
          .attr('cx', previous_position)
        .transition()
          .duration(100)
          .attr('opacity', 0);

        var n2 = ["asal_indef", "asal_temp"];
        var data_n2 = data.filter(function(d) { return n2.indexOf(d.situation) != -1; });
        console.log(data_n2)
        
        var previous_position = xScale("ocupados") + (xScale.rangeBand() / 2)

        n2.forEach(function(situation, i) {
          var n = data_n2.filter(function(s) { return s.situation == situation; })
          var n_data = new Array(Math.round(n[0].count/1000,0))

          var cols = 15
          var rows = n_data.length/cols
          var scale = xScale.range()[n2.indexOf(situation)]

          var xBarScale = d3.scale.linear().domain([0,cols]).range([scale, scale + xScale.rangeBand()]).clamp(true);
          var yBarScale = d3.scale.linear().domain([0,rows]).range([height, height - yScale(n_data.length)]).clamp(true);

          svg2.selectAll('circle.n2.' + situation)
              .data(n_data)
              .enter()
              .append('circle')
              .attr('class', 'n2 ' + situation)
              .attr('cx', previous_position - (margin.left *6))
              .attr('cy', -30)
              .attr('r', xScale.rangeBand()/(cols*2.3))
              .attr('fill', color("ocupados"))
            .transition()
              .duration(2000)
              .delay(function(d,i) { return 7*i; })
              .attr("cx", function(d,i){return xBarScale(i%cols);})
              .attr("cy", function(d,i){return yBarScale(Math.floor(i/cols));})
              .attr('fill', color(situation));
        });
      });


  });
}
