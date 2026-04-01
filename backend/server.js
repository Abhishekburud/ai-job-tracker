require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));


const fastify = require("fastify")({
  logger: true,
});

const cors = require("@fastify/cors");
const axios = require("axios");
const pdfParse = require("pdf-parse");

// ==========================
// ✅ PLUGINS
// ==========================

fastify.register(require("./routes/auth"));

// CORS (Production Safe)
fastify.register(require("@fastify/cors"), {
  origin: (origin, cb) => {
    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return cb(null, true);

    // allow localhost
    if (origin.includes("localhost")) {
      return cb(null, true);
    }

    // allow ALL vercel deployments (IMPORTANT 🔥)
    if (origin.includes("vercel.app")) {
      return cb(null, true);
    }

    // block others
    cb(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "POST"],
});

fastify.register(require("@fastify/multipart"));


const { verifyToken, isAdmin } = require("./middleware/auth");

// Add Job
fastify.post("/admin/jobs", { preHandler: [verifyToken, isAdmin] }, async (req) => {
  return { message: "Job added (for now static)" };
});

// View Users
const User = require("./models/User");

fastify.get("/admin/users", { preHandler: [verifyToken, isAdmin] }, async () => {
  return await User.find();
});

// View Applications
fastify.get("/admin/applications", { preHandler: [verifyToken, isAdmin] }, async () => {
  return applications;
});

// ==========================
// ✅ GLOBAL STORAGE (TEMP)
// ==========================

let resumeText = "";
let applications = [];

// ==========================
// ✅ UTILITY: MATCH SCORE
// ==========================

const getMatchScore = (resume, jobDesc) => {
  if (!resume) return 50;

  const skills = ["react", "node", "java", "python", "javascript"];

  let score = 0;

  skills.forEach((skill) => {
    if (
      resume.toLowerCase().includes(skill) &&
      jobDesc.toLowerCase().includes(skill)
    ) {
      score += 20;
    }
  });

  return Math.min(score, 100);
};

// ==========================
// ✅ ROUTES
// ==========================

// 🔹 Health Check (IMPORTANT for Render)
fastify.get("/", async () => {
  return { status: "API is running 🚀" };
});

// 🔹 JOBS API
fastify.get("/jobs", async (req, reply) => {
  try {
    const { what = "developer", where = "india" } = req.query;

    const response = await axios.get(
      "https://api.adzuna.com/v1/api/jobs/in/search/1",
      {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_APP_KEY,
          what,
          where,
        },
      }
    );

    const jobs = response.data.results.slice(0, 10).map((job, index) => ({
      id: index,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      redirect_url: job.redirect_url,
      matchScore: getMatchScore(resumeText, job.description),
    }));

    return jobs;
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: "Failed to fetch jobs" });
  }
});

// 🔹 UPLOAD RESUME
fastify.post("/upload", async (req, reply) => {
  try {
    const data = await req.file();
    const buffer = await data.toBuffer();

    const parsed = await pdfParse(buffer);
    resumeText = parsed.text;

    return { message: "Resume uploaded successfully" };
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: "Upload failed" });
  }
});

// 🔹 APPLY JOB
fastify.post("/apply", async (req, reply) => {
  try {
    const { jobId, title } = req.body;

    applications.push({
      jobId,
      title,
      status: "Applied",
      appliedAt: new Date(),
    });

    return { message: "Application saved" };
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ error: "Failed to save application" });
  }
});

// 🔹 GET APPLICATIONS
fastify.get("/applications", async () => {
  return applications;
});

// 🔹 AI HELPER
fastify.post("/ai", async (req) => {
  const { query } = req.body;

  const q = query.toLowerCase();

  return {
    role: q.includes("frontend")
      ? "frontend developer"
      : q.includes("backend")
      ? "backend developer"
      : "developer",
    location: q.includes("bangalore") ? "bangalore" : "india",
    workMode: q.includes("remote") ? "remote" : "onsite",
  };
});

// ==========================
// ✅ START SERVER
// ==========================

const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
    });

    console.log("🚀 Server running on production");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();