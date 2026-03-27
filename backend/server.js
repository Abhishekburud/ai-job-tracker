require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const axios = require("axios");
const pdfParse = require("pdf-parse");

// Plugins
fastify.register(cors, { origin: "*" });
fastify.register(require("@fastify/multipart"));

// Storage
let resumeText = "";
let applications = [];

// ==========================
// 🔹 MATCH SCORE (FREE LOGIC)
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
// 🔹 JOBS API (ADZUNA)
// ==========================
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
    console.log(err);
    return reply.status(500).send({ error: "Failed to fetch jobs" });
  }
});

// ==========================
// 🔹 UPLOAD RESUME
// ==========================
fastify.post("/upload", async (req, reply) => {
  const data = await req.file();
  const buffer = await data.toBuffer();

  const parsed = await pdfParse(buffer);
  resumeText = parsed.text;

  return { message: "Resume uploaded" };
});

// ==========================
// 🔹 APPLY
// ==========================
fastify.post("/apply", async (req) => {
  const { jobId, title } = req.body;

  applications.push({
    jobId,
    title,
    status: "Applied",
  });

  return { message: "Saved" };
});

// ==========================
fastify.get("/applications", async () => applications);

// ==========================
// 🔹 AI (FREE LOGIC)
// ==========================
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
fastify.listen(
  { port: process.env.PORT || 3000, host: "0.0.0.0" },
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("🚀 Server running");
  }
);