var fullWidth = 960;
var fullHeight = 500;
var margin = {
    left: 50,
    right: 0,
    bottom: 50,
    top:0
};

var padding = {
    bar: 5,
    sample: 20,
    query: 50
};

var colorScale = d3.scale.category10();

d3.json("data.json", function(error, chartData) {
    var width = fullWidth - margin.left - margin.right;
    var height = fullHeight - margin.top - margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", fullWidth)
        .attr("height", fullHeight);

    var sampleCount = 0;
    var queryCount = _.keys(chartData).length;

    var flatData = _.flatten(
        _.map(chartData, function(samples, queryName) {
            sampleCount += _.keys(samples).length;

            return _.map(samples, function(values, sampleName) {
                return _.map(values, function(value, key) {
                    return {
                        key: key,
                        value: value,
                        sample: sampleName,
                        query: queryName
                    };
                });
            });
        })
    );

    var queries = _.chain(flatData)
        .pluck('query')
        .uniq()
        .value();

    var samples = _.chain(flatData)
        .map(function(d) { return d.query + ":" + d.sample; })
        .uniq()
        .value();

    var chartArea = chart
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(flatData, function(d) { return d.value; })]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis);

    var barWidth = (width -
                    (flatData.length + 1) * padding.bar -
                    (sampleCount - 1) * padding.sample -
                    (queryCount - 1) * padding.query
                   ) / flatData.length;

    var bar = chartArea.selectAll("g")
        .data(flatData)
        .enter().append("g")
        .attr("transform", function(d, i) {
            var xPadding = queries.indexOf(d.query) * padding.query +
                samples.indexOf(d.query + ":" + d.sample) * padding.sample +
                (i + 1) * padding.bar;

            var x = (i * barWidth) + xPadding;
            return "translate(" + x + ",0)";
        });

    bar.append("rect")
        .attr("y", function(d) { return y(d.value); })
        .attr("fill", function(d) {
            return d3.rgb(colorScale(d.query));
        })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", barWidth);

    bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", function(d) {
            return y(d.value) + 3;
        })
        .attr("dy", ".75em")
        .attr("fill", "white")
        .text(function(d) {
            return d.key;
        });
});
