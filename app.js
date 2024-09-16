const express = require("express");
const sqlite3 = require("sqlite3");

const app = express();
const port = 3000;

app.use(express.json());
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)"
  );
});

let users = {};

app.get("/users", (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(row);
  });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  db.run(
    `INSERT INTO users (name, email) VALUES (?, ?)`,
    [name, email],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  db.run(
    `UPDATE users SET name = ?, email = ? WHERE id = ?`,
    [name, email, id],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: `Row uodated: ${this.changes}` });
    }
  );
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: `Row deleted: ${this.changes}` });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
