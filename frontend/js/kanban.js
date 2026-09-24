let log = console.log

/* 
    GLOBAL VARIABLES
*/
const cards = document.querySelectorAll('.card1')
const dropzones = document.querySelectorAll('.dropzone')


/* 
    MOVING OUR CARDS 
*/

//function to move our cards
function dragstart(){
    // log("drag start");
    dropzones.forEach( dropzone => dropzone.classList.add('highlight') )
    this.classList.add('is-dragging')
    
}

function drag(){
    log("drag ");
    
}

function dragend(){
    // log("drag end");
    dropzones.forEach( dropzone => dropzone.classList.remove('highlight') )
    this.classList.remove('is-dragging')

}

//adding event to our cards
cards.forEach(card1 => {
    card1.addEventListener('dragstart', dragstart)
    card1.addEventListener('drag', drag)
    card1.addEventListener('dragend', dragend)
})


/* 
    PLACE WHERE WE'LL DROP THE CARDS
*/
function dragenter(){

}

function dragover(){
    this.classList.add('over')
    const cardBeingDragged = document.querySelector('.is-dragging')
    this.appendChild(cardBeingDragged)
}

function dragleave(){
    this.classList.remove('over')
    
}

function drop(){
    this.classList.remove('over')
    
}

dropzones.forEach(dropzone =>{
    dropzone.addEventListener('dragenter', dragenter)
    dropzone.addEventListener('dragover', dragover )
    dropzone.addEventListener('dragleave', dragleave)
    dropzone.addEventListener('drop', drop)
})