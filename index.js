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

const io = socketio(server)

// io.on("connect", (socket)=>{
	
	// console.log("New user")
	// socket.on("chat message", (msg)=>{
		// io.emit("chat message", msg);
	// })
	
// })

io.on("connect", (socket)=>{
	
	// console.log("New user")
	
	socket.on("status-user", (name)=>{
		let userName = name;
		console.log(userName.userName + " connected")
		
		socket.on('disconnect', ()=>{
			console.log(userName.userName + " disconnected");
			
			io.emit("chat message", {
				msg: "------disconnected-----",
				userId: "",
				userName: userName.userName
			})
		})
		
	})
	
	socket.on("chat message", (msg)=>{
		io.emit("chat message", msg);
	})
})