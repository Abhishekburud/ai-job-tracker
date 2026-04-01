import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
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
  <div className="p-6 relative">

    {/* Background Glow */}
    <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-indigo-500 opacity-30 blur-[120px]"></div>
    <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-500 opacity-30 blur-[120px]"></div>

    {/* Navbar */}
    <Navbar />

    {/* Search Bar */}
    <SearchBar
      search={search}
      setSearch={setSearch}
      location={location}
      setLocation={setLocation}
      fetchJobs={fetchJobs}
      loading={loading}
    />

    {/* Loading */}
    {loading && (
      <p className="text-center text-gray-400">Loading... ⏳</p>
    )}

    {/* Jobs */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>

  </div>
);
}

export default JobPage;