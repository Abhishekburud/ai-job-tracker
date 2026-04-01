import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";

function JobPage() {
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
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="app">
      <Navbar />

      <SearchBar
        search={search}
        setSearch={setSearch}
        location={location}
        setLocation={setLocation}
        fetchJobs={fetchJobs}
        loading={loading}
      />

      {loading && <p className="loading">Loading jobs... ⏳</p>}

      <div className="grid">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobPage;