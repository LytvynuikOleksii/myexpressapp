const express = require("express");
const { PrismaClient } = require("@prisma/client");
const Joi = require("joi");
const NodeCache = require("node-cache");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const cache = new NodeCache();
const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log("Метод", req.method, "і шлях", req.path, "запиту.");
  next();
});

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/status", (req, res) => {
  res.status(200).send("Сервер працює");
});

// Перегляд всіх користувачів
app.get("/users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  try {
    const users = await prisma.user.findMany();
    const usersSlice = users.slice(startIndex, endIndex);
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Перегляд певного користувача
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let user = cache.get(id);

    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      cache.set(id, user);
      console.log(`Користувач з номером ${id} отримано з бази данних`);
    } else {
      console.log(`Користувач з номером ${id} отримано з кешу`);
    }

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Користувача не знайдено" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Створення користувача
// app.post("/users", async (req, res) => {
//   const userData = req.body;
//   const { value, error } = userSchema.validate(userData);
//   if (error) {
//     return res.status(400).json(`Error: ${error.message}`);
//   }
//   const { name, email } = value;

//   try {
//     const user = await prisma.user.create({
//       data: { name, email },
//     });
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// Корегування користувача
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email },
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Видалення користувача
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/register", async (req, res) => {
  const { name, password, email } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        hashedPassword,
        email,
      },
    });

    res.status(200).send("User was created");
  } catch (err) {
    res.status(500).send("Error while creating a user");
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

module.exports = app;
