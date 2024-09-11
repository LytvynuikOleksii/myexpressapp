const express = require("express");

const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send("Welcome to my Express App!o World!");
});

app.get("/contact", (req, res) => {
  res.send("Contact us at: contact@example.com");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
