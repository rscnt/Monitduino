var chart1;
var chart2;
var chart3;
var chart4;
$(document).ready(function() {
    
    Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    
    chart1 = new Highcharts.Chart({
            chart: {
                type: 'spline',
                renderTo: 'containerh',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = hm
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            rangeSelector: {
            selected: 1
            },
            title: {
                text: 'Humedad relativa'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                min: 0, 
                max: 100,
                title: {
                    text: '%'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#ADD8E6'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Humedad',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: hm
                        });
                    }
                    return data;
                }())
            }]
        });
    chart2 = new Highcharts.Chart({
            chart: {
                type: 'spline',
                renderTo: 'containert',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = tm
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            rangeSelector: {
            selected: 1
            },
            title: {
                text: 'Temperatura Ambiente'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                min: -10, 
                max: 40,
                title: {
                    text: '°C'
                }, 
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#FF8C00'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Temperatura',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: hm
                        });
                    }
                    return data;
                }())
            }]
        });
    chart3 = new Highcharts.Chart({
            chart: {
                type: 'spline',
                renderTo: 'containerl',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = lm
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            rangeSelector: {
            selected: 1
            },
            title: {
                text: 'Sensor Liquidos'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                min: 0, 
                max: 1,
                title: {
                    text: 'Estado'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: 'blue'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Liquidos',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: lm
                        });
                    }
                    return data;
                }())
            }]
        });
    chart4 = new Highcharts.Chart({
            chart: {
                type: 'spline',
                renderTo: 'containerhu',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = humm
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            rangeSelector: {
            selected: 1
            },
            title: {
                text: 'Sensor de Humo'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                min: 0, 
                max: 1,
                title: {
                    text: 'Estado'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: 'red'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Humo',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: humm
                        });
                    }
                    return data;
                }())
            }]
        });
});
