const theater = document.querySelector(".theater");
const welcome = document.querySelector(".welcome");
const readyBtn = document.querySelector(".readyBtn");
const usernameInput = document.querySelector(".username");
const videoPlayer = videojs("video-player");
const params = new URLSearchParams(location.search);
const room = params.get("room");

playerInit();
readyBtn.addEventListener("click", () => {
  welcome.classList.add("hidden");
  theater.classList.remove("hidden");
  socketInit();
});

function playerInit() {
  fetch(`${location.origin}/api/room/${room}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
      videoPlayer.src(data.source);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function socketInit() {
  const socket = new WebSocket(`ws://${location.hostname}:8080`);
  const username = usernameInput.value;
  socket.addEventListener("open", () => {
    socket.send(prepMsg("join", { username, room }));
  });

  const startPlayback = () => {
    socket.send(prepMsg("start"));
    console.log("Video started");
  };
  const pausePlayback = () => {
    socket.send(prepMsg("pause"));
    console.log("Video paused");
  };
  const seekTimeline = () => {
    socket.send(prepMsg("setTime", videoPlayer.currentTime()));
    console.log("User skipped or clicked on the timeline");
  };

  videoPlayer.on("play", startPlayback);

  videoPlayer.on("pause", pausePlayback);

  videoPlayer.on("seeked", seekTimeline);

  socket.addEventListener("message", function (event) {
    console.log(`Received ${event.data} command`);
    const { command, payload } = JSON.parse(event.data);
    if (command === "start") {
      videoPlayer.play();
    } else if (command === "pause") {
      videoPlayer.pause();
    } else if (command === "setTime") {
      const newTime = payload;
      if (newTime != videoPlayer.currentTime()) {
        videoPlayer.currentTime(newTime);
      }
    }
  });
}

function prepMsg(command, payload) {
  return JSON.stringify({
    command,
    payload,
  });
}
