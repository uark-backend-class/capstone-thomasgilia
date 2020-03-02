//temporary code
const myHeader = document.querySelector('#logo');

myHeader.textContent = 'My new homepage!';

document.addEventListener('mousemove', event => {       
    let divNode = document.querySelector('#mousemovediv');      //telling it where in the html we'll put info
    divNode.textContent = event.pageX + ', ' + event.pageY;     //pushing the info from the event into the visible 
    //text portion of html. i.e. will show coords in browser
});