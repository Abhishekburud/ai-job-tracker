function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white/5 backdrop-blur-xl rounded-2xl mb-6 border border-white/10">
      <h1 className="text-xl font-bold tracking-wide">
        AI Job Tracker
      </h1>

      <div className="flex gap-6 text-gray-300">
        <span className="hover:text-white cursor-pointer transition">
          Jobs
        </span>
        <span className="hover:text-white cursor-pointer transition">
          Applications
        </span>
        <span className="hover:text-white cursor-pointer transition">
          Profile
        </span>
      </div>
    </div>
  );
}

export default Navbar;