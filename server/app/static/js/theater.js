const theater = document.getElementsByClassName("theater")[0];
const readyBtn = document.getElementsByClassName("readyBtn")[0];
readyBtn.addEventListener("click", () => {
  readyBtn.classList.add("hidden");
  theater.classList.remove("hidden");
});

const videoPlayer = videojs("video-player");
const socket = new WebSocket(`ws://${location.hostname}:8080`);
const params = new URLSearchParams(location.search);
videoPlayer.src(params.get("source"));

const startPlayback = () => {
  socket.send("start");
  console.log("Video started");
};
const pausePlayback = () => {
  socket.send("pause");
  console.log("Video paused");
};
const seekTimeline = () => {
  console.log("User skipped or clicked on the timeline");
  socket.send(`setTime ${videoPlayer.currentTime()}`);
};

videoPlayer.on("play", startPlayback);

videoPlayer.on("pause", pausePlayback);

videoPlayer.on("seeked", seekTimeline);

socket.addEventListener("message", function (event) {
  console.log(`Received ${event.data} command`);
  var command = event.data;
  if (command === "start") {
    videoPlayer.play();
  } else if (command === "pause") {
    videoPlayer.pause();
  } else if (command.includes("setTime")) {
    const newTime = command.split(" ")[1];
    if (newTime != videoPlayer.currentTime()) {
      videoPlayer.currentTime(newTime);
    }
  }
});

function socketInit() {}
