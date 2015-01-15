d3.json("data.json", function(error, data) {
    var width = 960;
    var height = 500;

    var chart = d3.select(".chart")
        .attr("width", width)
        .attr("height", height);

    var flatData = _.flatten(
        _.map(data, function(samples, queryName) {
            return _.map(samples, function(values, sampleName) {
                return _.map(values, function(value, key) {
                    var result = {};
                    result.key = key;
                    result.value = value;
                    result.sample = sampleName;
                    result.query = queryName;
                    return result;
                });
            });
        })
    );

    var barPadding = 5;

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(flatData, function(d) { return d.value; })]);

    var barWidth = (width - (flatData.length + 1) * barPadding) / flatData.length;

    var bar = chart.selectAll("g")
        .data(flatData)
        .enter().append("g")
        .attr("transform", function(d, i) {
            var x = (i * barWidth) + ((i + 1) * barPadding);
            return "translate(" + x + ",0)";
        });

    bar.append("rect")
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", barWidth);

    bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", function(d) { return y(d.value) + 3; })
        .attr("dy", ".75em")
        .text(function(d) { return d.value; });
});
