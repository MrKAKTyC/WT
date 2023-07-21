document.getElementById("newRoom").addEventListener("submit", function (event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const urlEncodedData = new URLSearchParams(formData).toString();

  fetch(`${location.origin}/api/room/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlEncodedData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
      window.location.href = `${location.origin}/theater.html?room=${data.roomId}`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
