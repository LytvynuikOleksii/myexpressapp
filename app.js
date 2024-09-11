const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

let users = {};

app.get("/users", (req, res) => {
  res.status(200).json({ users });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users[id];

  if (!user) {
    res.status(404).json({ error: "Користувача не існує" });
    return;
  }

  res.status(200).json({ user: users[id] });
});

app.post("/users", (req, res) => {
  const { id, name, email } = req.body;

  if (users[id]) {
    res.status(409).json({ error: "User already exists" });
    return;
  }

  users[id] = { name, email };
  res.status(201).json({ user: users[id] });
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = users[id];

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  users[id] = { name, email };
  res.status(200).json({ user: users[id] });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users[id];

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  delete users[id];
  res.status(200).json({ message: "User delete successfully" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
