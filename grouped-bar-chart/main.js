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

var queryValues = function(queries) {
    var values = [];
    queries.forEach(function(query) {
        query.samples.forEach(function(sample) {
            sample.values.forEach(function(obj) {
                values.push(obj.value);
            });
        });
    });

    return values;
};

var barWidth = function(queries, width, padding) {
    var totalQueryPadding = (queries.length - 1) * padding.query;

    var totalSamplePadding = d3.sum(queries, function(query) {
        return (query.samples.length - 1) * padding.sample;
    });

    var totalBarPadding = d3.sum(queries, function(query) {
        return d3.sum(query.samples, function(sample) {
            return (sample.values.length - 1) * padding.bar;
        });
    });

    return (width - totalBarPadding - totalSamplePadding - totalQueryPadding) / queryValues(queries).length;
};

var stackQueries = function(queries, barWidth) {
    queries.forEach(function(query, queryIndex) {
        query.samples.forEach(function(sample, sampleIndex) {
            sample.values.forEach(function(obj, barIndex) {
                obj.width = barWidth;
                obj.offset = barIndex * (barWidth + padding.bar);
            });

            sample.width = sample.values[sample.values.length - 1].offset + barWidth;

            if(sampleIndex > 0) {
                var previousSample = query.samples[sampleIndex -1];
                sample.offset = previousSample.width + previousSample.offset + padding.sample;
            } else {
                sample.offset = 0;
            }
        });

        var lastSample = query.samples[query.samples.length - 1];
        query.width = lastSample.offset + lastSample.width;

        if(queryIndex > 0) {
            var previousQuery = queries[queryIndex -1];
            query.offset = previousQuery.width + previousQuery.offset + padding.query;
        } else {
            query.offset = 0;
        }
    });
};

var renderBar = function(group, query, sample, y, height) {
    group.append("rect")
        .attr("fill", function(d) {
            return colorScale(query.name);
        })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) {
            return height - y(d.value);
        })
        .attr("width", function(d) {
            return d.width;
        });

    group.append("text")
        .attr("x", function(d) {
            return d.width / 2;
        })
        .attr("y", function(d) {
            return y(d.value) + 3;
        })
        .attr("dy", ".75em")
        .attr("fill", "white")
        .text(function(d) {
            return d.key;
        });
};

var renderSample = function(group, query, sample, y, height) {
    group.selectAll("g")
        .data(sample.values)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
            return "translate(" + d.offset + ",0)";
        })
        .each(function(obj) {
            var bar = d3.select(this);
            renderBar(bar, query, sample, y, height);
        });
};

var renderQuery = function(group, query, y, height) {
    group.selectAll("g")
        .data(query.samples)
        .enter()
        .append("g")
        .attr("transform", function(sample) {
            return "translate(" + sample.offset + ",0)";
        })
        .each(function(sample) {
            renderSample(d3.select(this), query, sample, y, height);
        });
};

var renderGroupChart = function(queries) {
    var width = fullWidth - margin.left - margin.right;
    var height = fullHeight - margin.top - margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", fullWidth)
        .attr("height", fullHeight);

    var chartArea = chart
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(queryValues(queries))]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (margin.left - 5) + "," + margin.top + ")")
        .call(yAxis);

    stackQueries(queries, barWidth(queries, width, padding));

    chartArea.selectAll("g")
        .data(queries)
        .enter()
        .append("g")
        .attr("transform", function(query) {
            return "translate(" + query.offset + ",0)";
        })
        .each(function(query) {
            renderQuery(d3.select(this), query, y, height);
        });
};

d3.json("data.json", function(error, queries) {
    renderGroupChart(queries);
});
