const userAdd = document.querySelector('.proj_filter .proj_add .assignee_div .usersearch_div #getdata');
const username = searchDiv.querySelectorAll('.user-list .info-div h6');
const appendUser = searchDiv.querySelectorAll('.user-list .hover_div > .row');
const userListshow = document.querySelector('.proj_filter .proj_add .assignee_div #useradd');
const hoverDiv = searchDiv.querySelectorAll('.user-list .hover_div');
const countMember = searchDiv.querySelector('.countmem p span');

userListshow.addEventListener('click',()=>
{
    if(!searchDiv.classList.contains('active'))
    {
        searchDiv.classList.add('active');
        assignee_overlay.classList.add('active');
        countMember.innerText=`${hoverDiv.length}`;
    }
})

appendUser.forEach((append)=>
{
    append.addEventListener('click',(e)=>
    {
        let targetImg = e.target.closest('.hover_div').querySelector('.img-div');
        let cloneImgdiv = targetImg.cloneNode(true);
        let appendBox = e.target.closest('.assignee_div').querySelector('.userBox');
        appendBox.insertBefore(cloneImgdiv, appendBox.childNodes[0]);
        searchDiv.classList.remove('active');
        assignee_overlay.classList.remove('active');
    },true)
})

//searching option
userAdd.addEventListener('keyup', (e) => {
    if (e.key === 'Escape' || e.key==="ESC") {
        searchDiv.classList.remove('active');
        return;
    }
    filterUser(e.target.value);
})

const filterUser = (searchword) => {
    searchword = searchword.toLowerCase();
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
