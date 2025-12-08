const { Server } = require("socket.io");
const lets_return = require("./matchs_reload");

let io;

async function io_connect(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5050",
        "https://www.lonescore.com"
      ],
      credentials: true
    }
  });

  io.on("connection", async (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("promise_keeper", (data) => {
      console.log(data);
    });

    socket.emit("God_thank_you", { message: "You are a promise Keeper" });
  });

  // Emit `lets_return()` data to all connected clients every 3 seconds
  setInterval(async () => {
    const data = await lets_return();
    io.emit("Main_data", data); // Emits to all connected clients
  }, 3000);
}

module.exports = io_connect;
