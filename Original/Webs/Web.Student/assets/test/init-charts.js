

function initPieChart(obj, callback) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);

        var chart = am4core.create(obj.id, am4charts.PieChart3D);

        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.legend = new am4charts.Legend();
        //chart.legend.useDefaultMarker = true;

        var markerTemplate = chart.legend.markers.template;
        chart.legend.itemContainers.template.paddingTop = 3;
        chart.legend.itemContainers.template.paddingBottom = 3;
        markerTemplate.width = 10;
        markerTemplate.height = 10;
        chart.legend.fontSize = 11;

        var series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = "sl";
        series.dataFields.category = "name";

        series.ticks.template.disabled = true;
        series.alignLabels = false;
        series.labels.template.text = " ";
        chart.data = [];

        callback(chart);
    });
}

function initColumnChart(obj, callback) {
    console.log(5454)
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create(obj.id, am4charts.XYChart);

        // Add data
        chart.data = [];

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.tooltip.disabled = true;
        categoryAxis.renderer.minHeight = 20;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.width = 20;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "sl";
        series.dataFields.categoryX = "name";
        series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        //series.columns.template.column.cornerRadiusTopLeft = 10;
        //series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.8;
        series.columns.template.width = am4core.percent(50);

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });

        // Cursor
        chart.cursor = new am4charts.XYCursor();

        callback(chart);
    }); // end am4core.ready()
}
