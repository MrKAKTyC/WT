const WebSocket = require("ws");
const { RoomService } = require("./service/room");

const start = (port) => {
  const allSockets = [];
  const wss = new WebSocket.Server({ port });

  //   const generalRoom = RoomService.createRoom(
  //     "https://kraken.tortuga.wtf/hls/films/stan_lee_2023_webdl_1080p_89170/hls/index.m3u8"
  //   );

  wss.on("connection", (ws) => {
    console.log("New client connected");
    allSockets.push(ws);
    const joinListener = (message) => {
      const { command, payload } = JSON.parse(message);
      if (command !== "join") {
        return;
      }
      console.log(`Received command: ${message}`);
      ws.off("message", joinListener);
      RoomService.joinRoom(payload.room, ws);
    };
    ws.on("message", joinListener);
  });
};

module.exports = { start };
