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

// function handleConnection(socket){
//     console.log(socket);
// };

wss.on("connection", (socket) => {
    console.log("Connected to Browser ❤")
    socket.on("close", () => console.log("Connected to Browse💔"))
    socket.on("message", (message) => {console.log(message.toString('utf8'))})
    socket.send("hello!!!"); // data에 담겨온다.
});

server.listen(3000, handleListen);