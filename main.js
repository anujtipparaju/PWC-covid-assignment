Highcharts.ajax({
        url: "dataset.csv",
        dataType: "csv",
        success: function(csv) {



            var data = [],
            countries = [];
            var mapchart;
            csv = csv.split(/\n/);
            xa = csv[0].split(',').slice(1).map(Number);
            csv.slice(1).forEach(element => {
                element = element.split(',');
                code = getCountryCode(element[0]).toLowerCase()
                Name = element[0]
                y = element[element.length-1]
                data.push([
                    code,
                    element[element.length - 1]
                ])
                countries.push({
                    code : code,
                    data: element.slice(1).map(Number)
                })
            });
            
            console.log(countries.find(function (element){
                return element['code'] === 'us';
            }));

            

            console.log(data);

            mapchart = Highcharts.mapChart('container', {
                chart: {
                    map: 'custom/world-robinson'
                },
                title: {
                    text: 'covid19 Statistics'
                },
        
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },
        
                

                series: [{
                    data: data,
                    name: 'current case',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    states: {
                        select: {
                            color: '#a4edba',
                            borderColor: 'black',
                            dashStyle: 'shortdot'
                        }
                    },
                    borderWidth: 0.5
                }],
                colorAxis: {
                    min: 0,
                    max: 1000000,
                    type: 'linear',
                    minColor: '#efecf3',
                    maxColor: '#008080',
                },
            });

            

            var selectedChart;

            Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {
                proceed.apply(this, Array.prototype.slice.call(arguments, 1));
                points = mapchart.getSelectedPoints();
                console.log(countries.find((element)=>{
                    return element['code'] === points[0]['hc-key'];
                }));
                if(!selectedChart)
                selectedChart = Highcharts.chart('chart', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'pie chart'
                    },

                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        title: {
                            text: 'Month-Day'
                        },

                        
                        
                        
                        name: Name,
                        data: y
                    }]
                });
                selectedChart.series.slice(0).forEach(function (s) {
                    s.remove(false);
                });
                selectedChart.setTitle({
                    text: points[0].name
                })
                selectedChart.addSeries({
                    name: points[0].name,
                    data: countries.find((element)=>{
                        return element['code'] === points[0]['hc-key'];
                    })['data']
                })
                selectedChart.redraw();
            });

        }


        
});


