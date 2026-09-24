$(document).ready(function () {
    $('.chart.doughnut').each(function () {
        type: 'doughnut';
        var chartID = $(this).find('canvas').attr('id');
        var c = document.getElementById(chartID);
        var width = $('#' + chartID).width();
        var height = width;
        var linewidth = width / 8;
        c.setAttribute('width', width * 2);
        c.setAttribute('height', height * 2);
        var ctx = c.getContext('2d');
        var startingPoint =-0.5;
        ctx.scale(2, 2);
        ctx.beginPath();
        ctx.arc(height / 2, height / 2, width / 3, 0 * Math.PI, 1 * Math.PI);
        ctx.lineWidth = linewidth;
        ctx.stroke();

        $(this).find('li').each(function () {

            var start = startingPoint;
            var dataValue = $(this).find('data').attr('value');
            var end = startingPoint + (2.5 * dataValue);
            var color = $(this).find('data').data('color');
            ctx.beginPath();
            ctx.arc(height / 2, height / 2, width / 3, startingPoint * Math.PI, end * Math.PI);
            ctx.lineWidth = linewidth;
            ctx.strokeStyle = color
            ctx.stroke();
            $(this).css('color', color);
        });  
    });
});

$(document).ready(function () {
  
    $('.chart.doughnut').each(function () {
        type: 'doughnut';
        var chartID = $(this).find('canvas').attr('id');
        var c = document.getElementById(chartID);
        var width = $('#' + chartID).width();
        var height = width;
        var linewidth = width / 8;
        c.setAttribute('width', width * 2);
        c.setAttribute('height', height * 2);
        var ctx = c.getContext('2d');
        var startingPoint =-0.5;
        ctx.scale(2, 2);
        ctx.beginPath();
        ctx.arc(height / 2, height / 2, width / 3, 0 * Math.PI, 1 * Math.PI);
        ctx.lineWidth = linewidth;
      //  ctx.strokeStyle = 'none';
        //ctx.shadowOffsetX = 3;
       //ctx.shadowOffsetY = 3;
      //  ctx.shadowBlur = 20;
       // ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.stroke();

        $(this).find('li').each(function () {

            var start = startingPoint;
            var dataValue = $(this).find('data').attr('value');
            var end = startingPoint + (2.5 * dataValue);
            var color = $(this).find('data').data('color');
            ctx.beginPath();
            ctx.arc(height / 2, height / 2, width / 3, startingPoint * Math.PI, end * Math.PI);
            ctx.lineWidth = linewidth;
            ctx.strokeStyle = color;
            ctx.stroke();
            $(this).css('color', color);
        });
    });
});

const getinput = document.querySelector('.searchbox input');
const highlight = document.querySelector('.searchdiv .card');


//searching option
getinput.addEventListener('keyup', (e) => {
    if (e.key === 'Escape' || e.target.value == "") {
        highlight.style.cssText = "opacity:0; visibility:hidden;";
        return;
    }
    highlight.style.cssText = "opacity:1; visibility:visible;";
    filterUser(e.target.value);
})

const filterUser = (searchword) => {
    searchword = searchword.toLowerCase();
    username = document.querySelectorAll('.searchdiv .search-list li');
    Array.from(username).forEach((uname) => {
        let label = uname.innerText.toLowerCase();
        if (label.includes(searchword)) {
            uname.style.display = "block";
        }
        else {
            uname.style.display = "none";
        }
    })
}