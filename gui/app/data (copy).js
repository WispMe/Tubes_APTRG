var temperature = 0,
    kelembaban = 0,
    tekanan = 0,
    arahAngin = 0,
    datagauge = 0;



var param = {
    lintang: -6.976875, //Bandung
    bujur: 107.630042, //Bandung
    setLintang: function(data) {
        this.lintang = parseFloat(data);
    },
    setBujur: function(data) {
        this.bujur = parseFloat(data);
    },
    getLintang: function() {
        return this.lintang;
    },
    getBujur: function() {
        return this.bujur;
    }
};

var airSpeedWidget;
var airSpeedSlider;

var altimeterWidget;
var heightSlider;


$(document).ready(function() {
    airSpeedWidget = new PerfectWidgets.Widget("airSpeed", jsonModel1);
    altimeterWidget = new PerfectWidgets.Widget("altimeter", jsonModel2);

    grabAltimeterSliders();
    grabAirSpeedWidgetSliders();

    window.onresize = function(event) {
        airSpeedWidget.rescale();
        altimeterWidget.rescale();
    }

    //timeoutId = window.setTimeout(update,timeOutMiliseconds);

})

function grabAltimeterSliders() {
    heightSlider = altimeterWidget.getByName("height");
    heightSlider.configureAnimation({ "enabled": true, "ease": "swing", "duration": 500 });
    heightSlider.addAnimationValueChangedHandler(heightMovementHandler);
}

function heightMovementHandler(sender, e) {
    altimeterWidget.getByName("Slider1").recalculate();
    altimeterWidget.getByName("Slider2").recalculate();
}

function grabAirSpeedWidgetSliders() {
    airSpeedSlider = airSpeedWidget.getByName("Speed");
    airSpeedSlider.configureAnimation({ "enabled": true, "ease": "swing", "duration": 20 });
    airSpeedSlider.addAnimationValueChangedHandler(airSpeedMovementHandler);
}

function airSpeedMovementHandler(sender, e) {
    airSpeedWidget.getByName("Slider2").recalculate();
}

function Intdata(data) {
    datagauge = parseInt(data)
    return datagauge;
}

var lineCoordinatesArray = [];

/*var gaugeArahAngin = new RadialGauge({
    renderTo: 'gaugeArahAngin',
    width: 250,
    height: 250,
    minValue: 0,
    maxValue: 360,
    majorTicks: [
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW",
        "N"
    ],
    minorTicks: 22,
    ticksAngle: 360,
    startAngle: 180,
    strokeTicks: false,
    highlights: false,
    colorPlate: "#a33",
    colorMajorTicks: "#f5f5f5",
    colorMinorTicks: "#ddd",
    colorNumbers: "#ccc",
    colorNeedle: "rgba(240, 128, 128, 1)",
    colorNeedleEnd: "rgba(255, 160, 122, .9)",
    valueBox: false,
    valueTextShadow: false,
    colorCircleInner: "#fff",
    colorNeedleCircleOuter: "#ccc",
    needleCircleSize: 15,
    needleCircleOuter: false,
    animationRule: "linear",
    needleType: "line",
    needleStart: 75,
    needleEnd: 99,
    needleWidth: 3,
    borders: true,
    borderInnerWidth: 0,
    borderMiddleWidth: 0,
    borderOuterWidth: 10,
    colorBorderOuter: "#ccc",
    colorBorderOuterEnd: "#ccc",
    colorNeedleShadowDown: "#222",
    borderShadowWidth: 0,
    animationTarget: "plate",
    animationDuration: 1500,
    value: 50,
    animateOnInit: true
}).draw();
gaugeArahAngin.draw();
*/

function update() {
    const socket = io.connect();

    socket.on('socketData', (data) => {
        console.log(data);

        document.getElementById("receiveData").innerHTML = data.datahasil;

        $("#Header").html(data.datahasil[0]);
        $("#Alti").html(data.datahasil[1]);
        $("#Temp").html(data.datahasil[2]);
        $("#Humid").html(data.datahasil[3]);
        $("#Pressure").html(data.datahasil[4]);
        $("#windDir").html(data.datahasil[5]);
        $("#windVelo").html(data.datahasil[6]);
        $("#Latitude").html(data.datahasil[7]);
        $("#Longitude").html(data.datahasil[8]);
        $("#CO2").html(data.datahasil[9]);

        temperature = parseInt(data.datahasil[2]);
        kelembaban = parseInt(data.datahasil[3]);
        tekanan = parseInt(data.datahasil[4]);
        param.setLintang(data.datahasil[7]);
        param.setBujur(data.datahasil[8]);
        //airSpeedSlider.setValue(airSpeedSlider.getValue()+nextInt(-20,20));
        arahAngin = Math.floor(Math.random() * (360 - 0 + 1)) + 0;;
        //kasih random karena belum ada fungsi arah angin dari data gps
        gaugeArahAngin.value = arahAngin;
        //airSpeedWidget.value = arahAngin;
        heightSlider.setValue(heightSlider.getValue() + Intdata(data.datahasil[1]));
        airSpeedSlider.setValue(airSpeedSlider.getValue() + Intdata(data.datahasil[2]));

        // timeoutId = window.setTimeout(update,timeOutMiliseconds);




        //redraw maps
        redraw(param.getLintang(), param.getBujur());
    });
}

$(function() {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    /*Highcharts.chart('grafikTemperature', {
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = temperature;
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            }
        },
        title: {
            text: 'Live random data'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
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
            name: 'Random data',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: temperature
                    });
                }
                return data;
            }())
        }]
    });

    Highcharts.chart('grafikKelembaban', {
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = kelembaban;
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            }
        },
        title: {
            text: 'Live random data'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
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
            name: 'Random data',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: kelembaban
                    });
                }
                return data;
            }())
        }]
    }); */

    Highcharts.chart('grafiktekanan', {
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.0)',
            events: {
                load: function() {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function() {
                        var x = (new Date()).getTime(), // current time
                            y = tekanan;
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            }
        },
        title: {
            text: 'Live random data',
            style: {
                color: '#33ccff'
            }
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function() {
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
            name: 'Random data',
            data: (function() {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 1000,
                        y: tekanan
                    });
                }
                return data;
            }())
        }]
    });




    //Make map
    map = new google.maps.Map(document.getElementById('coordinate'), {
        zoom: 17,
        center: { lat: param.getLintang(), lng: param.getBujur(), alt: 0 }
    });

    //make marker
    map_marker = new google.maps.Marker({ position: { lat: param.getLintang(), lng: param.getBujur() }, map: map });
    map_marker.setMap(map);



}); // end jquery

function redraw(Lintang, Bujur) {
    map.setCenter({ lat: Lintang, lng: Bujur, alt: 0 }); // biar map ketengah
    map_marker.setPosition({ lat: Lintang, lng: Bujur, alt: 0 }); // biar map ketengah

    pushCoordToArray(Lintang, Bujur); //masukin nilai lintan dan bujur ke array coordinates

    var lineCoordinatesPath = new google.maps.Polyline({
        path: lineCoordinatesArray,
        geodesic: true,
        strokeColor: '#ffeb3b',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    lineCoordinatesPath.setMap(map);
}

function pushCoordToArray(latIn, lngIn) {
    lineCoordinatesArray.push(new google.maps.LatLng(latIn, lngIn));
}