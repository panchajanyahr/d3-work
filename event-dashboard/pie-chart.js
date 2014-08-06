function pieChart(svg, options, chartOptions) {
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

    svg.attr("viewBox", "0 0 " + width + " " + height);

    var main = selectOrCreate(svg, "g", "main")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var pieData = pie(options.data);

    var arcs = main.selectAll("path.arc")
        .data(pieData, function(d) { return d.data.key; });

    arcs.enter()
        .append("path")
        .attr("class", "arc");

    arcs.attr("d", arc)
        .style("fill", function(d) { return chartOptions.colorScale(d.data.key); });

    arcs.exit().remove();

    var texts = main.selectAll("text")
        .data(pieData, function(d) { return d.data.key; });

    texts.enter()
        .append("text");

    texts
        .attr("x", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
            return Math.cos(a) * (radius - 20);
        })
        .attr("y", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
            return Math.sin(a) * (radius - 20);
        })
        .text(function(d) { return d.data.key; });

    texts.exit().remove();
}
