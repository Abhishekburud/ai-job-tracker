const jwt = require("jsonwebtoken");

const verifyToken = async (req, reply) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    return reply.status(401).send({ error: "Unauthorized" });
  }
};

const isAdmin = async (req, reply) => {
  if (req.user.role !== "admin") {
    return reply.status(403).send({ error: "Admin only" });
  }
};

module.exports = { verifyToken, isAdmin };