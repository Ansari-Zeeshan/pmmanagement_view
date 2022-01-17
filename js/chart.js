var data = [{
    // label: 'Apples',
    value: 30,
    color: "#F7464A"
}, {
    value: 50,
    color: "#E2EAE9"
}, {
    value: 80,
    color: "#D4CCC5"
}, {
    value: 60,
    color: "#949FB1"
}, 

]

var options = {
    animation: false,
    showTooltips: true,
    borderWidth:0,
    tooltipFillColor: "transparent",
    tooltipFontColor: "white",
    
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],
    multiTooltipTemplate: "<%= datasetLabel %>$<%= value %>",
    onAnimationComplete: function()
    {
        this.showTooltip(this.segments, true);
    },
    
    tooltipEvents: [],
    
};

//Get the context of the canvas element we want to select
var c = $('#myChart');
var ct = c.get(0).getContext('2d');
var ctx = document.getElementById("myChart").getContext("2d");
/*************************************************************************/
myNewChart = new Chart(ct).Doughnut(data, options);