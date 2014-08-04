d3.csv("bi32.csv", function(error, data) {
    var container = d3.select(".total-revenue");
    var nested_data = d3.nest()
        .key(function(d) { return d["eventname"].trim(); })
        .rollup(function(events) { return d3.sum(events, function(d) {
            return parseInt(d["  value  "].replace("$","").replace(",", ""));
        });})
        .entries(data);
    console.log(nested_data);
    var options = {yHeading:"Revenue",
                   data:nested_data};
    barChart(container, options);
});
