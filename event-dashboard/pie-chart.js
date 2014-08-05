function pieChart(svg, options) {
    var margin = 50;
    var width = 400, height = 300,
    radius = Math.min(width, height) / 2;

    var arc = d3.svg.arc()
        .outerRadius(radius - margin)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.values.value; });

    var color = d3.scale.category10();

    var svg = svg.attr({width: width,
                        height: height})
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    var pieData = pie(options.data);
    var g = svg.selectAll(".arc")
        .data(pieData)
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) { return color(i); });

    svg.selectAll("text")
        .data(pieData)
        .enter()
        .append("text")
        .attr("x", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
            return Math.cos(a) * (radius - 20);
        })
        .attr("y", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
            return Math.sin(a) * (radius - 20);
        })
        .text(function(d) { return d.data.key; });
}
