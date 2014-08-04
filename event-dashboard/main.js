d3.csv("bi32.csv", function(error, data) {
    var totalRevenueData = d3.nest()
        .key(function(d) { return d["eventname"].trim(); })
        .rollup(function(events) { return d3.sum(events, function(d) {
            return parseInt(d["  value  "].replace("$","").replace(",", ""));
        });})
        .entries(data);

    var averageRevenueData = d3.nest()
        .key(function(d) { return d["eventname"].trim(); })
        .rollup(function(events) {
            var totalRevenue = d3.sum(events, function(d) { return parseInt(d["  value  "].replace("$","").replace(",", "")); });
            return totalRevenue/events.length;
        })
        .entries(data);

    var perHeadRevenueData = d3.nest()
        .key(function(d) { return d["eventname"].trim(); })
        .rollup(function(events) {
            var totalRevenue = d3.sum(events, function(d) { return parseInt(d["  value  "].replace("$","").replace(",", "")); });
            var totalCapacity = d3.sum(events, function(d) { return parseInt(d["capacity"]); });
            return totalRevenue/totalCapacity;
        })
        .entries(data);

    barChart(d3.select(".total-revenue"), {yHeading:"Revenue", data:totalRevenueData});
    barChart(d3.select(".average-revenue"), {yHeading:"Revenue by suite", data:averageRevenueData});
    barChart(d3.select(".per-head-revenue"), {yHeading:"Average", data:perHeadRevenueData});
});
