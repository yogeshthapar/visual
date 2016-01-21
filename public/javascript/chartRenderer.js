var module = angular.module('MyApp', []);

module.factory('ChartService', [function() {
  var margin = {top: 10, right: 20, bottom: 100, left: 50},
      width = 400 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var colors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
  var enableLegend = true;

  var chartLoader = {
     init: function(config){
        margin.top = config.top || margin.top;
        margin.bottom = config.bottom || margin.bottom;
        margin.left = config.left || margin.left;
        margin.right = config.right || margin.right;
        height = config.height || height;
        height = height - margin.top - margin.bottom;
        colors = config.colors || colors;
        url = config.url;
        enableLegend = config.enableLegend;
     },
     gdpStackedBarChart: gdpStackedBarChart,
     plotContinentChart: plotContinentChart,
     gdpPerCapitaBarChart: gdpPerCapitaBarChart,
     plotNorthEast: plotNorthEast

  };

  function plotContinentChart (chartContainer, containerWidth, jsonDataUrl){
     width = containerWidth || width;
     width = containerWidth -margin.left - margin.right;
     var x = d3.scale.ordinal()
         .rangeRoundBands([0, width], .1);

     var y = d3.scale.linear()
         .rangeRound([height, 0]);

     var color = d3.scale.ordinal()
         .range(colors);

     var xAxis = d3.svg.axis()
         .scale(x)
         .orient("bottom");

     var yAxis = d3.svg.axis()
         .scale(y)
         .orient("left")
         .tickFormat(d3.format("1s"));

     var svg1 = d3.select(chartContainer + " #barChart").append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
       .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     d3.json(jsonDataUrl, function(error, data) {
       if (error) throw error;

       color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

       data.forEach(function(d) {
         var y0 = 0;
         d.values = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
         d.total = d.values[d.values.length - 1].y1;
       });

     //  data.sort(function(a, b) { return b.total - a.total; });

       x.domain(data.map(function(d) { return d.year; }));
       y.domain([0, d3.max(data, function(d) { return d.total; })]);

       svg1.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
             .selectAll("text")
             .style("text-anchor", "end")
             .attr("dx", "-.8em")
             .attr("dy", "-.50em")
             .attr("transform", "rotate(-90)");

       svg1.append("g")
           .attr("class", "y axis")
           .call(yAxis)
         .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 4)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           //.text("GDP per capita (constant 2005 US$)");

       var year = svg1.selectAll(".year")
           .data(data)
         .enter().append("g")
           .attr("class", "g")
           .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; });

       year.selectAll("rect")
           .data(function(d) { return d.values; })
         .enter().append("rect")
           .attr("width", x.rangeBand())
           .attr("y", function(d) { return y(d.y1); })
           .attr("height", function(d) { return y(d.y0) - y(d.y1); })
           .style("fill", function(d) { return color(d.name); });

        if(enableLegend) {
           var legend = svg1.selectAll(".legend")
               .data(color.domain().slice().reverse())
               .enter().append("g")
               .attr("class", "legend")
               .attr("transform", function(d, i) { return "translate(-1200," + i * 20 + ")"; });

           legend.append("rect")
               .attr("x", width - 18)
               .attr("width", 18)
               .attr("height", 18)
               .style("fill", color);

           legend.append("text")
               .attr("x", width - 24)
               .attr("y", 9)
               .attr("dy", ".35em")
               .style("text-anchor", "end")
               .text(function(d) { return d; });
           }
       });
  }

  function gdpStackedBarChart(chartContainer, containerWidth, jsonDataUrl) {
     width = containerWidth || width;
     width = containerWidth -margin.left - margin.right;
     var x = d3.scale.ordinal()
         .rangeRoundBands([0, width], .1);

     var y = d3.scale.linear()
         .rangeRound([height, 0]);

     var color = d3.scale.ordinal()
         .range(colors);

     var xAxis = d3.svg.axis()
         .scale(x)
         .orient("bottom");

     var yAxis = d3.svg.axis()
         .scale(y)
         .orient("left")
         .tickFormat(d3.format("1s"));

     var svg2 = d3.select(chartContainer + " #barChart").append("svg")
        .attr('id',chartContainer)
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
       .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     d3.json(jsonDataUrl, function(error, data) {
       if (error) throw error;
       color.domain(d3.keys(data[0]).filter(function(key) { return key !== "country"; }));

       data.forEach(function(d) {
         var y0 = 0;
         d.values = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
         d.total = d.values[d.values.length - 1].y1;
       });

       data.sort(function(a, b) { return b.total - a.total; });

       x.domain(data.map(function(d) { return d.country; }));
       y.domain([0, d3.max(data, function(d) { return d.total; })]);

       svg2.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
             .selectAll("text")
             .style("text-anchor", "end")
             .attr("dx", "-0.5em")
             .attr("dy", "0.2em")
             .attr("transform", "rotate(-45)");

       svg2.append("g")
           .attr("class", "y axis")
           .call(yAxis)
         .append("text")
           .attr("transform", "rotate(0)")
           .attr("y", -10)
           .attr("dy", ".1em")
           .style("text-anchor", "end");

       var country = svg2.selectAll(".country")
           .data(data)
         .enter().append("g")
           .attr("class", "g")
           .attr("transform", function(d) { return "translate(" + x(d.country) + ",0)"; });

       country.selectAll("rect")
           .data(function(d) { return d.values; })
         .enter().append("rect")
           .attr("width", x.rangeBand())
           .attr("y", function(d) { return y(d.y1); })
           .attr("height", function(d) { return y(d.y0) - y(d.y1); })
           .style("fill", function(d) { return color(d.name); });

        if(enableLegend) {
           var legend = svg2.selectAll(".legend")
               .data(color.domain().slice().reverse())
             .enter().append("g")
               .attr("class", "legend")
               .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

           legend.append("rect")
               .attr("x", width - 18)
               .attr("width", 18)
               .attr("height", 18)
               .style("fill", color);

           legend.append("text")
               .attr("x", width - 24)
               .attr("y", 9)
               .attr("dy", ".35em")
               .style("text-anchor", "end")
               .text(function(d) { return d; });
        }


       });
  }

  function gdpPerCapitaBarChart(chartContainer, containerWidth, jsonDataUrl) {

     width = containerWidth || width;
     width = containerWidth - margin.left - margin.right;

     var x = d3.scale.ordinal()
         .rangeRoundBands([0, width], .1);

     var y = d3.scale.linear()
         .rangeRound([height, 0]);

     var color = d3.scale.ordinal()
         .range(colors);

     var xAxis = d3.svg.axis()
         .scale(x)
         .orient("bottom");

     var yAxis = d3.svg.axis()
         .scale(y)
         .orient("left")
         .tickFormat(d3.format("1s"));

     var svg3 = d3.select(chartContainer + " #barChart").append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
       .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     d3.json(jsonDataUrl, function(error, data) {
       if (error) throw error;

       color.domain(d3.keys(data[0]).filter(function(key) { return key !== "country"; }));

       data.forEach(function(d) {
         var y0 = 0;
         d.values = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
         d.total = d.values[d.values.length - 1].y1;
       });

       data.sort(function(a, b) { return b.total - a.total; });

       x.domain(data.map(function(d) { return d.country; }));
       y.domain([0, d3.max(data, function(d) { return d.total; })]);

       svg3.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
             .selectAll("text")
             .style("text-anchor", "end")
             .attr("dx", "-0.5em")
             .attr("dy", "0.2em")
             .attr("transform", "rotate(-40)");

       svg3.append("g")
           .attr("class", "y axis")
           .call(yAxis)
         .append("text")
           .attr("transform", "rotate(0)")
           .attr("y", -10)
           .attr("dy", ".71em")
           .style("text-anchor", "end");

       var country = svg3.selectAll(".country")
           .data(data)
         .enter().append("g")
           .attr("class", "g")
           .attr("transform", function(d) { return "translate(" + x(d.country) + ",0)"; });

       country.selectAll("rect")
           .data(function(d) { return d.values; })
         .enter().append("rect")
           .attr("width", x.rangeBand())
           .attr("y", function(d) { return y(d.y1); })
           .attr("height", function(d) { return y(d.y0) - y(d.y1); })
           .style("fill", function(d) { return color(d.name); });

        if(enableLegend) {
           var legend = svg3.selectAll(".legend")
               .data(color.domain().slice().reverse())
             .enter().append("g")
               .attr("class", "legend")
               .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

           legend.append("rect")
               .attr("x", width - 18)
               .attr("width", 18)
               .attr("height", 18)
               .style("fill", color);

           legend.append("text")
               .attr("x", width - 24)
               .attr("y", 9)
               .attr("dy", ".35em")
               .style("text-anchor", "end")
               .text(function(d) { return d; });
        }


       });
  }

  function plotNorthEast(chartContainer, containerWidth, jsonDataUrl){
     width = containerWidth || width;
     width = containerWidth -margin.left - margin.right;

     var x = d3.scale.ordinal()
         .rangeRoundBands([0, width], .1);

     var y = d3.scale.linear()
         .rangeRound([height, 0]);

     var color = d3.scale.ordinal()
         .range(colors);
         //"#98abc5", "#8a89a6",,"#6b486b",

     var xAxis = d3.svg.axis()
         .scale(x)
         .orient("bottom");


     var yAxis = d3.svg.axis()
         .scale(y)
         .orient("left")
         .tickFormat(d3.format(".2s"));

     var svg10 = d3.select(chartContainer + " #barChart").append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     d3.json("chartData/northEast", function(error, nData) {
       if (error) throw error;
       //var data = d3.keys(nData);
       //console.log(data);

      var data = [];
      for(d in nData) {
        data.push({
          'state':d,
          'LiterateMale': nData[d].literacyMale,
          'LiterateFemale': nData[d].literacyFemale,
          'IlliterateMale': nData[d].illiteracyMale,
          'IlliterateFemale': nData[d].illiteracyFemale
        });
      }
      //console.log(nStates[0]);


       color.domain(d3.keys(data[0]).filter(function(key) { return key !== "state"; }));

       data.forEach(function(d) {
         var y0 = 0;
         d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
         d.total = d.ages[d.ages.length - 1].y1;
       });

       data.sort(function(a, b) { return b.total - a.total; });

       x.domain(data.map(function(d) { return d.state; }));
       y.domain([0, d3.max(data, function(d) { return d.total; })]);

       svg10.append("g")
           .attr("class", "x axis")
           .attr("transform","translate(0," + height + ")")
           .call(xAxis)
           .selectAll("text")
           .attr("transform", "rotate(-30)")
           .attr("dx", "0em")
           .attr("dy", ".85em")
          .style("text-anchor", "end");


       svg10.append("g")
           .attr("class", "y axis")
           .call(yAxis)
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 1)
           .attr("dy", ".21em")
           .style("text-anchor", "end")
           //.text("Literacy");

       var state = svg10.selectAll(".state")
           .data(data)
           .enter().append("g")
           .attr("class", "g")
           .attr("transform", function(d) { return "translate(" + x(d.state) + ",0)"; },"rotate(-90)");

       state.selectAll("rect")
           .data(function(d) { return d.ages; })
         .enter().append("rect")
           .attr("width",x.rangeBand())
           .attr("y", function(d) { return y(d.y1); })
           .attr("height", function(d) { return y(d.y0) - y(d.y1); })
           .style("fill", function(d) { return color(d.name); });

        if(enableLegend) {
           var legend = svg10.selectAll(".legend")
               .data(color.domain().slice().reverse())
             .enter().append("g")
               .attr("class", "legend")
               .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

           legend.append("rect")
               .attr("x", width - 18)
               .attr("width", 18)
               .attr("height", 18)
               .style("fill", color);

           legend.append("text")
               .attr("x", width - 24)
               .attr("y", 9)
               .attr("dy", ".25em")
               .style("text-anchor", "end")
               .text(function(d) { return d; });
        }


     });
  }
  return chartLoader;
}]);
