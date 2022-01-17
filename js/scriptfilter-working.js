const showFilter = document.querySelector('.divfilter2 .top_up2 ul li:nth-child(2)');
const filterdiv = document.querySelector('.divfilter2 .top_up2 .filter_div');
const overlay = document.querySelector('.proj_filter .myoverlay');
const milediv = document.querySelector('.proj_filter .divfilter2 .project1 .expand .border-bottom .divcon3 #tree_open');
const showMile = document.querySelector('.proj_filter .divfilter2 .project1 .projectcon1 .milestone');
const milediv2 = document.querySelector('.proj_filter .divfilter2 .project1 .projectcon1 .milestone p');
const showMile2 = document.querySelector('.proj_filter .divfilter2 .project1 .projectcon1 .milestone .milehide');
const showFinalmile = document.querySelector('.proj_filter .divfilter2 .project1 .projectcon1 .main_mile');
const finalmile1 = document.querySelector('.proj_filter .divfilter2 .project1 .projectcon1 .milestone  .milestone2');
const finalmile2 = document.querySelector('.proj_filter .divfilter2 .project1 .projectcon1 .milestone .milestone2 div');
const finalmile3 = document.querySelector('.proj_filter .divfilter2 .project1 .projectcon1 .milestone .milestone2 button');
const showTable = document.querySelectorAll('.proj_filter .divfilter2 .project1 .projectcon1 .head1 span:first-child');
const addColumn = document.querySelector('.proj_filter .divfilter2 .project1 .projectcon1 .head9 button');
let root = document.querySelector(':root');
let divfilter = document.querySelector('.divfilter2');
let tabnum = document.querySelectorAll('.divfilter2 .tab_content');
let mainul = document.querySelectorAll('.divfilter2 .top_up ul li');
let liIcon = document.querySelectorAll('.divfilter2 .top_up ul li i');
console.log(addColumn);

showFilter.addEventListener('click', (e) => {
    if (!filterdiv.classList.contains('showfilter')) {
        filterdiv.classList.add('showfilter');
        showFilter.classList.add('active');
        overlay.classList.add('active');
    }
    else {
        hideFilterdiv();
    }
})
window.addEventListener('click', (e) => {
    if (e.target == overlay) {
        hideFilterdiv();
        hideAddview();
    }
})

function hideFilterdiv() {
    filterdiv.classList.remove('showfilter');
    showFilter.classList.remove('active');
    overlay.classList.remove('active');
}
function hideAddview() {
    mainul[mainul.length - 1].classList.remove('active');
    divfilter.querySelector('.addview').classList.remove('active');
    tabnum[0].classList.add('active');
    mainul[0].classList.add('active');
}

milediv.addEventListener('click', () => {
    if (!showMile.classList.contains('showmilestone')) {
        showMile.classList.add('showmilestone');
        root.style.setProperty("--caret", '"\f0d7"');
    }
    else {
        showMile.classList.remove('showmilestone');
        showMile2.classList.remove('showmilestone2');
        showFinalmile.classList.remove('showmain_mile');
    }
})

milediv2.addEventListener('click', () => {
    if (!showMile2.classList.contains('showmilestone2')) {
        showMile2.classList.add('showmilestone2');
    }
    else {
        showMile2.classList.remove('showmilestone2');
    }
})

finalmile1.addEventListener('click', () => {
    showFinal();
})

function showFinal() {
    if (!showFinalmile.classList.contains('showmain_mile')) {
        showFinalmile.classList.add('showmain_mile');
        showMile.classList.add('showmilestone');
        showMile2.classList.remove('showmilestone2');
    }
    else {
        showFinalmile.classList.remove('showmain_mile');
    }
}

mainul.forEach((val) => {
    val.addEventListener('click', (e) => {
        let li = e.target;
        if (!e.target.classList.contains('active')) {
            let target = e.target.getAttribute('data-target');
            if (target === '.addview') {
                showaddView(target, li);
                return;
            }
            showTabCon(target, li);
        }
    })
});
liIcon.forEach((val) => {
    val.addEventListener('click', (e) => {
        e.stopPropagation();
        let li = e.target.closest('li');
        if (!li.classList.contains('active')) {
            let target = li.getAttribute('data-target');
            if (target === '.addview') {
                showaddView(target, li);
                return;
            }
            showTabCon(target, li);
        }
    })
});

function showTabCon(target, li) {
    let removeactive = divfilter.querySelector('ul li.active');
    removeactive.classList.remove('active');
    for (let i = 0; i < tabnum.length; i++) {
        tabnum[i].classList.remove('active');
    }
    li.classList.add('active');
    divfilter.querySelector(target).classList.add('active');
}

function showaddView(target, li) {
    let removeactive = divfilter.querySelector('ul li.active');
    let removeCon = removeactive.getAttribute('data-target');
    removeactive.classList.remove('active');
    divfilter.querySelector(removeCon).classList.add('active');
    li.classList.add('active');
    divfilter.querySelector(target).classList.add('active');
    overlay.classList.add('active');
}

showTable.forEach((expand) => {
    expand.addEventListener('click', (e) => {
        let expand_div = e.target.closest('.projectcon1').querySelector('.expand');
        if (!expand_div.classList.contains('active')) {
            expand_div.classList.add('active');
        }
        else {
            expand_div.classList.remove('active');
        }
    })
})

addColumn.addEventListener('click', (e) => {
    let target = e.target;
    let dropmenu = e.target.closest('.head9').querySelector('.dropdown-menu');
    if (dropmenu.classList.contains('show')) {
        target.innerText = 'clear';
    }
    else {
        target.innerText = "add";
    }
}, true);