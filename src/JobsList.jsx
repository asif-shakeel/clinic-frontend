import { useEffect, useState } from "react";

export default function JobsList({ token, reloadFlag }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadJobs() {
    setLoading(true);
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/jobs`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setJob(data[0] ?? null);
    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
    const id = setInterval(loadJobs, 5000); // poll
    return () => clearInterval(id);
  }, [reloadFlag]);

  if (loading) return <div>Loading job…</div>;
  if (!job) return <div>No jobs yet</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Latest Analysis</h3>

      <div className="mb-2">
        Status:{" "}
        {job.status === "completed" && "✅ Completed"}
        {job.status === "running" && "⏳ Running"}
        {job.status === "failed" && "❌ Failed"}
      </div>

      {job.status === "failed" && (
        <div className="text-red-600 text-sm">
          {job.error}
        </div>
      )}

      {job.status === "completed" && (
        <div className="mt-3">
          <div className="font-medium mb-1">Results</div>
          {job.result_files.map((f) => (
            <ResultLink
              key={f}
              jobId={job.id}
              filename={f}
              token={token}
            />
          ))}
        </div>
      )}
    </div>
  );
}
