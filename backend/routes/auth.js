const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (fastify) {

  fastify.post("/register", async (req) => {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });
    await user.save();

    return { message: "User created" };
  });

  fastify.post("/login", async (req, reply) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return reply.status(400).send({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return reply.status(400).send({ error: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    return { token, role: user.role };
  });

};