var cpuHub = $.connection.cpuHub;
var renderer;

// Create a definition of signalR client function which will be called from the hub class
cpuHub.client.cpuInfo = function (machineName, cpu) {
    // if the renderer hasn't been instantiated then create one.
    if (!renderer) {
        renderer = new chartRenderer(["cvPercentage","cvGraph"], 30);
    }
    // push cpu data
    renderer.pushCpuData(cpu);
    // render chart
    renderer.renderChart();
}

// Chart renderer object, encapsulates every method for chart rendering
function chartRenderer(canvasIds, maxData) {
    // private variable
    var cpuLineChartData = [];
    var cpuBarChartData = [0,0,0];
    var theLineChart;
    var theBarChart;
    var chartLineData = {
        labels: ["", "", "", "", "", "", "", "", "", "",
                 "", "", "", "", "", "", "", "", "", "",
                 "", "", "", "", "", "", "", "", "", ""],
        datasets: [
        {
            fillColor: "#fff",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            data: []
        }]
    };
    var chartBarData = {
        labels: ["", "", ""],
        datasets: [
            {
                fillColor : "rgba(151,187,205,0.5)",
                strokeColor : "rgba(151,187,205,1)",
                data : []
            }
        ]
    };
    var chartOptions = {
        animation: false,
        datasetFill: false,
        pointDot: false,
        datasetStroke: false,
        bezierCurve: false,
        scaleShowGridLines: true,
        scaleShowLabels: false
    };

    // public properties
    this.canvasIds = canvasIds;
    this.maxData = maxData;

    // method
    this.pushCpuData = pushCpuData;
    this.renderChart = renderChart;

    // Push chart data
    function pushCpuData(cpuData) {
        // insert cpu data into array of chart
        cpuLineChartData.push(cpuData);
        // if the total data is more than the limit then remove the first data
        if (cpuLineChartData.length > maxData) {
            cpuLineChartData.splice(0, 1);
        }
        cpuBarChartData[1] = cpuData;
    }

    // Render the chart
    function renderChart() {
        // check if the chart is already instantiated, otherwise create an instance
        if (theLineChart === undefined) {
            // get context
            var ctxLine = $("#" + canvasIds[1]).get(0).getContext("2d");
            // create the chart
            theLineChart = new Chart(ctxLine);
        }
        if (theBarChart === undefined) {
            var ctxBar = $("#" + canvasIds[0]).get(0).getContext("2d");
            theBarChart = new Chart(ctxBar);
        }
        // draw the chart
        chartLineData.datasets[0].data = cpuLineChartData;
        chartBarData.datasets[0].data = cpuBarChartData;
        theLineChart.Line(chartLineData, chartOptions);
        theBarChart.Bar(chartBarData, chartOptions);
        $("#lblVal").text(cpuBarChartData[1].toString() + " %");
    }
}

// Start the SignalR connection
$.connection.hub.start();