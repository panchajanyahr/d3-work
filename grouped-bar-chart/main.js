var fullWidth = 800;
var fullHeight = 400;
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
    group.select("rect")
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

    group.select("text")
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
    var valueGroups = group.selectAll("g.value")
        .data(sample.values);

    var newValueGroups = valueGroups
        .enter()
        .append("g")
        .attr("class", "value");

    newValueGroups.append("rect");
    newValueGroups.append("text");

    valueGroups
        .attr("transform", function(d, i) {
            return "translate(" + d.offset + ",0)";
        })
        .each(function(obj) {
            var bar = d3.select(this);
            renderBar(bar, query, sample, y, height);
        });
};

var renderQuery = function(group, query, y, height) {
    var sampleGroups = group.selectAll("g.sample")
        .data(query.samples);

    sampleGroups
        .enter()
        .append("g")
        .attr("class", "sample");

    sampleGroups
        .attr("transform", function(sample) {
            return "translate(" + sample.offset + ",0)";
        })
        .each(function(sample) {
            renderSample(d3.select(this), query, sample, y, height);
        });
};

var createSvg = function(container) {
    var svg = d3.select(container)
        .append("svg")
        .attr("preserveAspectRatio", "none")
        .attr("viewBox", "0 0 " + fullWidth + " " + fullHeight);

    var setWidthAndHeight = function() {
        var width = d3.select(container).node().getBoundingClientRect().width;
        var aspectRatio = fullHeight / fullWidth;
        svg.attr("width", width)
            .attr("height", width * aspectRatio);
    };

    setWidthAndHeight();
    window.addEventListener("resize", setWidthAndHeight);

    var chartArea = svg
        .append("g")
        .attr("class", "chart")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (margin.left - 5) + "," + margin.top + ")")

    return svg;
};

var renderGroupChart = function(container, queries) {
    var width = fullWidth - margin.left - margin.right;
    var height = fullHeight - margin.top - margin.bottom;

    var svg = d3.select(container).select("svg");

    if(svg.empty()) {
        svg = createSvg(container);
    }

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(queryValues(queries))]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    svg.select("g.y.axis")
        .call(yAxis);

    stackQueries(queries, barWidth(queries, width, padding));

    var queryGroups = svg.select("g.chart")
        .selectAll("g.query")
        .data(queries);

    queryGroups
        .enter()
        .append("g")
        .attr("class", "query");

    queryGroups
        .attr("transform", function(query) {
            return "translate(" + query.offset + ",0)";
        })
        .each(function(query) {
            renderQuery(d3.select(this), query, y, height);
        });
};

var isValidJson = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

var textArea = function() {
    return d3.select("textarea").node();
};

var render = function() {
    renderGroupChart(".container", JSON.parse(textArea().value));
};

d3.json("data.json", function(error, queries) {
    textArea().value = JSON.stringify(queries, null, 4);
    render();
});

d3.select("textarea").on("keyup", function() {
    if(isValidJson(textArea().value)) {
        render();
    }
});
