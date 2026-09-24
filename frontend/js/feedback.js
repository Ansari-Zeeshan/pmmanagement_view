const nextbtn = document.querySelector('.manage_view .div3 .step_wise button.active');
const liactive = document.querySelectorAll('.manage_view .div2 .center_div ul li');
const border_fill = document.querySelector('.manage_view .div3 .step_wise .border_step');
const step_number = document.querySelector('.manage_view .div3 .step_wise .center_step span.active');
const datacontent = document.querySelectorAll('.manage_view .div3 .form_div .step_forward');
const goback = document.querySelector('.manage_view .div3 .step_wise #goback');
let firstChild = document.querySelectorAll('.manage_view .div2 .center_div ul li div:first-child');
const stars = document.querySelectorAll('.feedback .star_div .material-icons');
const feedbackTrigger = document.querySelectorAll('.feedback .star_div .chat');
const starDiv = document.querySelector('.feedback .star_div');
const closeFeedback = document.querySelectorAll('.feedback .close_feedback');
const feed_overlay = document.querySelector('.m_bg .form_overlay');
const preventForm = document.querySelector('.m_bg form');
const textArea = document.querySelectorAll('.m_bg form .feedback_appear input');
const showDraw = document.querySelectorAll('.form_div .con5 .upload_box .draw p');
const clearDraw = document.querySelectorAll('.form_div .con5 .upload_box2 .save_div button:nth-child(2)');
const colorDraw = document.querySelectorAll('.form_div .con5 .upload_box2 .color_div div');
let canvas, ctx, flag = false, prevX = 0, currX = 0, prevY = 0, currY = 0, dot_flag = false;
let x = "black", y = 2;
let ind = 0, step_num = 1;

nextbtn.addEventListener('click', () => {
    if (ind >= 4) {
        location.href = `management-view-request-new-request-submit.html`;
    }
    ind++;
    step_num++;
    performactive(ind, step_num);
});

goback.addEventListener('click', () => {
    if (ind > 0) {
        ind--;
        step_num--;
        performactive(ind, step_num);
    }

});
function performactive(ind, step_num) {
    let dataactive = document.querySelector('.manage_view .div3 .form_div .step_forward.active');
    let removeliactive = document.querySelector('.manage_view .div2 .center_div ul li.active');
    dataactive.classList.remove('active');
    removeliactive.classList.remove('active');
    datacontent[ind].classList.add('active');
    liactive[ind].classList.add('active');
    step_number.innerText = step_num;
    switch (ind) {
        case 0:
            goback.classList.remove('enable');
            firstChild[0].classList.remove('success');
            firstChild[1].classList.remove('success');
            newind = ind + 1;
            nextbtn.innerText = "Next";
            break;
        case 1:
            if (!firstChild[0].classList.contains('success')) {
                firstChild[0].classList.add('success');
            }
            else if (firstChild[0].classList.contains('success') && firstChild[1].classList.contains('success')) {
                firstChild[1].classList.remove('success');
            }
            goback.classList.add('enable');
            newind = ind + 1;
            nextbtn.innerText = "Next";
            break;
        case 2:
            if (!firstChild[1].classList.contains('success')) {
                firstChild[1].classList.add('success');
            }
            else if (firstChild[0].classList.contains('success') && firstChild[1].classList.contains('success')
                && firstChild[2].classList.contains('success')) {
                firstChild[2].classList.remove('success');
            }
            nextbtn.innerText = "Next";
            newind = ind + 1;
            break;
        case 3:
            if (!firstChild[2].classList.contains('success')) {
                firstChild[2].classList.add('success');
            }
            else if (firstChild[0].classList.contains('success') && firstChild[1].classList.contains('success')
                && firstChild[2].classList.contains('success') && firstChild[3].classList.contains('success')) {
                firstChild[3].classList.remove('success');
            }
            nextbtn.innerText = "Next";
            newind = ind + 1;
            break;
        case 4:
            if (!firstChild[3].classList.contains('success')) {
                firstChild[3].classList.add('success');
            }
            nextbtn.innerText = "Submit";
            nextbtn.setAttribute('type', 'submit');
            newind = ind + 1;
            break;
    }
    border_fill.style.width = `calc( ${newind} / 5 * 100%)`;
}

for(i=0;i < stars.length;i++)
{
    ['click','mouseover','mouseout'].forEach((e)=>
    {
        stars[i].addEventListener(e,showRating);
    })
}

function showRating(e)
{
    starValue=+e.target.getAttribute('num');
    let imgAll = e.target.closest('.star_div').querySelectorAll('.material-icons');
    imgAll.forEach((elem,ind)=>
    {
        if(e.type=="click")
        {
            if(ind<starValue)
            {
                elem.innerText='grade';
                elem.classList.add('orange');
                if(elem.classList.contains('yellow'))
                {
                    elem.classList.remove('yellow');
                }
            }
            else
            {
                elem.innerText='star_border';
                elem.classList.remove('orange');
            }
        }
        else if(e.type=="mouseover")
        {
            if(ind<starValue)
            {
                elem.innerText='grade';
                elem.classList.add('yellow');
            }
            else
            {
                elem.innerText='star_border';
                elem.classList.remove('yellow');
                if(elem.classList.contains('orange'))
                {
                    elem.innerText='grade';
                    elem.classList.add('orange');
                    return;
                }
                elem.classList.remove('orange');
            }
        }
        else if(e.type=="mouseout")
        {
            if(elem.classList.contains('yellow') && !elem.classList.contains('orange'))
            {
                elem.innerText="star_border";
            }
            elem.classList.remove('yellow');
        }
    })
}

preventForm.addEventListener('keyup',(e)=>
{
    if(e.keycode===13)
    {
        console.log('hello');
        e.preventDefault();
    }
})
feedbackTrigger.forEach((feedback,ind)=>
{
    feedback.addEventListener('click',function(e)
    {
        chatInd = ind;
        showFeedback = e.target.closest('.position-relative').querySelector('.feedback_appear');
        if(!showFeedback.classList.contains('active'))
        {
            showFeedback.classList.add('active');
            this.src="icons/chatbox_blue.svg";
            feed_overlay.classList.add('active');
        }
        else
        {
            showFeedback.classList.remove('active');
            feed_overlay.classList.remove('active');
            this.src="icons/chatbox_Grey.svg";
        }
    })
})
closeFeedback.forEach((close)=>
{
    close.addEventListener('click',()=>
    {
        if(showFeedback.classList.contains('active'))
        {
            showFeedback.classList.remove('active');
            feedbackTrigger[chatInd].src="icons/chatbox_Grey.svg";
            feed_overlay.classList.remove('active');
        }
    })
})

window.addEventListener('click',(e)=>
{
    if(e.target==feed_overlay)
    {
        showFeedback.classList.remove('active');
        feedbackTrigger[chatInd].src="icons/chatbox_Grey.svg";
        feed_overlay.classList.remove('active');
    }
})

showDraw.forEach((draw)=>
{
    draw.addEventListener('click',(e)=>
    {
        e.target.closest('.upload_box').classList.remove('active');
        e.target.closest('.signature').querySelector('.upload_box2').classList.add('active');
    })
})
clearDraw.forEach((clear)=>
{
    clear.addEventListener('click',(e)=>
    {
        ctx.clearRect(0,0,w,h);
        e.target.closest('.upload_box2').classList.remove('active');
        e.target.closest('.signature').querySelector('.upload_box').classList.add('active');
    })
})

function init() {
    canvas = document.querySelector('.form_div .con5 .upload_box2 #canvas1');
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}
init();

function findxy(res, e) {
    if (res == 'down') {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        flag = true;
        dot_flag = true;
        if (dot_flag) {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
        flag = false;
    }
    if (res == 'move') {
        if (flag) {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
            draw();
        }
    }
}

colorDraw.forEach((getColor)=>
{
    getColor.addEventListener('click',(e)=>
    {
        let color = e.target.getAttribute('colorcode');
        switch (color) {
            case "#2D62ED":
                x = "#2D62ED";
                break;
            case "#F6BE75":
                x = "#F6BE75";
                break;
            case "#1CA9ED":
                x = "#1CA9ED";
                break;
            case "#E2445B":
                x = "#E2445B";
                break;
            case "#211F1F":
                x = "#211F1F";
                break;
            case "#fff":
                x = "#fff";
                break;    
        }
        if (x == "#fff") y = 20;
        else y = 2;
    })
})

function draw() {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}
