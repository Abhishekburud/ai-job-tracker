function SearchBar({
  search,
  setSearch,
  location,
  setLocation,
  fetchJobs,
  loading,
}) {
  return (
    <div className="search-box">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Job role..."
      />
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location..."
      />
      <button onClick={fetchJobs}>
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}

export default SearchBar;