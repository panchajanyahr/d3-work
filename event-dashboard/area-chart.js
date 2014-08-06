function areaChart(svg, options) {
    var margin = {top: 20, right: 20, bottom: 200, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeBands([0, width])
        .domain(options.data.map(function(d) { return d.key; }));

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(options.data, function(d) { return d.values.value; })]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var area = d3.svg.area()
        .x(function(d) { return x(d.key) + x.rangeBand()/2; })
        .y0(height)
        .y1(function(d) { return y(d.values.value); });

    var main = svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    main.append("path")
        .datum(options.data)
        .attr("class", "area")
        .attr("d", area);

    main.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", function(d) {
            var element = d3.select(this);
            return "rotate(270," + element.attr("x") + "," + element.attr("y") + ")";
        })
        .attr("dy", "0.35em")
        .style("text-anchor", "end");

    main.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}
