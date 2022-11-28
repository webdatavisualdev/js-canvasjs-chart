var chart = null;
window.onload = function () {
    var labels = [];
    chart = new CanvasJS.Chart("chartContainer", {
        axisX:{      
            labelFormatter: function (e) {
                var label = CanvasJS.formatDate(e.label, "DD MMM");
                if (labels.indexOf(label) < 0) {
                    labels.push(label);
                    return label;
                } else {
                    if (!e.label) {
                        labels = [];
                    }
                    return '';
                }
            },
            gridThickness: 1,
            gridColor: "#ddd",
        },
        axisY2: {
            minimum: 0,
            gridColor: "#ddd"
        },
		data: [              
            {
                type: "line",
                axisYType: "secondary",
                dataPoints: []
            },
            // {        
            //     type: "column",
            //     axisYType: "secondary",
            //     dataPoints: dataPoints
            // },
        ],
    });
    
	setInterval(getData(drawChart), 60000);
}

function drawChart(data) {
    var dataPoints = [];
    var minPrice = 100000000;
    data.price.sort(function(a, b) {
        if (a.date > b.date) {
            return 1;
        } else if (a.date < b.date) {
            return -1;
        }
        return 0;
    }).forEach(p => {
        if (parseInt(p.amount) < minPrice) {
            minPrice = parseInt(p.amount);
        }
        dataPoints.push({
            label: p.date,
            y: parseInt(p.amount)
        })
    });

    chart.options.data[0].dataPoints = dataPoints;
    chart.options.axisY2.minimum = minPrice - 10;
    chart.render();
}

function getData(callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(JSON.parse(xhttp.responseText).data);
        }
    };
    xhttp.open("GET", "http://sandbox.spendsdk.com/api/marketData?symbol=BTC", true);
    xhttp.send(null);
}