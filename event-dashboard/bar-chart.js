function selectOrCreate(parent, nodeType, classes) {
    var result = parent.selectAll(nodeType + "." + classes.split(" ").join("."));
    if (result.empty()) {
        return parent.append(nodeType).attr("class", classes);
    }

    return result;
}

function barChart(svg, options, chartOptions) {
    var margin = {top: 20, right: 0, bottom:50, left: 50},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

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

    var fullWidth = width + margin.left + margin.right;
    var fullHeight = height + margin.top + margin.bottom;
    svg.attr("viewBox", "0 0 " + fullWidth + " " + fullHeight);

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

    selectOrCreate(svg, "g", "x axis")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .transition().duration(chartOptions.transitionDuration)
        .call(xAxis)
        .selectAll(".tick text")
        .call(wrap, x.rangeBand());

    selectOrCreate(svg, "g", "y axis")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .transition().duration(chartOptions.transitionDuration)
        .call(yAxis);

    var chart = selectOrCreate(svg, "g", "chart")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var rects = chart.selectAll("rect")
        .data(options.data, prop("key"));

    rects.enter()
        .append("rect")
        .attr("y", height)
        .attr("height", 0)
        .style("fill", function(d) {
            return chartOptions.colorScale(d.key);
        });

    rects.transition()
        .duration(chartOptions.transitionDuration)
        .attr("x", function(d) { return x(d.key); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.values.value); })
        .attr("height", function(d) { return height - y(d.values.value); })

    rects.exit()
        .transition().duration(chartOptions.transitionDuration)
        .attr("y", height)
        .attr("height", 0)
        .remove();

    var texts = chart.selectAll("text")
        .data(options.data, prop("key"))

    texts.enter()
        .append("text")
        .attr("y", height);

    texts.transition().duration(chartOptions.transitionDuration)
        .attr("x", function(d) { return x(d.key) + x.rangeBand()/2; })
        .attr("y", function(d) { return y(d.values.value) - 3; })
        .text(function(d) { return d.values.valueToShow; });

    texts.exit()
        .transition().duration(chartOptions.transitionDuration)
        .attr("y", height)
        .remove();
}
