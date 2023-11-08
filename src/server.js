import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import path, { parse } from "path";

const app = express();
const __dirname = path.resolve();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on io`);

// http + ws 구성
const httpServer = createServer(app);
// es 표기
const io = new Server(httpServer);

io.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`socket event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
    });
});

httpServer.listen(3000, handleListen);
