const messageList = document.querySelector("ul")
const nickForm =  document.querySelector("#nick")
const messageForm =  document.querySelector("#message")
// const socket = new WebSocket(`http://localhost:3000}`);
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload){
    const msg = {type, payload}; 
    return JSON.stringify(msg);
}

function handleOpen() {
    console.log("Connected to Server ⭕");
  }

socket.addEventListener("open", handleOpen)

socket.addEventListener("message", (message) =>{
    // console.log("New message:", message.data)
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server~❌")
});

function handleSummit(e){
    e.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You ${input.value}`;
    messageList.append(li);
    input.value = "";
}

function handleNickSummit(e){
    e.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(
        // { //이 형식은 유지되는가?
        // type:"nickname",
        // payload:input.value,
        // }
        makeMessage("nickname", input.value)
    );
    input.value = "";
}

messageForm.addEventListener("submit", handleSummit);
nickForm.addEventListener("submit", handleNickSummit)