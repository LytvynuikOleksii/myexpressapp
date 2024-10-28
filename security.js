const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    usreId: user.id,
    username: user.name,
  };

  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "1h" };

  const token = jwt.sign(payload, secret, options);

  return token;
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    return null;
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).send({ error: "No token provaded" });
  }

  const decoded = verifyToken(token);

  if (decoded == null) {
    return res.status(403).send({ error: "Failed to authenticate token" });
  }

  req.user = decoded;

  next();
}

module.exports = {
  authenticateToken,
  generateToken,
};
