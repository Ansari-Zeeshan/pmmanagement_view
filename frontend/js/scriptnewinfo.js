const nextbtn = document.querySelector('.manage_view .div3 .step_wise button.active');
const liactive = document.querySelectorAll('.manage_view .div2 .center_div ul li');
const border_fill = document.querySelector('.manage_view .div3 .step_wise .border_step');
const step_number = document.querySelector('.manage_view .div3 .step_wise .center_step span.active');
const datacontent = document.querySelectorAll('.manage_view .div3 .form_div .step_forward');
const goback = document.querySelector('.manage_view .div3 .step_wise #goback');
let removerow = document.querySelectorAll('.manage_view .div3 .con5 .user-list button');
const getinput = document.querySelector('.manage_view .div3 .con5 #getdata');
let hoverdiv = document.querySelectorAll('.manage_view .div3 .con5 .user-list .hover_div');
const highlight = document.querySelector('.manage_view .div3 .con5 .highlight_div');
const usernum = document.querySelector('.manage_view .div3 .con5 .sep_div p span');
let firstChild = document.querySelectorAll('.manage_view .div2 .center_div ul li div:first-child');
let selected = document.querySelectorAll('.manage_view .div3 .form_div form select');
const boxTrigger = document.querySelectorAll('.box11');
const boxArrow = document.querySelectorAll('.box11 img');
const boxContent = document.querySelectorAll('.box11 p');
const options = document.querySelectorAll('.option-container .option');
const optionsCon = document.querySelectorAll('.option-container p');
const optContain = document.querySelectorAll('.option-container');
const form_overlay = document.querySelector('.form_overlay');
let ind = 0, step_num = 1, username, infoselect, infospan;

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

removerow.forEach((btn, ind) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let parent = e.target.parentNode.parentNode;
        let delNode = parent.closest('.user-list').querySelector('.hover_div');
        // let delhigh = parent.closest('.step_forward').querySelector('.highlight_div');
        // let delNode2 = delhigh.querySelectorAll('.hover_div');
        delNode.remove();
        hoverdiv = document.querySelectorAll('.manage_view .div3 .con5 .user-list .hover_div');
        usernum.innerText = hoverdiv.length;
    })
})

function clonediv() {
    usernum.innerText = hoverdiv.length;
    border_fill.style.width = `calc( 1 / 5 * 100%)`;
    for (let i = 0; i < hoverdiv.length; i++) {
        let clone = hoverdiv[i].cloneNode(true);
        highlight.appendChild(clone);
    }
    infoselect = document.querySelectorAll('.manage_view .div3 .con5 .highlight_div .hover_div .info-div div p');
    setclass();
}
clonediv();

function setclass() {
    let rownew = document.querySelectorAll('.manage_view .div3 .con5 .highlight_div .row');
    let delbtn = document.querySelectorAll('.manage_view .div3 .con5 .highlight_div .row .info-div .btn');
    rownew.forEach((row) => {
        row.setAttribute('class', 'row mt-3');
    })
    delbtn.forEach((delnode) => {
        delnode.remove();
    })
    makinginvitediv();
}

function makinginvitediv() {
    let row = document.createElement('row');
    row.setAttribute('class', 'row invite_main');

    let div1 = document.createElement('div');
    div1.setAttribute('class', 'col-md-1');
    let icon = document.createElement('i');
    icon.setAttribute('class', 'fas fa-plus');
    div1.appendChild(icon);

    let div2 = document.createElement('div');
    div2.setAttribute('class', 'col-md-4');
    let h4 = document.createElement('h4');
    h4.innerHTML = 'Invite via Email:';
    div2.appendChild(h4);

    let div3 = document.createElement('div');
    div3.setAttribute('class', 'col-md-5');
    let span = document.createElement('span');
    span.innerHTML = 'peter@emaar.com';
    div3.appendChild(span);

    row.appendChild(div1);
    row.appendChild(div2);
    row.appendChild(div3);
    highlight.appendChild(row);
    infospan = document.querySelector('.manage_view .div3 .con5 .highlight_div .invite_main .col-md-5 span');
    username = document.querySelectorAll('.manage_view .div3 .con5 .highlight_div .info-div h6');
}
username.forEach((uname) => {
    ['click', 'mouseover'].forEach((e) => {
        uname.addEventListener(e, performInfo);
    })
})

infoselect.forEach((info) => {
    ['click', 'mouseover'].forEach((e) => {
        info.addEventListener(e, performInfo);
    })
})
function performInfo(e) {
    if (e.type === 'click') {
        let targetinfo = e.target.parentNode.querySelector('div h6').innerText;
        getinput.value = targetinfo;
        highlight.style.cssText = "opacity:0; visibility:hidden;";
    }
    if (e.type === 'mouseover') {
        let targetemail = e.target.parentNode.querySelector('div p').innerText;
        infospan.innerHTML = `" ${targetemail}"`;
    }
}

selected.forEach((select) => {
    select.addEventListener('change', (e) => {
        console.log(e.type);
        select.classList.add('option_selected');
    })
})
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
    username = document.querySelectorAll('.manage_view .div3 .con5 .highlight_div .info-div h6');
    Array.from(username).forEach((uname) => {
        let label = uname.innerText.toLowerCase();
        if (label.includes(searchword)) {
            let parentrow = uname.parentNode.parentNode;
            let show = parentrow.closest('.hover_div');
            show.style.display = "block";
        }
        else {
            let parentrow = uname.parentNode.parentNode;
            let hide = parentrow.closest('.hover_div');
            hide.style.display = "none";
        }
    })
}

boxTrigger.forEach((box,ind)=>
{
    box.addEventListener('click',(e)=>
    {
        pindex = ind;
        if(!optContain[ind].classList.contains('active'))
        {
            form_overlay.classList.add('active');
            optContain[ind].classList.add('active')  
            boxArrow[ind].classList.add('active');
        }
        else
        {
            form_overlay.classList.remove('active');
            optContain[ind].classList.remove('active')  
            boxArrow[ind].classList.remove('active');
        }
    })
})
options.forEach((option)=>
{
    option.addEventListener('click',(e)=>
    {
        e.stopPropagation();
        boxContent[pindex].style.color="#000";
        boxContent[pindex].innerText=e.target.querySelector('p').innerText; 
        optContain[pindex].classList.remove('active') 
        boxArrow[pindex].classList.remove('active');
        form_overlay.classList.remove('active');
    })
})
optionsCon.forEach((option)=>
{
    option.addEventListener('click',(e)=>
    {
        e.stopPropagation();
        boxContent[pindex].style.color="#000";
        boxContent[pindex].innerText=e.target.innerText;
        optContain[pindex].classList.remove('active') 
        boxArrow[pindex].classList.remove('active');
        form_overlay.classList.remove('active');
    })
})

window.addEventListener('click',(e)=>
{
    if(e.target==form_overlay)
    {
        optContain[pindex].classList.remove('active');
        form_overlay.classList.remove('active');
        boxArrow[pindex].classList.remove('active');
    }
})
