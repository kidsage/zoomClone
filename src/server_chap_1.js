import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import express from "express";
import path, { parse } from "path";

const app = express();
// __dirname > commonjs가 아닌 ES 방식에서는 선언해줘야 하는 듯 하다.
const __dirname = path.resolve();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on ws`);
// app.listen(3000, handleListen);

// http + ws 구성
const server = http.createServer(app);
// ws version마다 constructor를 지원하지 않는 것들이 있나 봄. 해결 방법은 WebSocketServer사용.
const wss = new WebSocketServer({ server });

// commonjs 형식
// function handleConnection(socket) {
//     console.log(socket);
// }
// wss.on("connection", handleConnection);

function onSocketClose() {
    console.log("Disconnected from browser");
}

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    console.log("Connected to Browser!");
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {
        // buffer로 오는 것을 string으로 변경
        // const message = isBinary ? data : data.toString();
        const message = JSON.parse(msg);
        // console.log(parsed, message.toString());
        switch (message.type) {
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
            case "nickname":
                socket["nickname"] = message.payload;
        }
    });
});

server.listen(3000, handleListen);
