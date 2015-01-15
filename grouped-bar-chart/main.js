var width = 960;
var height = 500;
var padding = {
    bar: 5,
    sample: 50,
    query: 100
};

d3.json("data.json", function(error, chartData) {
    var chart = d3.select(".chart")
        .attr("width", width)
        .attr("height", height);

    var queryIndex = -1;
    var sampleIndex = -1;

    var sampleCount = 0;

    var flatData = _.flatten(
        _.map(chartData, function(samples, queryName) {
            queryIndex++;
            sampleCount += _.keys(samples).length;

            return _.map(samples, function(values, sampleName) {
                sampleIndex++;
                return _.map(values, function(value, key) {
                    return {
                        key: key,
                        value: value,
                        sample: sampleName,
                        query: queryName,
                        queryIndex: queryIndex,
                        sampleIndex: sampleIndex
                    };
                });
            });
        })
    );

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(flatData, function(d) { return d.value; })]);

    var queryCount = _.keys(chartData).length;

    var barWidth = (width -
                    (flatData.length + 1) * padding.bar -
                    (sampleCount - 1) * padding.sample -
                    (queryCount - 1) * padding.query
                   ) / flatData.length;

    var bar = chart.selectAll("g")
        .data(flatData)
        .enter().append("g")
        .attr("transform", function(d, i) {
            var xPadding = (d.queryIndex * padding.query +
                            d.sampleIndex * padding.sample +
                            ((i + 1) * padding.bar));
            var x = (i * barWidth) + xPadding;
            return "translate(" + x + ",0)";
        });

    bar.append("rect")
        .attr("y", function(d) { return y(d.value); })
        .attr("fill", "blue")
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", barWidth);

    bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", function(d) { return y(d.value) + 3; })
        .attr("dy", ".75em")
        .attr("fill", "white")
        .text(function(d) { return d.value; });
});
