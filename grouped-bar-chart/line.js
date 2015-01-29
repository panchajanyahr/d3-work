var fullWidth = 800;
var fullHeight = 400;
var margin = {
    left: 50,
    right: 10,
    bottom: 50,
    top:10
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

var queryKeys = function(queries) {
    var keys = [];
    queries.forEach(function(query) {
        query.samples.forEach(function(sample) {
            sample.values.forEach(function(obj) {
                keys.push(obj.key);
            });
        });
    });

    return keys;
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

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (margin.left - 5) + "," + (fullHeight - margin.bottom) + ")")

    return svg;
};

var flatSamples = function(samples) {
    return samples.reduce(function(result, sample) {
        return result.concat(sample.values);
    }, []);
};

var renderQuery = function(queryGroup, query, x, y) {
    var samples = flatSamples(query.samples);

    var path = queryGroup
        .selectAll("path")
        .data([query]);

    path.enter()
        .append("path");

    path.attr('d', function(query) {
        return d3.svg.line()
            .x(function(d) { return x(d.key); })
            .y(function(d) { return y(d.value); })(samples);
    }).attr('stroke', function(d) {
        return colorScale(d.name);
    }).attr('stroke-width', 2)
        .attr('fill', 'none');

    var circles = queryGroup.selectAll("circle")
        .data(samples);

    circles.enter()
        .append("circle");

    circles.attr("cx", function(d) { return x(d.key); })
        .attr("cy", function(d) { return y(d.value); })
        .attr("r", 4)
        .attr("opacity", 0)
        .attr("fill", function(d) {
            return colorScale(query.name);
        })
        .on("mouseover", function(d) {
            d3.select(this).attr("opacity", 1);
            return true;
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("opacity", 0);
            return true;
        });
};

var renderLineChart = function(container, queries) {
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

    var x = d3.scale.linear()
        .range([0, width])
        .domain(d3.extent(queryKeys(queries)));

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    svg.select("g.x.axis")
        .call(xAxis);

    var queryGroups = svg.select("g.chart")
        .selectAll("g.query")
        .data(queries);

    queryGroups.enter()
        .append("g")
        .attr("class", "query");

    queryGroups.each(function(query) {
        renderQuery(d3.select(this), query, x, y);
    });
    queryGroups.exit().remove();
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
    renderLineChart(".container", JSON.parse(textArea().value));
};

d3.json("line-data.json", function(error, queries) {
    textArea().value = JSON.stringify(queries, null, 4);
    render();
});

d3.select("textarea").on("keyup", function() {
    if(isValidJson(textArea().value)) {
        render();
    }
});
