const socket = io();
const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

const room = document.querySelector("#room")
room.hidden = true;

let roomName;

function handleMessageSubmit(e){
    e.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You : ${value}`)
    });
    input.value = "";
}

function handleNameSubmit(e){
    e.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value;
    socket.emit("nickname", value);
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`
    
    const nameForm = room.querySelector("#name");
    const msgForm = room.querySelector("#msg");
    nameForm.addEventListener("submit", handleNameSubmit);
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(e){
    e.preventDefault();
    const input = form.querySelector("input");
    // emit({신호}, {데이터}, {서버에서 호출하는 펑션} ... 뭐든 다 보내진다.)
    socket.emit("enter_room",input.value, showRoom);
    roomName = input.value;
    input.value = ""
}

function addMessage(msg){
    const ul = room.querySelector("ul");
    const li = document.createElement("li")
    li.innerText = msg;
    ul.appendChild(li);
}

form.addEventListener("submit", handleRoomSubmit);


socket.on("welcome", (user) => {
    addMessage(`${user} joined`)
})

socket.on("bye", (user) => {
    addMessage(`${user} left!`)
})

socket.on("new_message", addMessage);
// socket.on("new_message", (msg) => addMessage(msg));
