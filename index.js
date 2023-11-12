const express = require("express");
const app = express();
const socketio = require("socket.io")
const PORT = 8080;
const path = require("path");

app.use("/public",express.static(path.join(__dirname, "public")))

const server = app.listen(PORT, ()=>{
  console.log(`listen PORT ${PORT}`);
})

app.get("/", (req,res)=>{
	res.sendFile(__dirname+"/views/index.html");
})
app.get("/chat", (req,res)=>{
	res.sendFile(__dirname+"/views/chat.html");
})
app.get("/yugi", (req,res)=>{
	res.sendFile(__dirname+"/views/yugi.html");
})

const io = socketio(server)

let counterOnline = 0;

io.on("connect", (socket)=>{
	let userName = "";
	// console.log("New user")
	counterOnline++;
	socket.on("status-user", (data)=>{
		userName = data.userName;
		if(data.WhatToDo === "ChangName"){
			// --------------Chang
			// console.log(data.userId + " ChangName --->" +userName)
		}else{
			// --------------start
			// console.log(userName + " connected")
			io.emit("status-user", {
				countOnline: counterOnline
			})
		}
	})
	socket.on('disconnect', ()=>{
		 // console.log(userName + " disconnected");
			io.emit("chat message", {
				msg: "------disconnected-----",
				userId: "",
				userName: userName
			})
			counterOnline--;
			io.emit("status-user", {
				countOnline: counterOnline
			})
	})
	socket.on("chat message", (msg)=>{
		io.emit("chat message", msg);
	})
})