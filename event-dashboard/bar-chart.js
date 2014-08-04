function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function barChart(svg, options) {
    var margin = {top: 20, right: 0, bottom: 30, left: 50},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    var colorScale = d3.scale.category10();
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .2)
        .domain(options.data.map(function(d) { return d.key; }));

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(options.data, function(d) { return d.values.value; })]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("s"));

    svg.attr({width: width + margin.left + margin.right,
              height: height + margin.top + margin.bottom});

    svg.selectAll("text.y-heading")
        .data([options.yHeading])
        .enter()
        .append("text")
        .attr({"class": "heading",
               transform: "rotate(270,0," + (margin.top + height/2) + ")",
               x: 0,
               y: margin.top + height/2,
               dy:"1.35em"})
        .text(function(d) { return d; });


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .call(xAxis)
        .selectAll(".tick text")
        .call(wrap, x.rangeBand());

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis);

    var chart = svg.append("g")
        .attr("class", "chart")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart.selectAll("rect")
        .data(options.data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.key); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.values.value); })
        .attr("height", function(d) { return height - y(d.values.value); })
        .style("fill", function(d, i) { return colorScale(i); });

    chart.selectAll("text")
        .data(options.data)
        .enter()
        .append("text")
        .attr("x", function(d) { return x(d.key) + x.rangeBand()/2; })
        .attr("y", function(d) { return y(d.values.value) - 3; })
        .text(function(d) { return d.values.valueToShow; });
}
