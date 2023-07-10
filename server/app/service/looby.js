const RoomService = {
  storage: {},

  createRoom: (videoSource) => {
    const roomURL = "asd";
    RoomService.storage[roomURL] = { members: [], source: videoSource };
    return roomURL;
  },

  joinRoom: (roomToJoin, wSocket) => {
    const room = RoomService.storage?.[roomToJoin];
    room?.members.push({ socket: wSocket });
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
