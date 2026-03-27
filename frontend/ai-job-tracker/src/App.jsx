import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("frontend developer");
  const [location, setLocation] = useState("bangalore");
  const [loading, setLoading] = useState(false);
const fetchJobs = async () => {
  try {
    setLoading(true);

    const res = await axios.get(
      `https://ai-job-tracker-backend-401j.onrender.com/jobs?what=${search}&where=${location}`
    );

    setJobs(res.data);
  } catch (err) {
    console.log("ERROR:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="app-container">
      {/* Background Blurs for Glassmorphism Effect */}
      <div className="blur-circle primary"></div>
      <div className="blur-circle secondary"></div>

      <header className="header">
        <h1 className="title">AI Job Tracker</h1>
        <p className="subtitle">Intelligence-driven career matching</p>
      </header>

      {/* Modern Search Bar */}
      <div className="search-glass-box">
        <div className="input-group">
          <label>Job Role</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Frontend"
          />
        </div>
        <div className="divider"></div>
        <div className="input-group">
          <label>Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bangalore"
          />
        </div>
        <button className="search-btn" onClick={fetchJobs}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Job Grid */}
      <div className="grid">
          {loading && <p style={{ color: "white" }}>Loading jobs... ⏳</p>}
        {jobs.map((job) => (
          <div className="glass-card" key={job.id}>
            <div className="card-header">
              <div className="company-info">
                <div className="company-logo-placeholder">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h2 className="job-title">{job.title}</h2>
                  <p className="company-name">{job.company}</p>
                </div>
              </div>
              
              {/* Data Visualization: Match Score Circle */}
              <div className="match-visual">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className="circle"
                    strokeDasharray={`${job.matchScore || 50}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">{job.matchScore || 50}%</text>
                </svg>
                <span className="match-label">Match</span>
              </div>
            </div>

            <div className="location-tag">
              <span className="icon">📍</span> {job.location}
            </div>

            <p className="description">
              {job.description ? job.description.slice(0, 100) + "..." : "No description available."}
            </p>

            <div className="card-footer">
              <button
                className="apply-glass-btn"
                onClick={() => window.open(job.redirect_url)}
              >
                Apply Now
              </button>
              <button className="compare-btn">Compare</button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="load-more">Load More</button>
    </div>
  );
}

export default App;