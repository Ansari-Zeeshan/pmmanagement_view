

let ctx = document.getElementById("linechart").getContext('2d');

var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
gradientStroke.addColorStop(0, "#ff6c00");
gradientStroke.addColorStop(1, "#ff3b74");

var gradientBkgrd = ctx.createLinearGradient(0, 100, 0, 400);
gradientBkgrd.addColorStop(0, "rgba(244,94,132,0.2)");
gradientBkgrd.addColorStop(1, "rgba(249,135,94,0)");

let draw = Chart.controllers.line.prototype.draw;
Chart.controllers.line = Chart.controllers.line.extend({
    draw: function() {
        draw.apply(this, arguments);
        let ctx = this.chart.chart.ctx;
        let _stroke = ctx.stroke;
        ctx.stroke = function() {
            ctx.save();
            //ctx.shadowColor = 'rgba(244,94,132,0.8)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 6;
            _stroke.apply(this, arguments)
            ctx.restore();
        }
    }
});

var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ["Jan", "Feb", "March", "April","May","June","July"],
        datasets: [{
            label: "Projects Completed",
            backgroundColor: 'transparent',
            borderColor: '#02B774',
            data: [10, 34, 19, 33, 50, 28, 35, 19],
            pointBorderColor: "#02B774",
            pointBackgroundColor: "#02B774",
            pointBorderWidth: 5,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#2762ed',
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 4,
            pointRadius: 1,
            borderWidth: 2,
            pointHitRadius: 16,
        }]
    },

    // Configuration options go here
    options: {
        responsive: true,
      tooltips: {
        backgroundColor:'#fff',
        displayColors:false,
           titleFontColor: '#000',
        bodyFontColor: '#000'
        
        },      
      legend: {
            display: false
      },
        scales: {
            xAxes: [{
                gridLines: {
                    display:false
                }
            }],
            yAxes: [{
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return value;
                    }
                }
            }],
        }
    }
});