d3.tsv("aggHour.tsv", function(data){
    
    // var width = $("#streams").width(),
    //     streamHeight = 50;
    var width = 700,
        streamHeight = 50;

    var format = d3.time.format("%Y-%m-%d %H:%M:%S");

    var carCountDomain = d3.extent(data, function(d){return Math.round(+d.count)})

    var timeDomain = d3.extent(data, function(d){return format.parse(d.date)})

    var pad=20;

    data = d3.nest().key(function(d){return d.nil}).entries(data)
    console.log(data)
    data.sort(function(a,b){
        var a = d3.sum(a.values, function(d){return +d.count})
        var b = d3.sum(b.values, function(d){return +d.count})
        return b - a
    })

    var height = data.length*streamHeight

    var x = d3.time.scale()
        .domain(timeDomain)
        .range([200, width]);

    var y = d3.scale.ordinal()
        .domain(data.map(function(d){return d.key}))
        .rangePoints([0, height], 1);

    var yStream = d3.scale.linear()
        .domain(carCountDomain)
        .range([0, streamHeight]);

    var xlines = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(d3.time.days, 1)
        .tickFormat(null)
        .tickSize(height)

    var area = d3.svg.area()
        .interpolate("basis")
        .x(function(d) { return x(format.parse(d.date)) })
        .y0(function(d) { return -yStream(Math.round(+d.count)) / 2; })
        .y1(function(d) { return yStream(Math.round(+d.count)) / 2; });

    var svglabel = d3.select("#stream-label").append("svg")
        .attr("width", width+pad)
        .attr("height",40);


    var svg = d3.select("#stream-viz").append("svg")
        .attr("width", width+pad)
        .attr("height", height);

    svg.selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("transform", function(d, i) { return "translate(0," + y(d.key) + ")"; })
        .style("fill", "#E8C102")
        .style("stroke", "none")
        .style("stroke-width", "none")
        .attr("d", function(d){ return area(d.values)});

    svg.selectAll("text")
        .data(data)
        .enter().append("text")
        .attr("x", 195)
        .attr("dy",3)
        .attr("y", function(d){return y(d.key)})
        .style("font-size",12)
        .style("letter-spacing",1)
        .style("font-weight",700)
        .style("text-anchor","end")
        .text(function(d){return d.key})


//vertical dynamic legend
    var legend = svg.append("g")
        .attr("class","legend");


    var lines = legend.append("g")
        .attr("class","v-lines axis")
        .call(xlines)
    /*.data(d3.range(8)).enter()
     .append("line")
     .attr("class","v-line")
     .attr("x1",function(d){return d*(width-200)})*/

    legend.append("line")
        .attr("x1",0)
        .attr("y1",0)
        .attr("x2",0)
        .attr("y2",height)
        .attr("class","scan")
        .style("stroke","#333")
        .style("opacity",0)
        .style("stroke-width",1);


    legend.selectAll(".value")
        .data(data).enter()
        .append("text")
        .attr("x",0)
        .attr("y",3)
        .attr("class","value")
        //.attr("font-family","sans-serif")
        .attr("font-size",12)
        .style("fill","#333")
        .text("init")
        .style("opacity",0)
        .style("font-weight",700)
        .attr("transform", function(d, i) { return "translate(0," + y(d.key) + ")"; });


    //update legend on mousemove
    svg.on('mousemove', function() {

        var xc = d3.min([width,d3.mouse(this)[0]]);
        xc = d3.max([200,xc]);
        var t = x.invert(xc)

        d3.select(".legend").select(".scan")
            .attr("x1",xc)
            .attr("x2",xc)
            .style("opacity",0.6)

        legend.selectAll(".value")
            .attr("x",xc+2)
            .text(function(d){
                var val = d.values[0].count;
                d.values.forEach(function(e,i){
                    if(format.parse(e.date)<t ) {
                        val= e.count;
                    }
                })
                return parseInt(val);
            })
            .style("opacity","1")
    });


//static top legend
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(d3.time.days, 1)
        .tickFormat(d3.time.format('%a'))
        .tickSize(0)

    var xdays = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(d3.time.days, 1)
        .tickFormat(d3.time.format('%d/%m'))
        .tickSize(0)

    var xAxis2 = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(d3.time.hours, 6)
        .tickFormat("")
        .tickSize(12)


    svglabel.append('g')
        .attr('class', 'x axis')
        .call(xAxis)
        .call(adjustTextLabels)

    svglabel.append('g')
        .attr('class', 'xhours axis')
        .call(xdays)
        .attr("transform","translate(0,14)")
        .call(adjustTextLabels)


    svglabel.append('g')
        .attr('class', 'x2 axis')
        .attr("transform","translate(0,30)")
        .call(xAxis2)

    d3.select(".x").selectAll("text")
        .attr("x", 0)
        .attr("dy", 8)
    // .style("text-anchor", null);




    function adjustTextLabels(selection) {
        selection.selectAll('text')
            .attr('transform', function(d){return 'translate('+ daysToPixels(1, x, d) / 2 + ',0)'});
    }

    function daysToPixels(days, timeScale,d1) {
        //var d1 = new Date();
        //timeScale || (timeScale = Global.timeScale);
        return timeScale(d3.time.day.offset(d1, days)) - timeScale(d1);
    }

})

d3.csv("assets/data/epa_0615_per.csv", function(error, data) {
    
    // var width = $("#streams").width(),
    //     streamHeight = 50;
    var width = 700,
        streamHeight = 100;

    var format = d3.time.format("%Y");

    var value_domain = d3.extent(data, function(d){return Math.round(+d.porcentaje)})


    var year_domain = d3.extent(data, function(d){return format.parse(d.year)})

    var pad=40;

    data = data.filter(function(d) { return d.ccaa == "Nacional"; })
    
    data.sort(function(a,b){
        return format.parse(a.year) - format.parse(b.year)
    });

    data = d3.nest().key(function(d){return d.variable}).entries(data)

    console.log(data)

    var height = data.length*streamHeight

    var x = d3.time.scale()
        .domain(year_domain)
        .range([200, width]);


    var y = d3.scale.ordinal()
        .domain(data.map(function(d){return d.key}))
        .rangePoints([0, height], 1);
    
    var yStream = d3.scale.linear()
        .domain(value_domain)
        .range([0, streamHeight]);




    var xlines = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        // .ticks(d3.time.days, 1)
        .tickFormat(null)
        .tickSize(height)

    var area = d3.svg.area()
        .interpolate("linear")
        .x(function(d) { return x(format.parse(d.year)) })
        // .y0(function(d) { return -yStream(Math.round(+d.count)) / 2; })
        .y1(0)
        .y0(function(d) { return -yStream(+d.porcentaje); });

    var svglabel = d3.select("#stream-label").append("svg")
        .attr("width", width+pad)
        .attr("height",40);


    var svg = d3.select("#stream-viz").append("svg")
        .attr("width", width+pad)
        .attr("height", height);

    svg.selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("transform", function(d, i) { return "translate(0," + y(d.key) + ")"; })
        .style("fill", "#E8C102")
        .style("stroke", "none")
        .style("stroke-width", "none")
        .attr("d", function(d){ return area(d.values)});

    svg.selectAll("text")
        .data(data)
        .enter().append("text")
        .attr("x", 195)
        .attr("dy",3)
        .attr("y", function(d){return y(d.key)})
        .style("font-size",12)
        .style("letter-spacing",1)
        .style("font-weight",700)
        .style("text-anchor","end")
        .text(function(d){return d.key})


// //vertical dynamic legend
//     var legend = svg.append("g")
//         .attr("class","legend");


//     var lines = legend.append("g")
//         .attr("class","v-lines axis")
//         .call(xlines)
//     /*.data(d3.range(8)).enter()
//      .append("line")
//      .attr("class","v-line")
//      .attr("x1",function(d){return d*(width-200)})*/

//     legend.append("line")
//         .attr("x1",0)
//         .attr("y1",0)
//         .attr("x2",0)
//         .attr("y2",height)
//         .attr("class","scan")
//         .style("stroke","#333")
//         .style("opacity",0)
//         .style("stroke-width",1);


//     legend.selectAll(".value")
//         .data(data).enter()
//         .append("text")
//         .attr("x",0)
//         .attr("y",3)
//         .attr("class","value")
//         //.attr("font-family","sans-serif")
//         .attr("font-size",12)
//         .style("fill","#333")
//         .text("init")
//         .style("opacity",0)
//         .style("font-weight",700)
//         .attr("transform", function(d, i) { return "translate(0," + y(d.key) + ")"; });


//     //update legend on mousemove
//     svg.on('mousemove', function() {

//         var xc = d3.min([width,d3.mouse(this)[0]]);
//         xc = d3.max([200,xc]);
//         var t = x.invert(xc)

//         d3.select(".legend").select(".scan")
//             .attr("x1",xc)
//             .attr("x2",xc)
//             .style("opacity",0.6)

//         legend.selectAll(".value")
//             .attr("x",xc+2)
//             .text(function(d){
//                 var val = d.values[0].count;
//                 d.values.forEach(function(e,i){
//                     if(format.parse(e.date)<t ) {
//                         val= e.count;
//                     }
//                 })
//                 return parseInt(val);
//             })
//             .style("opacity","1")
//     });


// //static top legend
//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient('bottom')
//         .ticks(d3.time.days, 1)
//         .tickFormat(d3.time.format('%a'))
//         .tickSize(0)

//     var xdays = d3.svg.axis()
//         .scale(x)
//         .orient('bottom')
//         .ticks(d3.time.days, 1)
//         .tickFormat(d3.time.format('%d/%m'))
//         .tickSize(0)

//     var xAxis2 = d3.svg.axis()
//         .scale(x)
//         .orient('bottom')
//         .ticks(d3.time.hours, 6)
//         .tickFormat("")
//         .tickSize(12)


//     svglabel.append('g')
//         .attr('class', 'x axis')
//         .call(xAxis)
//         .call(adjustTextLabels)

//     svglabel.append('g')
//         .attr('class', 'xhours axis')
//         .call(xdays)
//         .attr("transform","translate(0,14)")
//         .call(adjustTextLabels)


//     svglabel.append('g')
//         .attr('class', 'x2 axis')
//         .attr("transform","translate(0,30)")
//         .call(xAxis2)

//     d3.select(".x").selectAll("text")
//         .attr("x", 0)
//         .attr("dy", 8)
//     // .style("text-anchor", null);




    function adjustTextLabels(selection) {
        selection.selectAll('text')
            .attr('transform', function(d){return 'translate('+ daysToPixels(1, x, d) / 2 + ',0)'});
    }

    function daysToPixels(days, timeScale,d1) {
        //var d1 = new Date();
        //timeScale || (timeScale = Global.timeScale);
        return timeScale(d3.time.day.offset(d1, days)) - timeScale(d1);
    }

})









// var width = 960,
//     height = 500;

// var m = 5, // number of series
//     n = 90; // number of values

// d3.csv("assets/data/stream_prueba.csv", function(error, data) {

//     var stream_data = [];

//     data.forEach(function(d) { 
//         var keys = Object.keys(d).filter(function(d) { return d != "year"; })

//         keys.forEach(function(key) {
//             var a = {"year": d.year, "estado": key, "value": +d[key]}
//             stream_data.push(a)
//         })
//         n = d.length;
//         var year_data = {"year": d.year, "values": {"activos": +d.activos, "inactivos": +d.inactivos, "ocupados": +d.ocupados, "parados": +d.parados}}
//         // stream_data.push(year_data)
//         n = Object.keys(year_data.values).length;

//     });

//     var a = d3.nest()
//                .key(function(d) { return d.estado; })
//                .entries(stream_data); 
    
//     var b = a.map(function(d) { 
//         new_values = [];
//         d.values.map(function(value) {
//             new_values.push(value.value)
//         })
//         return {"key": d.key, "values": new_values}; 
//     })


//     // var m = data.length,
//     //     n = a.length;

//     var m = 4,
//         n=4;

//     var x = d3.scale.linear()
//         .domain([0, n - 1])
//         .range([0, width]);

//     var y = d3.scale.ordinal()
//         .domain(d3.range(m))
//         .rangePoints([0, height], 1);

//     var color = d3.scale.ordinal()
//         .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

//     var area = d3.svg.area()
//         .interpolate("linear")
//         .x(function(d, i) {console.log(i); return x(i); })
//         .y0(function(d) { return -d / 2; })
//         .y1(function(d) { return d / 2; });

//     var svg = d3.select("#streams").append("svg")
//         .attr("width", width)
//         .attr("height", height);


//     var c = [[56,33,11,65],[25,36,25,89],[25,36,35,75],[35,25,98,45]]     

//     svg.selectAll("path")
//         .data(c)
//       .enter().append("path")
//         .attr("transform", function(d, i) { console.log(d);return "translate(0," + y(i) + ")"; })
//         .style("fill", function(d,i) { return color(i); })
//         .attr("d", area);

        
        
   
    
// })
// // Generate random data into five arrays.
// var data = d3.range(m).map(function() {
//   return d3.range(n).map(function() {
//     return Math.random() * 100 | 0;
//   });
// });


// var x = d3.scale.linear()
//     .domain([0, n - 1])
//     .range([0, width]);

// var y = d3.scale.ordinal()
//     .domain(d3.range(m))
//     .rangePoints([0, height], 1);

// var color = d3.scale.ordinal()
//     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

// // var area = d3.svg.area()
// //     .interpolate("basis")
// //     .x(function(d, i) {  console.log("a");return x(i); })
// //     .y0(function(d, i) { console.log(d); return -d / 2; })
// //     .y1(function(d) { return d / 2; });

// // var svg = d3.select("body").append("svg")
// //     .attr("width", width)
// //     .attr("height", height);

// // svg.selectAll("path")
// //     .data(data)
// //   .enter().append("path")
// //     .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; })
// //     .style("fill", function(d, i) { return color(i); })
// //     .attr("d", area);