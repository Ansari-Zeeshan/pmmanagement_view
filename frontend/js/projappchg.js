const btnReq = document.querySelector('.mview_req .proj_approval .btn_div .btn.req');
const showReq = document.querySelector('.mview_req .proj_approval .btn_div .reqinfo_popup');
const searchInput = document.querySelector('.mview_req .proj_approval .btn_div .reqinfo_popup .projapp_search input');
const searchInput2 = document.querySelector('.mview_req .proj_approval .btn_div .deleg_popup .projapp_search input');
const contactName = document.querySelectorAll('.mview_req .proj_approval .btn_div .reqinfo_popup .pop_grid .pop_grid2 p');
const contactName2 = document.querySelectorAll('.mview_req .proj_approval .btn_div .deleg_popup .pop_grid .pop_grid2 p');
const btnDeleg = document.querySelector('.mview_req .proj_approval .btn_div .btn.deli');
const showDeleg = document.querySelector('.mview_req .proj_approval .btn_div .deleg_popup');
const showContent = document.querySelectorAll('.proj_approval .proj_form .main_form .mainform_head');
const allCon = document.querySelectorAll('.proj_approval .proj_form .main_form .con_pad');
const root2 = document.querySelector(':root');
const overlay = document.querySelector('.prevOverlay');
// const overlay = document.querySelector('.mview_req .myoverlay');

btnReq.addEventListener('click', () => {
    if (!showReq.classList.contains('show')) {
        showReq.classList.add('show')
        showDeleg.classList.remove('show');
        overlay.classList.add('active');
    } else {
        showReq.classList.remove('show');
    }
})
btnDeleg.addEventListener('click', () => {
    if (!showDeleg.classList.contains('show')) {
        showDeleg.classList.add('show');
        showReq.classList.remove('show');
        overlay.classList.add('active');
    } else {
        showDeleg.classList.remove('show');
    }
})
window.addEventListener('keyup', (e) => {
    if (e.key === "Escape" || e.key === "ESC") {
        if (showReq.classList.contains('show') || showDeleg.classList.contains('show')) {
            showReq.classList.remove('show');
            showDeleg.classList.remove('show');
            overlay.classList.remove('active');
        }
    }
})
window.addEventListener('click', (e) => {
    if (e.target == overlay) {
        if (showReq.classList.contains('show') || showDeleg.classList.contains('show')) {
            showReq.classList.remove('show');
            showDeleg.classList.remove('show');
            overlay.classList.remove('active');
        }
    }
})

window.addEventListener('resize',()=>
{
    if(this.innerWidth<849)
    {
        allCon.forEach((all)=>
        {
            all.style.visibility="hidden";
        })
        showContent.forEach((con,ind)=>
        {
            con.addEventListener('click',()=>
            {
                showConTent(ind,con);
            })
        })
    }
    else
    {
        allCon.forEach((all)=>
        {
            all.style.visibility="visible";
        })
    }
})
window.addEventListener('load',()=>
{
    if(this.innerWidth<849)
    {
        allCon.forEach((all)=>
        {
            all.style.visibility="hidden";
        })
        showContent.forEach((con,ind)=>
        {
            con.addEventListener('click',()=>
            {
                showConTent(ind,con);
            })
        })
    }
    else
    {
        allCon.forEach((all)=>
        {
            all.style.visibility="visible";
        })
    }
})

function showConTent(ind,con)
{
    if(allCon[ind].style.height)
    {
        con.classList.remove('active');
        allCon[ind].style.height = null;
        allCon[ind].style.visibility = 'hidden';
    }
    else
    {
        con.classList.add('active');
        allCon[ind].style.height = `${allCon[ind].scrollHeight + 30}px`;
        allCon[ind].style.visibility = 'visible';
    }
}

searchInput.addEventListener('keyup', (e) => {
    let searchName = e.target.value.toLowerCase();
    contactName.forEach((name) => {
        searchContact(name, searchName);
    })
})
searchInput2.addEventListener('keyup', (e) => {
    let searchName = e.target.value.toLowerCase();
    contactName2.forEach((name) => {
        searchContact(name, searchName);
    })
})

function searchContact(name, searchName) {
    if (name.innerText.toLowerCase().includes(searchName)) {
        let closePop = name.closest('.pop');
        closePop.style.display = "block";
    } else {
        let closePop = name.closest('.pop');
        closePop.style.display = "none";
    }
}