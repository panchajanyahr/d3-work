var container = d3.select(".total-revenue");
var data = [{key: "PBR", value: "12870"},
            {key: "ICE HOCKEY", value: "32850"},
            {key: "WWE", value: "16920"}];

var margin = {top: 10, right: 0, bottom: 20, left: 25},
width = 200 - margin.left - margin.right,
height = 200 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2)
    .domain(data.map(function(d) { return d.key; }));

var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(data, function(d) { return d.value; })]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format("s"));

var svg = container.append("svg")
    .attr({width: width + margin.left + margin.right,
           height: height + margin.top + margin.bottom});

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(yAxis);

var chart = svg.append("g")
    .attr("class", "chart")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.key); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); });

chart.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", function(d) { return x(d.key) + x.rangeBand()/2; })
    .attr("y", function(d) { return y(d.value) - 3; })
    .text(function(d) { return d.value; });
