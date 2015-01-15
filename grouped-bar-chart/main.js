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

var flattenQueries = function(queries) {
    var flatData = [];
    var sampleIndex = 0;

    queries.forEach(function(query, queryIndex) {
        query.samples.forEach(function(sample) {
            sample.values.map(function(obj) {
                    flatData.push({
                        key: obj.key,
                        value: obj.value,
                        sample: sample.name,
                        query: query.name,
                        queryIndex: queryIndex,
                        sampleIndex: sampleIndex
                    });
            });
            sampleIndex++;
        });
    });

    return flatData;
};

d3.json("data.json", function(error, queries) {
    var flatQueries = flattenQueries(queries);

    var width = fullWidth - margin.left - margin.right;
    var height = fullHeight - margin.top - margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", fullWidth)
        .attr("height", fullHeight);

    var queryCount = queries.length;
    var sampleCount = d3.sum(queries, function(query) {
        return query.samples.length;
    });

    var chartArea = chart
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(flatQueries, function(d) { return d.value; })]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis);

    var barWidth = (width -
                    (flatQueries.length + 1) * padding.bar -
                    (sampleCount - 1) * padding.sample -
                    (queryCount - 1) * padding.query
                   ) / flatQueries.length;

    var bar = chartArea.selectAll("g")
        .data(flatQueries)
        .enter().append("g")
        .attr("transform", function(d, i) {
            var xPadding = d.queryIndex * padding.query +
                d.sampleIndex * padding.sample +
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
