import http from "http";
import WebSocket from "ws";
import express from "express"

const app = express();

app.set("view engine", "pug")
// app.set("views", __dirname + "/src/views") // src까지 할 필요가 없다.
app.set("views", __dirname + "/views")

app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => res.render("home")); // 라우터 핸들러
app.get("/*", (req, res) => res.redirect("/")); // 다른 url 컷컷!

const handleListen = () => console.log('listening on http://localhost:3000');

const server = http.createServer(app); // http 서버
const wss = new WebSocket.Server( { server } ); // 얘도 3000, http서버위에 ws서버를 만듦

//fake DB
const sockets = [];

function onSocketClose(message){
    console.log("Disconnected to Browse💔");
}

wss.on("connection", (socket) => {
    sockets.push(socket) // 사람 추가
    socket["nickname"] = "Anon";
    console.log("Connected to Browser ❤")
    socket.on("close", onSocketClose)
    socket.on("message", (msg) => {
        // socket.send((message).toString()); // 버전차이
        const parsed_msg = JSON.parse(msg);
        switch (parsed_msg.type){
            case "new_message":
                // sockets.forEach(aSocket => aSocket.send(`${socket.nickname}`+" : "+ parsed_msg.payload.toString()));
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}`+" : "+ `${parsed_msg.payload}`));
            case "nickname":
                // sockets.forEach(aSocket => aSocket.send(parsed_msg.payload.toString()))
                socket["nickname"] = parsed_msg.payload;

        }
        // sockets.forEach(aSocket => aSocket.send(message.toString()));
    });
});

server.listen(3000, handleListen);

  