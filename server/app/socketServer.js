const WebSocket = require("ws");
const { RoomService } = require("./service/looby");

const start = (port) => {
  const allSockets = [];
  const wss = new WebSocket.Server({ port });

  //   const generalRoom = RoomService.createRoom(
  //     "https://kraken.tortuga.wtf/hls/films/stan_lee_2023_webdl_1080p_89170/hls/index.m3u8"
  //   );

  wss.on("connection", (ws) => {
    console.log("New client connected");
    allSockets.push(ws);
    // const currentRoom = RoomService.joinRoom(generalRoom, ws);

    ws.on("message", (message) => {
      console.log(`Received command: ${message}. Sending it to all users`);
      allSockets.forEach((member) => {
        if (member !== ws && member.readyState === WebSocket.OPEN) {
          member.send(message, { binary: false });
        }
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      allSockets.filter((member) => {
        return member != ws;
      });
    });
  });
};

module.exports = { start };
