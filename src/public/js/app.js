const socket = io();
const welcome = document.querySelector("#welcome");
const roomForm = welcome.querySelector("form");

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
    const input = roomForm.querySelector("input");
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

roomForm.addEventListener("submit", handleRoomSubmit);


socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`
    addMessage(`${user} joined`)
})

socket.on("bye", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`
    addMessage(`${user} left!`)
})

socket.on("new_message", addMessage);
// socket.on("new_message", (msg) => addMessage(msg));

socket.on("room_change", (rooms) =>{
    const roomList = welcome.querySelector("ul");
    if(rooms.length === 0){
        roomList.innerHTML = "";
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.appendChild(li);
    })
});