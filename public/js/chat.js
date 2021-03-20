

const socket =io();
// socket.on('countUpdated', (count)=>{
//     console.log('THE Count Has been updated to ', count);
// });
// socket.on('welcomeMessage', (greeting)=>{
//     document.querySelector('#greeting').innerHTML = greeting;
// });

// ELEMENTS 
const $msgBtn = document.querySelector('#send-msg-btn');
const $messageForm = document.querySelector('#message-form');
const $messageInput = document.getElementById('message-input');
const $locationBtn = document.querySelector('#send-location');
const $messagesContainer = document.querySelector('#messages');
const $locationContainer = document.querySelector('#location-container');

// TEMPALTES

const messageTempalte = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-message-template').innerHTML;

//OPTIONS
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true});

console.log(options);
socket.on('message', (message)=>{
 
    const html = Mustache.render(messageTempalte,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')

        });
  
    $messagesContainer.insertAdjacentHTML('beforeend',html);
    
});

socket.on('locationMessage', (message)=>{
    const html = Mustache.render(locationTemplate,{
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')

        });
 $locationContainer.insertAdjacentHTML('beforeend',html);
});
 

// document.querySelector('#increment').addEventListener('click', ()=>{

//     socket.emit('increment');
// });


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const userMessage = $messageInput.value;
    $messageInput.disabled = true;
    $msgBtn.disabled=true;
    $messageInput.value ='';
    $messageInput.focus();

    socket.emit('sendMessage', userMessage, (err)=>{
        $msgBtn.disabled=false;
        $messageInput.disabled = false;
        if(err){
            return console.log(err);
        }
        console.log('messaged delievered');
    });
     
});


$locationBtn.addEventListener('click', ()=>{
    $locationBtn.disabled=true;
    if(!navigator.geolocation){
        return alert('Location sharing is not supported for this browser');
    }
    navigator.geolocation.getCurrentPosition((position)=>{
    
        const locationCordinates = {latitude : position.coords.latitude, longitute: position.coords.longitude};
        socket.emit('sendLocation', locationCordinates, ()=>{
            $locationBtn.disabled= false;
        });
    });
});


socket.emit('join', {username,room});