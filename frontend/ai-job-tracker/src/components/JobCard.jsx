function JobCard({ job }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:scale-[1.02] transition duration-300">

      {/* Header */}
      <div className="flex justify-between items-center">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold">
            {job.company.charAt(0)}
          </div>

          <div>
            <h2 className="font-semibold text-lg">{job.title}</h2>
            <p className="text-sm text-gray-400">{job.company}</p>
          </div>
        </div>

        <div className="text-sm bg-indigo-500/20 px-3 py-1 rounded-full">
          {job.matchScore || 50}%
        </div>
      </div>

      {/* Location */}
      <p className="text-sm text-gray-400 mt-3">📍 {job.location}</p>

      {/* Description */}
      <p className="text-sm text-gray-300 mt-3 line-clamp-3">
        {job.description}
      </p>

      {/* Button */}
      <button
        onClick={() => window.open(job.redirect_url)}
        className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:scale-105 transition"
      >
        Apply Now
      </button>
    </div>
  );
}

export default JobCard;