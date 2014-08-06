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

    barChart(d3.select(".total-revenue svg"), {yHeading:"Revenue", data:totalRevenueData});
    barChart(d3.select(".average-revenue svg"), {yHeading:"Revenue by suite", data:averageRevenueData});
    barChart(d3.select(".per-head-revenue svg"), {yHeading:"Average", data:perHeadRevenueData});

    d3.nest()
        .key(function(d) { return d["eventname"].trim(); })
        .entries(data)
        .forEach(function(entries) {
            var eventName = entries.key;
            var events = entries.values;

            var data = d3.nest()
                .key(function(d) {
                    var menu = d["selected_menu"].trim();
                    return menu === "" ? "No Menu Chosen" : menu;
                })
                .rollup(function(menuEvents) { return {value: menuEvents.length}; })
                .entries(events);

            var div = d3.select(".pie-charts")
                .append("div");

            div.append("h3")
                .text(eventName);
            var svg = div.append("svg");
            pieChart(svg, {data: data});
        });

    var revenueByCompanyData = d3.nest()
        .key(function(d) { return d["name"]; })
        .rollup(function(events) {
            var totalRevenue = d3.sum(events, function(d) { return parseInt(d["  value  "].replace("$","").replace(",", "")); });
            return {value: totalRevenue, valueToShow: dollarFormatter(totalRevenue) };
        })
        .entries(data)
        .sort(function(a, b) {
            var result = d3.ascending(a.values.value, b.values.value);
            return result === 0 ? d3.ascending(a.key, b.key) : result;
        });

    areaChart(d3.select(".area-charts svg"), {data: revenueByCompanyData});
});
