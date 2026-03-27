// we will upgrade this later with LangChain
function dummyAI(resume, job) {
  return {
    score: Math.floor(Math.random() * 100),
    reason: "Basic keyword match",
  };
}

module.exports = { dummyAI };