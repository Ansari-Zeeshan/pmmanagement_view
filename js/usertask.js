const usertask1 = document.querySelector('.user_task .user_add');
const addinRow= document.querySelector('.user_task .row.mt-5');
const s1= document.querySelector('.user .bottom_navigate #pageLen');
const nextPage= document.querySelector('.user .bottom_navigate .pagination #ArrowNext');
const prevPage= document.querySelector('.user .bottom_navigate .pagination #ArrowDisable');
const enabled= document.querySelector('.user .bottom_navigate .pagination .page-item.disabled');

let p1,p2,p3,p4,p5,p6,status1,status2,newuserAdd=[],selectInput = 10,can_rem=0,can_div,can_divText,mulnum = 1, countPage=0,enableIcon;

const state=
[
    {state1 : 'Low',  state2 : 'Approved'},{state1 : 'Medium',   state2 : 'Medium'},{state1 : 'High',   state2 : 'Off Track'},
    {state1 : 'Medium',  state2 : 'Approved'},{state1 : 'Low', state2 : 'On Track'},{state1 : 'At Risk', state2 : 'Low' },
    {state1 : 'Medium', state2 : 'Hign'},{state1 : 'Off Track', state2 : 'Low'},{state1 : 'Approved', state2 : 'High'},
    {state1 : 'At Risk', state2 : 'Approved'},{state1 : 'Approved', state2 : 'Approved'},{state1 : 'Medium',state2 : 'Approved'},
    {state1 : 'On Track',state2 : 'Approved'},{state1 : 'At Risk',state2 : 'Approved'},{state1 : 'At Risk',state2 : 'Approved'},
    {state1 : 'At Risk',state2 : 'Approved'},{state1 : 'At Risk', state2 : 'Approved'},{state1 : 'At Risk',state2 : 'Approved'},
    {state1 : 'At Risk',state2 : 'At Risk'},{state1 : 'At Risk', state2 : 'At Risk'},{state1 : 'At Risk', state2 : 'At Risk'},
    {state1 : 'At Risk',state2 : 'At Risk'},{state1 : 'At Risk', state2 : 'Approved'},{state1 : 'At Risk', state2 : 'Approved'},
    {state1 : 'At Risk',state2 : 'Approved'},{state1 : 'At Risk', state2 : 'Approved'},{state1 : 'At Risk', state2 : 'Approved'},
    {state1 : 'Medium',state2 : 'On Track'},{state1 : 'Medium',state2 : 'On Track'},{state1 : 'Medium',state2 : 'On Track'},
    {state1 : 'At Risk',state2 : 'On Track'},{state1 : 'Off Track',state2 : 'On Track'},{state1 : 'Off Track',state2 : 'Approved'},
    {state1 : 'Off Track',state2 : 'Approved'},{state1 : 'Off Track',state2 : 'Approved'},{state1 : 'At Risk',state2 : 'Approved'},
    {state1 : 'High',state2 : 'Approved'},{state1 : 'High',state2 : 'Low'},{state1 : 'High',state2 : 'Approved'},
    {state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},
    {state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},
    {state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},
    {state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},
    {state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},
    {state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},
    {state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},
    {state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},
    {state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},{state1 : 'At Risk', state2 : 'Medium'},

]    

s1.addEventListener('change',()=>
{
    selectInput = s1.options[s1.selectedIndex].value;
    setPagination(selectInput);
    mulnum=1;
    countPage=0;
    nextPage.classList.remove('disabled');
    prevPage.classList.add('disabled');
    sliceData(mulnum);
    let refDiv= document.querySelectorAll('.user .bottom_navigate .rightone nav ul .can_remove');
    // console.log(refDiv.length);
    if(refDiv.length===1)
    {
        nextPage.classList.add('disabled');
        prevPage.classList.add('disabled');
    }
})

function cloneTask()
{
    for(let i=0;i<35;i++)
    {
        let clone1=usertask1.cloneNode(true);
        addinRow.appendChild(clone1);
        newuserAdd.push(clone1);
    }
    p1 = document.querySelectorAll('.user_task .userdiv1 p');
    p2 = document.querySelectorAll('.user_task .userdiv2 p');
    p3 = document.querySelectorAll('.user_task .userdiv3 p');
    p4 = document.querySelectorAll('.user_task .userdiv4 p');
    p5 = document.querySelectorAll('.user_task .userdiv5 p');
    p6 = document.querySelectorAll('.user_task .userdiv6 p');
    status1 = document.querySelectorAll('.user_task .userdiv7 div');
    status2 = document.querySelectorAll('.user_task .userdiv8 div');

    status1.forEach((status,ind)=>
    {
        status.innerText=state[ind].state1;
        setstatusData(status,ind);
    })
    status2.forEach((status,ind)=>
    {
        status.innerText=state[ind].state2;
        setstatusData(status,ind);
    })
}
cloneTask()

function setstatusData(status,ind)
{
    let statusText = status.innerText;
    switch(statusText)
    {
        case 'Low':
        {
            status.classList.add('low');
            break;
        }
        case 'Medium':
        {
            status.classList.add('medium');
            break;
        }
        case 'Approved':
        {
            status.classList.add('approved');
            break;
        }
        case 'On Track':
        {
            status.classList.add('ontrack');
            break;
        }
        case 'Off Track':
        {
            status.classList.add('offtrack');
            break;
        }
        case 'High':
        {
            status.classList.add('high');
            break;
        }
        case 'At Risk':
        {
            status.classList.add('atrisk');
            break;
        }
    }
}

function assignData()
{
    for(let i=0;i<p1.length;i++)
    {
        p1[i].innerHTML = p1[i].innerHTML;
        p2[i].innerHTML = p2[i].innerHTML;
        p3[i].innerHTML = p3[i].innerHTML;
        p4[i].innerHTML = p4[i].innerHTML;
        p5[i].innerHTML = p5[i].innerHTML;
        p6[i].innerHTML = p6[i].innerHTML;
    }
}
assignData()

function defaultShow()
{
    let slicePart = newuserAdd.slice(0,selectInput);
    newuserAdd.forEach((EachChild)=>
    {
        EachChild.remove();
    })
    slicePart.map(data=>
    {
        addinRow.appendChild(data);
    })
}
defaultShow();

function defaultPagination()
{
    let targetLength = newuserAdd.length;
    let loopLength = Math.ceil(targetLength/10);
    let pageNum = [];
    for(let i=0; i<loopLength; i++)
    {
      let num = Math.ceil(targetLength/10);
      pageNum.push(num);
      targetLength=targetLength-10;
    }
    let addPageNum = document.querySelector('.user .bottom_navigate .rightone nav ul #ArrowDisable');
    if(can_rem!=0)
    {
        can_div.forEach((remNode)=>
        {
            remNode.remove();
        })
    }
    pageNum.map(num=>
    {
       let li = document.createElement('li');
       li.setAttribute('class','page-item can_remove')
       let span = document.createElement('span');
       span.setAttribute('class','page-link');
       span.innerText=num;
       li.appendChild(span);
       addPageNum.insertAdjacentElement('afterend', li);    
    })
    can_div= document.querySelectorAll('.user .bottom_navigate .rightone nav ul .can_remove');
    can_divText= document.querySelectorAll('.user .bottom_navigate .rightone nav ul .can_remove span');
    can_div[0].classList.add('active');
    can_rem=can_div.length;
    can_divText.forEach(navigatePage=>
    {
        navigatePage.addEventListener('click',(e)=>
        {
            let refDiv= document.querySelectorAll('.user .bottom_navigate .rightone nav ul .can_remove');
            mulnum = +e.target.innerText;
            switch(true)
            {
                case (mulnum<refDiv.length && mulnum>1) :
                {
                    nextPage.classList.remove('disabled');
                    prevPage.classList.remove('disabled');
                    break;
                }
                case (mulnum < refDiv.length && mulnum>=1) :
                {
                    nextPage.classList.remove('disabled');
                    prevPage.classList.add('disabled');
                    break;
                }
                case (mulnum == refDiv.length) :
                {
                    nextPage.classList.add('disabled');
                    prevPage.classList.remove('disabled');
                    break;
                }    
            }
            e.target.closest('.pagination').querySelector('.page-item.active').classList.remove('active');
            e.target.closest('.page-item').classList.add('active');
            countPage=mulnum -1;
            sliceData(mulnum);
        })
    })
}
defaultPagination()

function setPagination(selectInput)
{
    let targetLength = newuserAdd.length;
    let loopLength = Math.ceil(targetLength/selectInput);
    let pageNum = [];
    for(let i=0; i<loopLength; i++)
    {
      let num = Math.ceil(targetLength/selectInput);
      pageNum.push(num);
      targetLength=targetLength-selectInput;
    }
    let addPageNum = document.querySelector('.user .bottom_navigate .rightone nav ul #ArrowDisable');
    if(can_rem!=0)
    {
        can_div.forEach((remNode)=>
        {
            remNode.remove();
        })
    }
    pageNum.map(num=>
    {
       let li = document.createElement('li');
       li.setAttribute('class','page-item can_remove')
       let span = document.createElement('span');
       span.setAttribute('class','page-link');
       span.innerText=num;
       li.appendChild(span);
       addPageNum.insertAdjacentElement('afterend', li);    
    })
    can_div= document.querySelectorAll('.user .bottom_navigate .rightone nav ul .can_remove');
    can_divText= document.querySelectorAll('.user .bottom_navigate .rightone nav ul .can_remove span');
    can_div[0].classList.add('active');
    can_rem=can_div.length;
    can_divText.forEach(navigatePage=>
    {
        navigatePage.addEventListener('click',(e)=>
        {
            let refDiv= document.querySelectorAll('.user .bottom_navigate .rightone nav ul .can_remove');
            mulnum = +e.target.innerText;
            switch(true)
            {
                case (mulnum<refDiv.length && mulnum>1) :
                {
                    nextPage.classList.remove('disabled');
                    prevPage.classList.remove('disabled');
                    break;
                }
                case (mulnum < refDiv.length && mulnum>=1) :
                {
                    nextPage.classList.remove('disabled');
                    prevPage.classList.add('disabled');
                    break;
                }
                case (mulnum == refDiv.length) :
                {
                    nextPage.classList.add('disabled');
                    prevPage.classList.remove('disabled');
                    break;
                }    
            }
            e.target.closest('.pagination').querySelector('.page-item.active').classList.remove('active');
            e.target.closest('.page-item').classList.add('active');
            countPage=mulnum -1;
            sliceData(mulnum);
        })
    })
}
nextPage.addEventListener('click',(e)=>
{   
    let refDiv= document.querySelectorAll('.user .bottom_navigate .rightone nav ul .can_remove');
    if(enabled.classList.contains('disabled'))
    {
        enabled.classList.remove('disabled');
    }
    countPage++;
    if(countPage < refDiv.length)
    {
        let lastPage = refDiv.length -1;
        if(countPage==lastPage)
        {
            e.target.closest('.page-item').classList.add('disabled');
        }
        mulnum++;
        sliceData(mulnum);
        e.target.closest('.pagination').querySelector('.page-item.active').nextElementSibling.classList.add('active');
        e.target.closest('.pagination').querySelector('.page-item.active').classList.remove('active');
    }
    else
    {
        countPage--;
        e.target.closest('.page-item').classList.add('disabled');
        return;
    }
})

prevPage.addEventListener('click',(e)=>
{   
    let refDiv= document.querySelectorAll('.user .bottom_navigate .rightone nav ul .can_remove');
    if(nextPage.classList.contains('disabled'))
    {
        nextPage.classList.remove('disabled');
    }
    countPage--;
    if(countPage < refDiv.length && countPage>=0)
    {
        if(countPage==0)
        {
            e.target.closest('.page-item').classList.add('disabled');
        }
        mulnum--;
        sliceData(mulnum);
        let finalActive = e.target.closest('.pagination').querySelector('.page-item.active').previousElementSibling;
        for(let i=0; i<refDiv.length; i++)
        {
            refDiv[i].classList.remove('active');
        }
        finalActive.classList.add('active');
    }
    else if(countPage<0)
    {
        countPage++;
        e.target.closest('.page-item').classList.add('disabled');
        return;
    }
})

function sliceData(mulnum)
{
    let targetValue = selectInput * mulnum;
    let initialValue = targetValue - selectInput;
    let slicePart = newuserAdd.slice(initialValue,targetValue);
    newuserAdd.forEach((EachChild)=>
    {
        EachChild.remove();
    })
    slicePart.map(data=>
    {
        addinRow.appendChild(data);
    })
}
     