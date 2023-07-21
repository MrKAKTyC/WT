const express = require("express");
const bodyParser = require("body-parser");
const { RoomService } = require("./service/room");

function start(port) {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static("server/app/static"));

  app.get("/api/room/:room", joinRoomHandler);

  app.post("/api/room/", createRoomHandler);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

const createRoomHandler = (req, res) => {
  const source = req.body?.source;
  if (!source) {
    res.status(400).send(`Bad Request '${source}'`);
    return;
  }
  const roomId = RoomService.createRoom(req.body?.source);
  console.log(`Room ${roomId} with source ${source} created`);
  res.json({ roomId, source });
};

const joinRoomHandler = (req, res) => {
  const roomData = RoomService.getRoom(req.params["room"]);
  res.json(roomData);
};
module.exports = { start };
