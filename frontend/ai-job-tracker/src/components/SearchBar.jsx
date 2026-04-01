function SearchBar({ search, setSearch, location, setLocation, fetchJobs, loading }) {
  return (
    <div className="flex gap-3 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
      
      <input
        className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-white outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Job role (e.g. Frontend)"
      />

      <input
        className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-white outline-none"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location (e.g. Bangalore)"
      />

      <button
        onClick={fetchJobs}
        className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:scale-105 transition"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}

export default SearchBar;