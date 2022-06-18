import http from "http";
import {Server} from "socket.io"; // http://localhost:3000/socket.io/socket.io.js
import {instrument} from "@socket.io/admin-ui"
import express from "express";

const app = express();

app.set("view engine", "pug")
app.set("views", __dirname + "/views")

app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req, res) => res.render("home")); // 라우터 핸들러
app.get("/*", (req, res) => res.redirect("/")); // 다른 url 컷컷!

const handleListen = () => console.log('listening on http://localhost:3000');

const httpServer = http.createServer(app); // http 서버
// const wsServer = SocketIO(httpServer) // 3000, http서버 위에 만듦
const wsServer = new Server(httpServer, {
    cors:{
        origin: ["https://admin.socket.io"],
        credentials:true,
    },
});

instrument(wsServer, {
    auth: false
})


function publicRooms(){
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.sockets.adapter.rooms;
    const {
        sockets : {
            adapter : {sids, rooms},
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) =>{
        if(sids.get(key) === undefined){
            publicRooms.push(key)
        }
    })
    return publicRooms;
}

function countRoom(roomName){
    console.log(wsServer.sockets.adapter.rooms.get(roomName)?.size)
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket)=>{
    socket["nickname"] = "Anon"
    socket.onAny((e) => {
        console.log(`Socket Event:${e}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));  
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    });
    socket.on("nickname", nickname => socket["nickname"] = nickname);

})
function onSocketClose(message){
    console.log("Disconnected to Browse💔");
}

httpServer.listen(3000, handleListen);

  
