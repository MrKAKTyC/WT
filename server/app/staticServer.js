const http = require("http");
const fs = require("fs");
const path = require("path");

function start(port) {
  const server = http.createServer((req, res) => {
    // Extract the file path from the request URL
    const reqURL = new URL(req.url, `http://${req.headers.host}`);

    const filePath = path.join(__dirname, reqURL.pathname);
    console.log(`FP: ${filePath}`);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File not found
        res.statusCode = 404;
        res.end("File not found");
        return;
      }

      // Read the file and send it as the response
      fs.readFile(filePath, (err, data) => {
        if (err) {
          // Error reading the file
          res.statusCode = 500;
          res.end("Error reading file");
          return;
        }
        // Set the appropriate content type in the response header
        res.setHeader("Content-Type", "text/html");

        // Send the file content as the response
        res.statusCode = 200;
        res.end(data);
      });
    });
  });

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = { start };
