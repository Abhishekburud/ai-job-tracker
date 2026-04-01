function JobCard({ job }) {
  return (
    <div className="card">

      <div className="card-top">
        <div className="logo">
          <img
            src={`https://logo.clearbit.com/${job.company}.com`}
            onError={(e) => (e.target.style.display = "none")}
            alt="logo"
          />
        </div>

        <div>
          <h3>{job.title}</h3>
          <p>{job.company}</p>
        </div>

        <div className="match">
          {job.matchScore || 50}%
        </div>
      </div>

      <p className="location">📍 {job.location}</p>

      <p className="desc">
        {job.description?.slice(0, 100)}...
      </p>

      <div className="card-actions">
        <button
          className="apply"
          onClick={() => window.open(job.redirect_url)}
        >
          Apply
        </button>
        <button className="save">Save</button>
      </div>
    </div>
  );
}

export default JobCard;