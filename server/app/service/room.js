const WebSocket = require("ws");

const RoomService = {
  storage: {},

  // Static staff
  generateRoomId: () => {
    const alphanumericChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
      randomString += alphanumericChars.charAt(randomIndex);
    }

    return randomString;
  },

  createRoom: (videoSource) => {
    const roomId = RoomService.generateRoomId();
    RoomService.storage[roomId] = { members: [], source: videoSource };
    return roomId;
  },

  getRoom: (roomId) => {
    return RoomService.storage?.[roomId];
  },

  // WS staff
  joinRoom: (roomToJoin, wSocket) => {
    const room = RoomService.storage?.[roomToJoin];
    room?.members.push({ socket: wSocket });
    wSocket.on("message", (message) => {
      const { command, payload } = JSON.parse(message);
      console.log(`Received command: ${message}. Sending it to all users`);
      room.members.forEach((member) => {
        if (
          member.socket !== wSocket &&
          member.socket.readyState === WebSocket.OPEN
        ) {
          member.socket.send(message, { binary: false });
        }
      });
    });
    wSocket.on("close", () => {
      console.log(
        `Client disconnected, current count: [${room?.members.length}]`
      );
      room.members = room.members.filter((member) => {
        return member.socket != wSocket;
      });
    });
    console.log(`clients count ${room?.members.length}`);
    return room;
  },

  leaveRoom: (roomToLeave, wSocket) => {
    RoomService.storage?.[roomToLeave]?.members.filter((member) => {
      return member.socket !== wSocket;
    });
  },
};

module.exports = { RoomService };
