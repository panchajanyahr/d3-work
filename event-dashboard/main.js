d3.csv("bi32.csv", function(error, data) {
    var dollarFormatter = d3.format("$,.2f");

    var totalRevenueData = d3.nest()
        .key(function(d) { return d["eventname"].trim(); })
        .rollup(function(events) {
            var totalRevenue = d3.sum(events, function(d) { return parseInt(d["  value  "].replace("$","").replace(",", "")); });
            return {value: totalRevenue, valueToShow: dollarFormatter(totalRevenue) };
        })
        .entries(data);

    var averageRevenueData = d3.nest()
        .key(function(d) { return d["eventname"].trim(); })
        .rollup(function(events) {
            var totalRevenue = d3.sum(events, function(d) { return parseInt(d["  value  "].replace("$","").replace(",", "")); });
            var average = totalRevenue/events.length;
            return {value:average , valueToShow: dollarFormatter(average) } ;
        })
        .entries(data);

    var perHeadRevenueData = d3.nest()
        .key(function(d) { return d["eventname"].trim(); })
        .rollup(function(events) {
            var totalRevenue = d3.sum(events, function(d) { return parseInt(d["  value  "].replace("$","").replace(",", "")); });
            var totalCapacity = d3.sum(events, function(d) { return parseInt(d["capacity"]); });
            var average = totalRevenue/totalCapacity;
            return {value:average , valueToShow: dollarFormatter(average)} ;
        })
        .entries(data);

    barChart(d3.select(".total-revenue"), {yHeading:"Revenue", data:totalRevenueData});
    barChart(d3.select(".average-revenue"), {yHeading:"Revenue by suite", data:averageRevenueData});
    barChart(d3.select(".per-head-revenue"), {yHeading:"Average", data:perHeadRevenueData});
});
