
const {Server} = require("socket.io")
const lets_return = require("./matchs_reload")

let io
async function io_connect(server){
	io = new Server(server, {
		cors : {
			origin : "https://www.lonescore.com"
		}
	})


	io.on("connection", async(socket)=>{
	

		

		


			socket.on("promise_keeper", (data)=>{
				console.log(data)
			})
				const data = await lets_return()

				setTimeout(

			socket.emit("Main_data", data), 3000)


			socket.emit("God_thank_you", {message : "You are a promise Keeper"})
	})
}

module.exports = io_connect